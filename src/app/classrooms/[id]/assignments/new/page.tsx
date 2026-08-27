import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getClassroom } from "@/lib/classrooms";
import {
  getItemsForModule,
  getModulesForTrack,
  getTrackById,
  isCompletionItem,
  isOptionalItem,
  itemIdOf,
  itemTitleOf,
  tracks,
} from "@/lib/content";
import { sectionIdOf } from "@/lib/assignments";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  AssignmentForm,
  type AssignmentPickerTrack,
} from "@/components/classrooms/assignment-form";

export const metadata: Metadata = { title: "New assignment" };

export default async function NewAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  // getClassroom already includes every membership — the caller's role is an
  // in-memory find, and non-instructors get the same 404 a stranger gets.
  const classroom = await getClassroom(id);
  if (!classroom) notFound();
  const membership = classroom.memberships.find((m) => m.userId === user.id);
  if (membership?.role !== "instructor") notFound();

  // Stale trackId degrades to the all-tracks picker, same as the roster scope.
  const track = classroom.trackId ? getTrackById(classroom.trackId) : null;
  const scopeTracks = track ? [track] : tracks;
  const groups: AssignmentPickerTrack[] = scopeTracks
    .map((t) => ({
      id: t.id,
      title: scopeTracks.length > 1 ? t.title : null,
      modules: getModulesForTrack(t.id)
        .map((mod) => {
          // The track-complete page is not work to assign.
          const moduleItems = getItemsForModule(mod.id).filter(
            (item) => !isCompletionItem(item),
          );
          return {
            id: mod.id,
            label: `Module ${mod.order}: ${mod.title}`,
            items: moduleItems.map((item) => {
              const itemId = itemIdOf(item);
              return {
                id: itemId,
                title: itemTitleOf(item),
                kind: item.kind,
                optional: isOptionalItem(item),
                indent: Boolean(sectionIdOf(item)),
                sections: moduleItems.filter(
                  (child) => sectionIdOf(child) === itemId,
                ).length,
              };
            }),
          };
        })
        .filter((mod) => mod.items.length > 0),
    }))
    .filter((group) => group.modules.length > 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
      <Breadcrumbs
        items={[
          { label: "Classrooms", href: "/classrooms" },
          { label: classroom.name, href: `/classrooms/${classroom.id}` },
          { label: "New assignment" },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight">New assignment</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Pick the lessons and papers your students should complete. Completion
        comes straight from their track progress — nothing extra for them to
        turn in.
      </p>
      <div className="mt-6">
        <AssignmentForm classroomId={classroom.id} groups={groups} />
      </div>
    </main>
  );
}
