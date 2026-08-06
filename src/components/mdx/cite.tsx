/**
 * A citation marker in running prose: <Cite n="14,21" />.
 *
 * The bracket numbers arrive from the outline as literal `[14][21]`, which as
 * plain markdown links rendered two full-size, underlined, destructive-coloured
 * bracket pairs jammed together mid-sentence. That reads as broken markup
 * rather than as a reference, so the numbers get their own component.
 *
 * What it does: one superscript group, one pair of brackets however many
 * sources are cited, numbers comma-separated, each its own link to the entry
 * in that lesson's Sources section. Muted until hovered, because a citation is
 * an offer to go and check rather than something to pull the eye off the
 * sentence.
 *
 * `not-prose` is load-bearing. Without it the lesson's anchor styling puts the
 * body underline and link colour back, which is the thing this exists to fix.
 *
 * The target lives in the same lesson by construction. A number whose entry
 * sits in a different lesson is a reference to nothing on a per-lesson reader,
 * so `Sources` is repeated per lesson rather than centralised.
 */
export interface CiteProps {
  /** Comma-separated reference numbers, in the order they should print. */
  n: string;
}

export function Cite({ n }: CiteProps) {
  const nums = n
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  if (nums.length === 0) return null;

  const parts = groupRuns(nums);

  return (
    <sup className="not-prose ml-0.5 text-[0.7em] leading-none font-medium">
      <span className="text-muted-foreground">[</span>
      {parts.map((part, i) => (
        <span key={part.join("-")}>
          {i > 0 ? <span className="text-muted-foreground">,&nbsp;</span> : null}
          <Ref num={part[0]} />
          {part.length > 1 ? (
            <>
              <span className="text-muted-foreground">–</span>
              <Ref num={part[part.length - 1]} />
            </>
          ) : null}
        </span>
      ))}
      <span className="text-muted-foreground">]</span>
    </sup>
  );
}

function Ref({ num }: { num: string }) {
  return (
    <a
      href={`#ref-${num}`}
      className="text-muted-foreground hover:text-foreground no-underline hover:underline underline-offset-2"
    >
      {num}
    </a>
  );
}

/**
 * Consecutive numbers print as a range: [7, 8, 9, 10, 11, 12] is noise, [7–12]
 * is a citation. Only runs of three or more collapse, because "[3–4]" costs a
 * character over "[3, 4]" and reads worse. Both ends of a range stay clickable;
 * the numbers between them are reachable from the Sources list itself.
 */
function groupRuns(nums: string[]): string[][] {
  const runs: string[][] = [];
  for (const num of nums) {
    const last = runs[runs.length - 1];
    if (last && Number(num) === Number(last[last.length - 1]) + 1) last.push(num);
    else runs.push([num]);
  }
  return runs.flatMap((run) => (run.length >= 3 ? [run] : run.map((x) => [x])));
}
