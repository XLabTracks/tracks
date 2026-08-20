import Link from "next/link";
import {
  FT_HEADER,
  FT_SESSIONS,
  FT_TOOLS,
  FT_TOOLS_NOTE,
} from "@/lib/verification/data/facilitator-training";

export function FacilitatorTraining() {
  return (
    <section>
      <h3 className="text-base font-semibold tracking-tight">
        {FT_HEADER.title}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        {FT_HEADER.lede}
      </p>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed">
        Facilitators in our program receive two core tools:
      </p>
      <ul className="mt-2 max-w-2xl space-y-2">
        {FT_TOOLS.map((t) => (
          <li key={t.name} className="text-sm leading-relaxed">
            <span className="font-medium">{t.name}</span>:{" "}
            <span className="text-muted-foreground">{t.desc}</span>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        {FT_TOOLS_NOTE}
      </p>

      <ol className="mt-6 max-w-2xl space-y-4">
        {FT_SESSIONS.map((s) => (
          <li
            key={s.n}
            className="border-border rounded-lg border p-4"
          >
            <p className="text-sm font-medium">
              <span className="text-muted-foreground text-xs">
                Session {s.n}
              </span>{" "}
              {s.title}
            </p>
            {s.focus.map((line, i) => (
              <p
                key={i}
                className="text-muted-foreground mt-2 text-sm leading-relaxed"
              >
                {line}
              </p>
            ))}

            {s.materials.length > 0 && (
              <>
                <p className="text-muted-foreground mt-3 text-xs font-medium tracking-wide uppercase">
                  Additional materials
                </p>
                <ul className="mt-1 space-y-1">
                  {s.materials.map((m) => (
                    <li key={m.title} className="text-sm leading-relaxed">
                      {m.href ? (
                        <a
                          className="underline underline-offset-4"
                          href={m.href}
                          target="_blank"
                          rel="noopener"
                        >
                          {m.title}
                        </a>
                      ) : (
                        <span>{m.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {s.signUp && (
              <p className="mt-3 text-sm">
                <Link
                  className="underline underline-offset-4"
                  href="/verification/facilitator#signup"
                >
                  {s.signUp}
                </Link>{" "}
                <span className="text-muted-foreground">
                  — it needs a room and people to run it against.
                </span>
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
