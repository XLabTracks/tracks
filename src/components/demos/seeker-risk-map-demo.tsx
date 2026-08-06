"use client";

// Risk → seeker ranking panels. Four cards, one per risk from "Risks and
// mitigations" > "What?". Hover-intent on desktop / tap-toggle on touch
// expands a card to show its attributed seekers (as ranked chips) plus the
// lesson's note, all copy verbatim from c-mod6-l1.mdx.
//
// AUTHOR INPUT #3: the lesson explicitly attributes only three of the four
// risks to a seeker orientation (Potemkin work, Manipulation, Outcome
// enforcement); Instability names "myopic motivations" with no specific
// orientation. Cards with an empty `attributed` list show a muted "ranking
// in development" chip instead of inventing a ranking. Full rankings await
// the author.

import { useEffect, useRef, useState } from "react";

const RISKS = [
  {
    id: "potemkin",
    label: "Potemkin work",
    attributed: ["Apparent-success"],
    note: "see apparent-success seekers as a potential path to this",
  },
  {
    id: "instability",
    label: "Instability",
    attributed: [],
    note: "myopic motivations succumb to more ambitious misaligned motivations",
  },
  {
    id: "manipulation",
    label: "Manipulation",
    attributed: ["Remotely-influenceable"],
    note: "remotely-influenceable reward seekers are vulnerable to distant incentives",
  },
  {
    id: "enforcement",
    label: "Outcome enforcement",
    attributed: ["Powerful fitness-seekers"],
    note: "may see the disempowerment of humans as the best way to maintain their desired outcomes",
  },
] as const;

const HOVER_INTENT_MS = 120;

export function SeekerRiskMapDemo() {
  const [openId, setOpenId] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openId) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpenId(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openId]);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  function scheduleOpen(id: string) {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenId(id), HOVER_INTENT_MS);
  }
  function cancelOpen() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {RISKS.map((risk) => {
        const isOpen = openId === risk.id;
        return (
          <div
            key={risk.id}
            onMouseEnter={() => scheduleOpen(risk.id)}
            onMouseLeave={() => {
              cancelOpen();
              setOpenId((current) => (current === risk.id ? null : current));
            }}
            className="border-border bg-card rounded-lg border p-3"
          >
            <button
              type="button"
              onClick={() => setOpenId((current) => (current === risk.id ? null : risk.id))}
              aria-expanded={isOpen}
              className="text-foreground focus-visible:ring-ring w-full rounded text-left text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
            >
              {risk.label}
            </button>
            {isOpen && (
              <div className="mt-2 space-y-2">
                {risk.attributed.length > 0 ? (
                  <ul className="flex flex-wrap gap-1.5">
                    {risk.attributed.map((seeker) => (
                      <li
                        key={seeker}
                        className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                      >
                        {seeker}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="bg-muted text-muted-foreground inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                    ranking in development
                  </span>
                )}
                <p className="text-muted-foreground text-xs">{risk.note}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
