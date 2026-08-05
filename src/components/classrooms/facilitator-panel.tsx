import Link from "next/link";
import { FT_SESSIONS } from "@/lib/verification/data/facilitator-training";

/**
 * The facilitator training, on the page an instructor is already standing on.
 *
 * These are the five sessions that train the facilitator — not the field
 * guide's plans for running the course's own sessions, which are a different
 * thing and live one click further in.
 *
 * Materials, not a course: no progress, no completion, nothing to click
 * through. Each session is run live with a group, so the row says what it is
 * about and the panel sends you to sign up rather than offering an exercise
 * that would have to be invented.
 */
export function FacilitatorPanel() {
  return (
    <section className="border-border shadow-soft mt-8 rounded-xl border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-medium">Facilitator training</h2>
        <Link
          href="/verification/facilitator"
          className="text-sm underline underline-offset-4"
        >
          Materials and the field guide
        </Link>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Five live sessions on leading discussions, workshops and research group
        sessions, built around the course doc and the question map.
      </p>
      <ol className="mt-4 space-y-2">
        {FT_SESSIONS.map((s) => (
          <li key={s.n} className="border-border rounded-lg border px-3 py-2">
            <p className="text-sm">
              <span className="text-muted-foreground font-mono text-xs">
                Session {s.n}
              </span>{" "}
              <span className="font-medium">{s.title}</span>
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              {s.focus[0]}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm">
        <Link
          className="underline underline-offset-4"
          href="/verification/facilitator#signup"
        >
          Sign up for the facilitator training
        </Link>
      </p>
    </section>
  );
}
