/**
 * Consistency checks for the Verification track's native React widgets: every
 * registered exercise must have a widget, a content-graph lesson (`v-<id>`),
 * and an MDX body that embeds it — and vice versa. (The interactives used to be
 * standalone HTML pages under public/verification/; they are now React widgets
 * in src/components/verification/widgets/, so the old static-site checks are
 * gone. Widget behaviour is covered by the engine unit tests in
 * src/lib/verification/engines/*.test.ts and browser smoke.)
 */
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { lessons, modules, tracks } from "@/content/curriculum.data";
import {
  verificationExercises,
  verificationLessonId,
} from "@/lib/verification/exercises";
import { verificationWidgets } from "@/components/verification/widgets/registry";

const LESSONS_DIR = join(__dirname, "../../content/lessons");

const track = tracks.find((t) => t.id === "verification");
const trackModuleIds = new Set(track?.moduleIds ?? []);
const trackLessons = lessons.filter((l) => trackModuleIds.has(l.moduleId));

describe("verification track structure", () => {
  it("the verification track exists with its modules", () => {
    expect(track).toBeTruthy();
    for (const moduleId of track!.moduleIds) {
      expect(
        modules.some((m) => m.id === moduleId && m.trackId === "verification"),
        moduleId + " missing or mis-parented",
      ).toBe(true);
    }
  });
});

describe("registry ↔ widget ↔ content graph ↔ MDX", () => {
  it("every registered exercise has a native widget", () => {
    for (const exercise of verificationExercises) {
      expect(
        verificationWidgets[exercise.id],
        exercise.id + " has no widget in widgets/registry.tsx",
      ).toBeTruthy();
    }
  });

  it("every widget maps back to a registered exercise", () => {
    const ids = new Set(verificationExercises.map((e) => e.id));
    for (const id of Object.keys(verificationWidgets)) {
      expect(ids.has(id), id + " widget has no registry entry").toBe(true);
    }
    expect(Object.keys(verificationWidgets).length).toBe(
      verificationExercises.length,
    );
  });

  // An exercise that has its own lesson must be that exercise: a v-<id> lesson
  // whose body embeds some other widget is a mis-wiring the route would render
  // without complaint. Exercises embedded only inside prose have no v-<id>
  // lesson and are covered by the next check instead.
  it("a v-<id> lesson embeds the exercise it is named for", () => {
    for (const exercise of verificationExercises) {
      const lessonId = verificationLessonId(exercise.id);
      const lesson = trackLessons.find((l) => l.id === lessonId);
      if (!lesson) continue;
      const mdxPath = join(LESSONS_DIR, lesson.contentRef + ".mdx");
      expect(existsSync(mdxPath), lesson.contentRef + ".mdx missing").toBe(true);
      expect(
        readFileSync(mdxPath, "utf8"),
        mdxPath + " must embed its exercise",
      ).toContain(`<VerificationExercise id="${exercise.id}" />`);
    }
  });

  // Two ways a widget reaches a learner: its own lesson (v-<id>, the usual
  // case) or embedded inside a prose lesson, which is what 0.2 does with the
  // landscape. So the invariant is "every registered exercise is embedded
  // somewhere in this track", not "every lesson is an exercise" — that was
  // true only while the track was nothing but interactives.
  it("every registered exercise is embedded by a lesson in the track", () => {
    const embeds = new Map<string, string[]>();
    for (const lesson of trackLessons) {
      const mdx = join(LESSONS_DIR, `${lesson.contentRef}.mdx`);
      if (!existsSync(mdx)) continue;
      const body = readFileSync(mdx, "utf8");
      for (const exercise of verificationExercises) {
        if (body.includes(`id="${exercise.id}"`)) {
          embeds.set(exercise.id, [...(embeds.get(exercise.id) ?? []), lesson.id]);
        }
      }
    }
    for (const exercise of verificationExercises) {
      expect(
        embeds.get(exercise.id),
        exercise.id + " is registered but no lesson embeds it",
      ).toBeTruthy();
    }
  });
});

/* The item page renders the lesson title as the page's h1 (see
 * [itemSlug]/page.tsx). An MDX body that opens with its own `# Title` puts the
 * heading on screen twice at h1 size — which has now happened three times, on
 * every batch of lessons transcribed from the outline, because the outline
 * carries its numbered heading and transcribing it verbatim is the obvious
 * thing to do. AUTHORING.md's example starts a lesson body at `##`.
 *
 * Fix by deleting the leading `# ...` line, not by changing the page. */
describe("verification lesson bodies", () => {
  it("no lesson repeats its own title as a leading h1", () => {
    const offenders: string[] = [];
    for (const lesson of trackLessons) {
      const mdx = join(LESSONS_DIR, `${lesson.contentRef}.mdx`);
      if (!existsSync(mdx)) continue;
      const first = readFileSync(mdx, "utf8")
        .split("\n")
        .find((line) => line.trim().length > 0);
      if (first?.startsWith("# ")) offenders.push(`${lesson.contentRef}.mdx -> ${first}`);
    }
    expect(offenders, "these bodies open with an h1 the page already renders").toEqual([]);
  });
});
