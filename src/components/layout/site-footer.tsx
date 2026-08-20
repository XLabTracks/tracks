import Link from "next/link";

/**
 * The app's own footer.
 *
 * It exists because the app had none: every page outside Verification simply
 * stopped, while the course's pages closed properly. AppFooter used to render
 * nothing here and said adding one was a design decision rather than a side
 * effect — this is that decision taken.
 *
 * Every entry is a route this app actually serves, and the list matches the
 * header's: /exercises and /demos stay out because the header hides them on
 * purpose — the routes are live for deep links and lesson embeds, but they are
 * not surfaced in navigation, and a footer is navigation.
 *
 * The course's footer keeps a few labels with no destination yet and prints
 * them as plain text rather than dead links; nothing here is pending, so
 * nothing needs that. If something ever is, copy that treatment rather than
 * pointing it somewhere plausible.
 *
 * Deliberately not a copy of the course footer: that one wears the course's
 * palette and its own class names from theme.css, and this one has to work on
 * the app's tokens. Two footers, one for each identity, is the same split the
 * header already makes.
 */

const SECTIONS: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "Learn",
      links: [
        { label: "Tracks", href: "/tracks" },
        { label: "Review", href: "/review" },
        { label: "Resources", href: "/resources" },
      ],
    },
    {
      heading: "Your account",
      links: [
        { label: "Account", href: "/account" },
        { label: "My classrooms", href: "/classrooms" },
      ],
    },
  ];

export function SiteFooter() {
  return (
    <footer className="border-border/80 mt-16 border-t">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-6">
        <div className="flex flex-wrap gap-10">
          <div className="min-w-48 flex-1">
            {/* The header's wordmark, in words: the footer already links XLab
                out and says what it is, so the logotype would be the third time
                on one screen. Same order and same connector, so it is the same
                name and not a second one. */}
            <p className="text-sm font-bold tracking-tight">
              Tracks <span className="text-muted-foreground font-normal">@</span>{" "}
              XLab
            </p>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
              Courses on AI safety from the Existential Risk Laboratory at the
              University of Chicago.
            </p>
            <p className="mt-3 text-sm">
              <a
                className="underline underline-offset-4"
                href="https://xrisk.uchicago.edu"
                target="_blank"
                rel="noopener"
              >
                XLab
              </a>
            </p>
          </div>

          {/* select-none, like the header's nav and the sidebar's rows: these
              are destinations, not text. The XLab link and the description
              above stay selectable — a credit is content. */}
          {SECTIONS.map((section) => (
            <nav
              key={section.heading}
              aria-label={section.heading}
              className="select-none"
            >
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {section.heading}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      className="text-sm underline-offset-4 hover:underline"
                      href={l.href}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="text-muted-foreground mt-10 text-xs">© 2026 XLab.</p>
      </div>
    </footer>
  );
}
