import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { lessons, modules, tracks } from "@/content/curriculum.data";
import { isLessonTitleHeading } from "@/lib/content/lesson-heading";
import {
  verificationExercises,
  verificationLessonId,
} from "@/lib/verification/exercises";
import { verificationWidgets } from "@/components/verification/widgets/registry";

const LESSONS_DIR = join(__dirname, "../../content/lessons");
const REGISTRY_SOURCE = readFileSync(
  join(__dirname, "../../components/verification/widgets/registry.tsx"),
  "utf8",
);
const EXERCISE_COMPONENT_SOURCE = readFileSync(
  join(__dirname, "../../components/verification/verification-exercise.tsx"),
  "utf8",
);

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
  it("lazy-loads each widget instead of shipping the whole registry", () => {
    expect(REGISTRY_SOURCE).toContain('import dynamic from "next/dynamic"');
    expect(REGISTRY_SOURCE).not.toMatch(/^import \{[^}]+\} from "\.\//m);
  });

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

describe("widget completion reads", () => {
  it("only checks server completion for widgets that can report it", () => {
    expect(EXERCISE_COMPONENT_SOURCE).toMatch(
      /user && exercise\.bridged \? await isLessonCompleted/,
    );
  });
});

describe("verification lesson bodies", () => {
  const headingsOf = (body: string) =>
    [...body.matchAll(/^#{1,6}[ \t]+(.+?)[ \t]*$/gm)].map((m) => m[1]);

  it("catches every heading in the track that repeats its lesson's title", () => {
    const missed: string[] = [];
    for (const lesson of trackLessons) {
      const mdx = join(LESSONS_DIR, `${lesson.contentRef}.mdx`);
      if (!existsSync(mdx)) continue;
      for (const heading of headingsOf(readFileSync(mdx, "utf8"))) {
        const looksLikeTitle =
          heading.replace(/\s+/g, " ").trim().toLowerCase() ===
          lesson.title.replace(/\s+/g, " ").trim().toLowerCase();
        if (looksLikeTitle && !isLessonTitleHeading(heading, lesson.title)) {
          missed.push(`${lesson.contentRef}.mdx -> ${heading}`);
        }
      }
    }
    expect(missed, "these would render the title a second time").toEqual([]);
  });

  it("matches across the punctuation the outline varies", () => {
    expect(
      isLessonTitleHeading(
        "2.1.2  Measuring, classifying and controlling use.",
        "2.1.2 Measuring, classifying and controlling use",
      ),
    ).toBe(true);
    expect(
      isLessonTitleHeading("“How much compute occurred?”", '"How much compute occurred?"'),
    ).toBe(true);
  });

  it("keeps a heading that is not the title", () => {
    expect(isLessonTitleHeading("2.1.2A Compute accounting", "2.1.2 Measuring use")).toBe(false);
    expect(isLessonTitleHeading("", "2.1.2 Measuring use")).toBe(false);
  });
});
