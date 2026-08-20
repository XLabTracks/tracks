import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PACKET_TASKS, type TaskPart } from "@/lib/verification/data/packet-tasks";

const WIDGET = readFileSync(
  join(__dirname, "../../components/verification/widgets/packet-tasks.tsx"),
  "utf8",
);

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
    const caps = Object.fromEntries(PACKET_TASKS.map((t) => [t.n, t.maxWords]));
    expect(caps).toEqual({ 1: 200, 2: 200, 3: 200, 4: 200, 5: 300 });
  });

  it("exactly one task is compulsory — her rule reads off it", () => {
    expect(PACKET_TASKS.filter((t) => t.compulsory).map((t) => t.n)).toEqual([5]);
  });
});

describe("the packet's keys", () => {
  it("are presented as commentary, never as a model answer", () => {
    expect(WIDGET).toContain("Indicative answer and commentary");
    expect(WIDGET).not.toMatch(/>\s*Model answer\s*</);
  });

  it("every task has a key", () => {
    for (const task of PACKET_TASKS) {
      expect(words(task.answer), `Task ${task.n} has no key`).toBeGreaterThan(0);
    }
  });

  it("stay within reach of the limit they comment on", () => {
    const runaway = PACKET_TASKS.filter(
      (task) => words(task.answer) > task.maxWords * 2,
    ).map((task) => `Task ${task.n}: ${words(task.answer)} vs cap ${task.maxWords}`);
    expect(runaway, "a key this far over is no longer commentary").toEqual([]);
  });
});
