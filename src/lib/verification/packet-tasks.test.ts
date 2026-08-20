/**
 * The 0.3 packet's limits, and what the keys are allowed to be.
 *
 * The keys ran past the word ceilings the tasks set — Task 5 at double —
 * while calling themselves model answers. There were three ways out and only
 * one of them was free: compressing the keys would have cost the reasoning
 * her audit had just approved, and raising the caps to the keys' length would
 * have broken the hour, which is Task 5 plus one of Tasks 1–4 and nothing
 * more. So the caps went up once, to her numbers, and the keys stopped
 * claiming to be models.
 *
 * What is pinned here is therefore not "key ≤ cap". It is the pair of facts
 * that make an over-length key honest: the caps are the ones she set, and the
 * surface calls the key commentary rather than a model answer.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PACKET_TASKS, type TaskPart } from "@/lib/verification/data/packet-tasks";

const WIDGET = readFileSync(
  join(__dirname, "../../components/verification/widgets/packet-tasks.tsx"),
  "utf8",
);

/** Every word a part puts on screen, counted the way a reader would. */
function words(parts: TaskPart[]): number {
  const text = parts
    .map((part) => {
      switch (part.kind) {
        case "p":
        case "quote":
        case "h":
          return part.text;
        case "ul":
        case "ol":
          return part.items.join(" ");
        case "table":
          return [...part.head, ...part.rows.flat()].join(" ");
      }
    })
    .join(" ");
  return (text.trim().match(/\S+/g) ?? []).length;
}

describe("the packet's word limits", () => {
  it("are the ones the hour was sized for", () => {
    // Raising these is a change to what the session is, not a formatting
    // tweak: the learner writes Task 5 and one of Tasks 1–4 inside the hour.
    const caps = Object.fromEntries(PACKET_TASKS.map((t) => [t.n, t.maxWords]));
    expect(caps).toEqual({ 1: 200, 2: 200, 3: 200, 4: 200, 5: 300 });
  });

  it("exactly one task is compulsory — her rule reads off it", () => {
    // "Task 5 and any one of Tasks 1–4": the widget's completion rule counts
    // the compulsory ones, so a second one silently changes what finishing is.
    expect(PACKET_TASKS.filter((t) => t.compulsory).map((t) => t.n)).toEqual([5]);
  });
});

describe("the packet's keys", () => {
  it("are presented as commentary, never as a model answer", () => {
    // The one thing that makes an over-length key honest.
    expect(WIDGET).toContain("Indicative answer and commentary");
    expect(WIDGET).not.toMatch(/>\s*Model answer\s*</);
  });

  it("every task has a key", () => {
    for (const task of PACKET_TASKS) {
      expect(words(task.answer), `Task ${task.n} has no key`).toBeGreaterThan(0);
    }
  });

  it("stay within reach of the limit they comment on", () => {
    /* Commentary may exceed the cap; it may not become an essay. Twice the
       learner's ceiling is the line — past it the key stops demonstrating an
       answer at all, which is how the last round's Task 5 (435 against 220)
       went unnoticed. This is a smoke alarm, not a style rule. */
    const runaway = PACKET_TASKS.filter(
      (task) => words(task.answer) > task.maxWords * 2,
    ).map((task) => `Task ${task.n}: ${words(task.answer)} vs cap ${task.maxWords}`);
    expect(runaway, "a key this far over is no longer commentary").toEqual([]);
  });
});
