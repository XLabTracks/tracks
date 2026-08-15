import Link from "next/link";
import { FT_SESSIONS } from "@/lib/verification/data/facilitator-training";

/**
 * The facilitator training, on the page an instructor is already standing on.
 *
 * These are the five sessions that train the facilitator — not the field
 * guide's plans for running the course's own sessions, which are a different
 * thing and live one click further in.
 *
 * Materials, not a course: no progress, no completion, nothing to enrol in.
 * The panel names the five sessions and sends you to the materials; the one
 * thing that takes a booking is the simulation in session 5, and that offer
 * belongs beside the session rather than under the whole list.
 */
export function FacilitatorPanel({ classroomId }: { classroomId: string }) {
  return (
    <section className="border-border shadow-soft mt-8 rounded-xl border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-medium">Facilitator training</h2>
        <Link
          href={`/verification/cohort/${classroomId}`}
          className="text-sm underline underline-offset-4"
        >
          Cohort and submitted tasks
        </Link>
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
              <span className="text-muted-foreground text-xs">
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
    </section>
  );
}
