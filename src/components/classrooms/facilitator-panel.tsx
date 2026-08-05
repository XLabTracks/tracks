import Link from "next/link";
import { FG_SESSION_CARDS } from "@/lib/verification/data/facilitator-guide";

/**
 * The instructor's way into the Verification facilitator material, on the page
 * where they are already standing.
 *
 * The five session plans are listed rather than left behind the guide's home
 * grid, because the thing an instructor opens this page to do is run the next
 * session — one click, not three. The craft modules stay behind the single
 * link: they are read once, or in a hurry mid-session, and listing all twelve
 * here would bury the five that are the week's work.
 *
 * The per-plan links carry the guide's own view ids in the hash, which is what
 * makes them land on the plan; /verification/facilitator itself is public, so
 * this is a shortcut and not a gate.
 */
export function FacilitatorPanel() {
  return (
    <section className="border-border shadow-soft mt-8 rounded-xl border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-medium">Facilitating this cohort</h2>
        <Link
          href="/verification/facilitator"
          className="text-sm underline underline-offset-4"
        >
          Open the facilitator page
        </Link>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Seven craft modules for five minutes before a session, and a ready-to-run
        plan for each track component — in-person and Zoom versions of each.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {FG_SESSION_CARDS.map((c) => (
          <li key={c.id}>
            <Link
              href={`/verification/facilitator#${c.id}`}
              className="border-border hover:bg-muted/60 block rounded-lg border px-3 py-2"
            >
              <span className="text-muted-foreground font-mono text-xs">{c.num}</span>{" "}
              <span className="text-sm font-medium">{c.title}</span>
              <span className="text-muted-foreground mt-0.5 block text-xs">
                {c.meta}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
