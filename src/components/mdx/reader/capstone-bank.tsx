import bank from "@/content/verification/capstone-bank.json";
// Shared with the static catalogue's VT.bank; bank.test.ts fails on drift.
import { DIFF_GLYPH, STATUS_GLYPH, STATUS_WORD } from "@/lib/verification/bank";

/**
 * The capstone bank, printed inside the unit that sends a learner to it.
 *
 * Choosing a capstone is a comparison, not a sequence, so every brief is on
 * the page at once. Nothing here names a capstone: the entries come from
 * `capstone-bank.json`, generated from `verification-capstones/*.md`, so a new
 * markdown file reaches the learner on its next build with nothing to edit.
 *
 * The bank carries the whole program; this unit prints only the course-fit
 * briefs (`courseFit`, derived by the generator) — the ones a Verification
 * learner can actually take. An other-track brief that qualifies carries its
 * `verificationFit` line, printed on the card, so a Technical Governance
 * heading inside a Verification unit explains itself. The full bank stays one
 * link away.
 *
 * `lead` is the brief the unit is written around — it goes first, marked, and
 * is the only card carrying the workspace shortcut. Every other card links to
 * its sheet on the bank page, which already knows how to start a draft;
 * dozens of cards with two buttons each is a wall, not a choice.
 *
 * Trap: the links carry the slug, never the title. `capstone.html` resolves
 * `?brief=` against this same bank, and a slug it does not carry renders no
 * banner rather than an error.
 */


type Entry = (typeof bank.entries)[number];

const range = (r: { min: number; max: number }) =>
  r.min === r.max ? String(r.min) : `${r.min}–${r.max}`;

function Brief({ e, lead }: { e: Entry; lead: boolean }) {
  const stats = [
    `${range(e.team)}${e.team.max === 1 ? " solo" : " people"}`,
    `${range(e.effort)} hrs`,
    e.duration.label,
    e.perWeek,
  ].filter(Boolean);

  return (
    <article
      className={
        "flex flex-col gap-2 rounded-xl border p-4 " +
        (lead ? "border-primary/50 bg-primary/5" : "border-border bg-card")
      }
    >
      <div className="flex items-center gap-2">
        {lead ? (
          <span className="border-primary/40 text-primary rounded-full border px-2 py-0.5 text-xs select-none">
            this unit&rsquo;s brief
          </span>
        ) : null}
        <span className="text-muted-foreground ml-auto text-xs select-none">
          <span aria-hidden="true" className="inline-block w-[1.15em] text-center">
            {STATUS_GLYPH[e.status] ?? "○"}
          </span>{" "}
          {STATUS_WORD[e.status] ?? e.status}
        </span>
      </div>

      <h3 className="text-base leading-snug font-medium">{e.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{e.summary}</p>
      {e.verificationFit ? (
        <p className="text-muted-foreground text-xs leading-relaxed italic">
          Fits this course: {e.verificationFit}
        </p>
      ) : null}
      <p className="text-muted-foreground text-xs">{stats.join(" · ")}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className="border-border rounded-full border px-2 py-0.5 text-xs select-none">
          <span aria-hidden="true" className="inline-block w-[1.15em] text-center">
            {DIFF_GLYPH[e.difficulty] ?? "●"}
          </span>{" "}
          {e.difficulty}
        </span>
        <span className="border-border rounded-full border px-2 py-0.5 text-xs select-none">
          {e.deliverableType}
        </span>
        <span className="border-border rounded-full border px-2 py-0.5 text-xs select-none">
          {e.mentor === "none" ? "no mentor" : `mentor ${e.mentor}`}
        </span>
      </div>

      <p className="text-sm">
        <span className="text-muted-foreground block text-xs tracking-wide uppercase">
          Deliverable
        </span>
        {e.deliverable}
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <a
          className="border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-sm select-none"
          href={`/verification/capstone-bank#${encodeURIComponent(e.slug)}`}
        >
          Read the full brief
        </a>
        {lead ? (
          <a
            className="border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-sm select-none"
            href={`/verification/capstone?brief=${encodeURIComponent(e.slug)}`}
          >
            Start in the workspace
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function CapstoneBank({ lead }: { lead?: string }) {
  const entries = (bank.entries as Entry[]).filter((e) => e.courseFit);
  if (!entries.length) return null;

  const leadEntry = entries.find((e) => e.slug === lead) ?? null;
  // The lead's own track leads the groups: a learner reading a Verification
  // unit meets the Verification briefs before the program-level ones.
  const first = leadEntry?.track ?? null;
  const rest = entries
    .filter((e) => e !== leadEntry)
    .sort((a, b) => {
      if (a.track === b.track) return a.title.localeCompare(b.title);
      if (a.track === first) return -1;
      if (b.track === first) return 1;
      return a.track.localeCompare(b.track);
    });

  const groups: { track: string; items: Entry[] }[] = [];
  for (const e of rest) {
    const g = groups.at(-1);
    if (g && g.track === e.track) g.items.push(e);
    else groups.push({ track: e.track, items: [e] });
  }

  return (
    <div className="not-prose my-6">
      {leadEntry ? (
        <div className="mb-6 max-w-2xl">
          <Brief e={leadEntry} lead />
        </div>
      ) : null}

      {groups.map((g) => (
        <div key={g.track} className="mb-6">
          <div className="text-muted-foreground mb-3 flex items-center gap-3 text-xs tracking-wide uppercase select-none">
            <span>{g.track}</span>
            <span className="bg-border h-px flex-1" />
            <span>
              {g.items.length} brief{g.items.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {g.items.map((e) => (
              <Brief key={e.slug} e={e} lead={false} />
            ))}
          </div>
        </div>
      ))}

      <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <a
          className="underline underline-offset-4"
          href="/verification/capstone-bank"
        >
          Open the bank — all {bank.entries.length} briefs across the program, with filters, prerequisites and sources →
        </a>
        <a
          className="underline underline-offset-4"
          href="/verification/capstone-signup"
        >
          Sign up for a capstone, or propose your own →
        </a>
      </p>
    </div>
  );
}
