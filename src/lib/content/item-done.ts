import type { ModuleItem } from "./types";

/**
 * When a sidebar row may show a tick.
 *
 * Pure, and deliberately in its own file: the sidebar is a client component,
 * and importing the content accessors would pull the whole graph across with
 * them. Everything here works from a `ModuleItem` and the set of completed
 * content ids the server already sent.
 *
 * The rule is one sentence and it is the whole point of the file: **a row is
 * done only when everything it stands for is done.** A row that answers for
 * work hidden behind it — a paper's inserted lessons, a section head's
 * subsections — must wait for all of it. Otherwise the tick reports the first
 * thing a learner read as the whole of it, which is worse than no tick: it
 * closes a submodule they have barely started.
 */

/** A section head and the subsections that named it (`sectionItemId`). */
export interface ItemGroup {
  item: ModuleItem;
  children: ModuleItem[];
}

/**
 * One item's own units: itself, plus a paper's inserted lessons. This is the
 * client-side twin of getItemProgressContentIds — same rule, no graph.
 */
export function itemDone(item: ModuleItem, completed: Set<string>): boolean {
  if (item.kind === "lesson") return completed.has(item.lesson.id);
  if (!completed.has(item.paper.id)) return false;
  return (item.paper.edits ?? []).every(
    (edit) =>
      edit.op !== "activity" ||
      edit.items.every(
        (inserted) => inserted.kind !== "lesson" || completed.has(inserted.id),
      ),
  );
}

/**
 * A whole group: the head and every subsection under it.
 *
 * Subsections are collapsed by default, so the head's row is the only thing a
 * learner sees of an eight-section submodule like 2.1 Hardware. Ticking it on
 * the head's own lesson alone said "2.1 Hardware — done" to somebody who had
 * read its opening page and nothing else.
 */
export function groupDone(group: ItemGroup, completed: Set<string>): boolean {
  return (
    itemDone(group.item, completed) &&
    group.children.every((child) => itemDone(child, completed))
  );
}
