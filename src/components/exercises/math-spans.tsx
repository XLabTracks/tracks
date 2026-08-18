"use client";

import { useEffect, useState } from "react";

/**
 * The half of MathText that needs KaTeX, split off so the other half does not.
 *
 * KaTeX is 256KB of JavaScript. It was reaching the browser on every `/tracks/*`
 * route because MathText imported it at the top level and thirteen client
 * components import MathText — so a Verification lesson downloaded and parsed
 * the whole maths renderer to display prose. Measured across the content:
 * 242 `$…$` spans in 8 of 142 files, and none of them in Verification.
 *
 * So the import is lazy and it is reached only by a string that actually
 * carries a `$`. A page with no maths never asks for the chunk; a page with
 * maths shows the raw TeX for the moment the chunk is in flight, which is the
 * price of not shipping it to everyone else.
 *
 * The stylesheet comes with it, for the same reason and by the same route.
 * Trap: it is not the only thing that needs those styles — lesson MDX renders
 * its maths at build time through rehype-katex and arrives as finished markup
 * with no component behind it, so `lesson-content.tsx` imports the stylesheet
 * too. Removing either one leaves maths rendered as unstyled fallback glyphs
 * on the surface that lost it.
 */

type Renderer = (tex: string, displayMode: boolean) => string;

/** Resolved once per document, then shared by every span on the page. */
let cached: Renderer | null = null;
let inFlight: Promise<Renderer> | null = null;

function loadKatex(): Promise<Renderer> {
  if (cached) return Promise.resolve(cached);
  if (!inFlight) {
    inFlight = Promise.all([
      import("katex"),
      import("katex/dist/katex.min.css"),
    ]).then(([mod]) => {
      const katex = mod.default;
      cached = (tex, displayMode) => {
        try {
          return katex.renderToString(tex, { throwOnError: false, displayMode });
        } catch {
          return tex;
        }
      };
      return cached;
    });
  }
  return inFlight;
}

const PART = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;

export function MathSpans({ text }: { text: string }) {
  const [render, setRender] = useState<Renderer | null>(cached);

  useEffect(() => {
    if (cached) return;
    let live = true;
    loadKatex().then((r) => {
      if (live) setRender(() => r);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <>
      {text.split(PART).map((part, i) => {
        const display = part.startsWith("$$") && part.endsWith("$$");
        const inline = !display && part.startsWith("$") && part.endsWith("$");
        if (!display && !inline) return <span key={i}>{part}</span>;
        const tex = part.slice(display ? 2 : 1, display ? -2 : -1);
        // Before KaTeX lands, the TeX itself — it is the source, it is short,
        // and it says more than a blank space would.
        if (!render) return <span key={i}>{tex}</span>;
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: render(tex, display) }}
          />
        );
      })}
    </>
  );
}
