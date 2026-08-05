"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AGENCY_CALLOUT,
  AGENCY_HEAD,
  AGENCY_TILES,
  CONVERT_CALLOUT,
  CONVERT_HEAD,
  CONVERT_TILES,
  FG_CRAFT_CARDS,
  FG_FORMAT_LABELS,
  FG_HEADER,
  FG_HOME_HINT_1,
  FG_HOME_HINT_2,
  FG_HOME_SESSION_HEADING,
  FG_HOME_SESSION_NOTE,
  FG_POPUPS,
  FG_PRINCIPLES,
  FG_SESSION_CARDS,
  PART_CALLOUT,
  PART_HEAD,
  PART_TILES,
  PHASE_LABEL,
  RESOURCES_BOXES,
  RESOURCES_HEAD,
  ROLE_CALLOUT_HIGH,
  ROLE_CALLOUT_LOW,
  ROLE_CALLOUT_SPINE,
  ROLE_HEAD,
  ROLE_TILES_HIGH,
  ROLE_TILES_LOW,
  SESSION_CALLOUT,
  SESSION_HEAD,
  SESSION_PLANS,
  SESSION_STAGES,
  TAKES_CALLOUT,
  TAKES_HEAD,
  TAKES_SORTER,
  TAKES_SORTER_HEAD,
  TAKES_TILES,
  type Callout,
  type ContextKey,
  type FormatKey,
  type ResBox,
  type Stage,
  type Tile,
  type Verdict,
} from "@/lib/verification/data/facilitator-guide";

/* The Facilitator Field Guide: a home grid over seven craft modules and five
 * session plans, each opening into a detail view, with 99 short cards behind
 * the tiles.
 *
 * All copy is authored and arrives as HTML from the data module, so bodies are
 * set with dangerouslySetInnerHTML. That is safe here and only here: the
 * strings are committed source, not user input, and nothing on this page comes
 * from the database.
 *
 * Two toggles, and they are deliberately different animals. Format
 * (in-person / Zoom) is shared by all five session plans — a cohort runs one
 * way, and re-picking it per plan would be a chore. Context (newer to AI safety
 * / high context) belongs to "Your role" alone and swaps that module's copy.
 *
 * Trap: a term inside authored prose can open a card too — those are
 * `<button data-pop="…">` in the HTML, so the click is caught by delegation on
 * the wrapper rather than by a handler this file can attach. */

/** The <h3> the source opens each card with is the dialog's title, and is
 *  taken out of the body so it is not printed twice.
 *
 *  The title stays HTML rather than being stripped to text: these headings
 *  carry entities (&amp;, curly quotes) that a tag-stripping regex leaves
 *  standing as literal `&amp;` on the screen. */
function splitPopup(html: string): { title: string; body: string } {
  const m = /^\s*<h3>([\s\S]*?)<\/h3>/.exec(html);
  if (!m) return { title: "", body: html };
  return { title: m[1], body: html.slice(m[0].length) };
}

export function FacilitatorGuide() {
  const [view, setView] = useState<string | null>(null);
  const [pop, setPop] = useState<string | null>(null);
  const [format, setFormat] = useState<FormatKey>("ip");
  const [context, setContext] = useState<ContextKey>("low");

  const openPop = useCallback((id: string) => setPop(id), []);

  /* Terms inside authored prose are buttons in the HTML string, so their
     clicks are caught here rather than bound at render. */
  const onProseClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = (e.target as HTMLElement).closest?.("button[data-pop]");
    const id = el?.getAttribute("data-pop");
    if (id) setPop(id);
  }, []);

  const popup = useMemo(() => (pop ? splitPopup(FG_POPUPS[pop] ?? "") : null), [pop]);

  /* The view lives in the hash, so a link can name one. That is what makes the
     classroom's "next session" shortcuts land on the plan rather than on the
     home grid, and it costs the Back button nothing it did not already do. */
  const VIEW_IDS = useMemo(
    () => new Set([...FG_CRAFT_CARDS, ...FG_SESSION_CARDS].map((c) => c.id)),
    [],
  );
  useEffect(() => {
    const read = () => {
      const id = location.hash.slice(1);
      setView(VIEW_IDS.has(id) ? id : null);
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, [VIEW_IDS]);

  const goHome = () => {
    setView(null);
    history.replaceState(history.state, "", location.pathname + location.search);
    window.scrollTo({ top: 0 });
  };
  const goView = (id: string) => {
    setView(id);
    history.replaceState(history.state, "", `#${id}`);
    window.scrollTo({ top: 0 });
  };

  /* ---------- shared pieces ---------- */

  const Prose = ({ html, className }: { html: string; className: string }) => (
    <div
      className={className}
      onClick={onProseClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  const CalloutBox = ({ c }: { c: Callout }) => (
    <Prose html={c.html} className="note fg-callout" />
  );

  const Tiles = ({ tiles }: { tiles: Tile[] }) => (
    <ul className="fg-tiles">
      {tiles.map((t) => (
        <li key={t.pop}>
          <button type="button" className="fg-tile" onClick={() => openPop(t.pop)}>
            <b>{t.title}</b>
            <span>{t.desc}</span>
            {t.timing && <span className="t">{t.timing}</span>}
          </button>
        </li>
      ))}
    </ul>
  );

  const Stages = ({ stages }: { stages: Stage[] }) => (
    <ul className="fg-stages">
      {stages.map((s) => (
        <li key={s.pop}>
          <button type="button" className="fg-stage" onClick={() => openPop(s.pop)}>
            <span className="row">
              <span className="num">{s.num}</span>
              <span className="phase">{PHASE_LABEL[s.phase]}</span>
              <b>{s.title}</b>
            </span>
            <span className="d">{s.desc}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  const Boxes = ({ boxes }: { boxes: ResBox[] }) => (
    <>
      {boxes.map((b) => (
        <section className="fg-res" key={b.heading}>
          <h3>{b.heading}</h3>
          <ul>
            {b.items.map((it, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: it.html }} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );

  const ViewHead = ({ title, lede }: { title: string; lede: string }) => (
    <header className="fg-view-head">
      <h2>{title}</h2>
      <p className="lede" dangerouslySetInnerHTML={{ __html: lede }} />
    </header>
  );

  const Toggle = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: { key: string; label: string }[];
    value: string;
    onChange: (k: string) => void;
  }) => (
    <div className="fg-toggle" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  /* ---------- home ---------- */

  const Cards = ({ cards }: { cards: typeof FG_CRAFT_CARDS }) => (
    <div className="fg-grid">
      {cards.map((c) => (
        <button key={c.id} type="button" className="fg-card" onClick={() => goView(c.id)}>
          <span className="num">{c.num}</span>
          <h3>{c.title}</h3>
          <p>{c.desc}</p>
          <span className="meta">{c.meta}</span>
        </button>
      ))}
    </div>
  );

  let body: ReactNode;

  if (view === null) {
    body = (
      <>
        <header className="fg-head">
          <h1>Facilitator field guide</h1>
          <p className="lede">{FG_HEADER.lede}</p>
          <ul className="fg-principles">
            {FG_PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </header>

        <section className="fg-sec">
          <h2>Craft</h2>
          <p className="note">{FG_HOME_HINT_1}</p>
          <Cards cards={FG_CRAFT_CARDS} />
        </section>

        <section className="fg-sec">
          <h2>{FG_HOME_SESSION_HEADING}</h2>
          <p className="note">{FG_HOME_SESSION_NOTE}</p>
          <Cards cards={FG_SESSION_CARDS} />
          <p className="note fg-next">{FG_HOME_HINT_2}</p>
        </section>
      </>
    );
  } else {
    const plan = SESSION_PLANS.find((p) => p.id === view);
    body = (
      <>
        <button type="button" className="fg-back" onClick={goHome}>
          &larr; All modules
        </button>

        {view === "m-role" && (
          <>
            <ViewHead title={ROLE_HEAD.title} lede={ROLE_HEAD.lede} />
            <Toggle
              label="Your AI-safety context"
              value={context}
              onChange={(k) => setContext(k as ContextKey)}
              options={[
                { key: "low", label: ROLE_HEAD.ctxLabelLow },
                { key: "high", label: ROLE_HEAD.ctxLabelHigh },
              ]}
            />
            <CalloutBox c={context === "low" ? ROLE_CALLOUT_LOW : ROLE_CALLOUT_HIGH} />
            <Tiles tiles={context === "low" ? ROLE_TILES_LOW : ROLE_TILES_HIGH} />
            <CalloutBox c={ROLE_CALLOUT_SPINE} />
          </>
        )}

        {view === "m-takes" && (
          <>
            <ViewHead title={TAKES_HEAD.title} lede={TAKES_HEAD.lede} />
            <Tiles tiles={TAKES_TILES} />
            <section className="fg-sec">
              <h2>{TAKES_SORTER_HEAD.heading}</h2>
              <p className="note">{TAKES_SORTER_HEAD.note}</p>
              <Sorter />
            </section>
            <CalloutBox c={TAKES_CALLOUT} />
          </>
        )}

        {view === "m-participation" && (
          <>
            <ViewHead title={PART_HEAD.title} lede={PART_HEAD.lede} />
            <Tiles tiles={PART_TILES} />
            <CalloutBox c={PART_CALLOUT} />
          </>
        )}

        {view === "m-agency" && (
          <>
            <ViewHead title={AGENCY_HEAD.title} lede={AGENCY_HEAD.lede} />
            <Tiles tiles={AGENCY_TILES} />
            <CalloutBox c={AGENCY_CALLOUT} />
          </>
        )}

        {view === "m-convert" && (
          <>
            <ViewHead title={CONVERT_HEAD.title} lede={CONVERT_HEAD.lede} />
            <Tiles tiles={CONVERT_TILES} />
            <CalloutBox c={CONVERT_CALLOUT} />
          </>
        )}

        {view === "m-session" && (
          <>
            <ViewHead title={SESSION_HEAD.title} lede={SESSION_HEAD.lede} />
            <Stages stages={SESSION_STAGES} />
            <CalloutBox c={SESSION_CALLOUT} />
          </>
        )}

        {view === "m-resources" && (
          <>
            <ViewHead title={RESOURCES_HEAD.title} lede={RESOURCES_HEAD.lede} />
            <Boxes boxes={RESOURCES_BOXES} />
          </>
        )}

        {plan && (
          <>
            <ViewHead title={plan.title} lede={plan.lede} />
            <Toggle
              label="Session format"
              value={format}
              onChange={(k) => setFormat(k as FormatKey)}
              options={[
                { key: "ip", label: FG_FORMAT_LABELS.ip },
                { key: "zm", label: FG_FORMAT_LABELS.zm },
              ]}
            />
            {plan.principles && (
              <div className="fg-chips">
                {plan.principles.map((p) => (
                  <span className="chip" key={p}>
                    {p}
                  </span>
                ))}
              </div>
            )}
            <Prose html={plan.prep[format]} className="note fg-callout" />

            {plan.coreTiles && (
              <section className="fg-sec">
                <h2>{plan.coreHeading}</h2>
                {plan.coreNote && <p className="note">{plan.coreNote}</p>}
                <Tiles tiles={plan.coreTiles} />
              </section>
            )}

            <section className="fg-sec">
              <h2>Run of show</h2>
              <Stages stages={plan.stages} />
            </section>

            <section className="fg-sec">
              <h2>{plan.promptsHeading}</h2>
              {plan.promptsNote && <p className="note">{plan.promptsNote}</p>}
              <Tiles tiles={plan.promptTiles} />
            </section>

            <section className="fg-sec">
              <h2>{plan.sendHeading}</h2>
              <Boxes boxes={[plan.sendBox]} />
            </section>

            <CalloutBox c={plan.seed} />

            {plan.nextId && (
              <p className="fg-next">
                <button
                  type="button"
                  className="fg-back"
                  onClick={() => goView(plan.nextId as string)}
                >
                  {plan.nextLabel ?? "Next session plan"} &rarr;
                </button>
              </p>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <>
      {body}
      <Dialog open={pop !== null} onOpenChange={(o) => !o && setPop(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle
              dangerouslySetInnerHTML={{ __html: popup?.title ?? "" }}
            />
            <DialogDescription className="sr-only">
              Facilitator note
            </DialogDescription>
          </DialogHeader>
          {popup && <Prose html={popup.body} className="fg-body" />}
        </DialogContent>
      </Dialog>
    </>
  );

  /* The one interactive piece: commit a verdict, then read why. Never
     auto-advances — the explanation carries the facilitator move, which is the
     part worth reading. */
  function Sorter() {
    return (
      <ul className="fg-tiles" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
        {TAKES_SORTER.map((item, i) => (
          <li key={i}>
            <SorterCard item={item} />
          </li>
        ))}
      </ul>
    );
  }
}

function SorterCard({
  item,
}: {
  item: (typeof TAKES_SORTER)[number];
}) {
  const [picked, setPicked] = useState<Verdict | null>(null);
  const right = picked === item.answer;
  return (
    <div className="fg-tile" style={{ cursor: "default" }}>
      <span>{item.quote}</span>
      {picked === null ? (
        <span className="fg-chips">
          <button type="button" className="chip" onClick={() => setPicked("strong")}>
            Strong take
          </button>
          <button type="button" className="chip" onClick={() => setPicked("weak")}>
            Weak take
          </button>
        </span>
      ) : (
        <>
          <span className="t">
            {right ? "✓ You called it" : "✕ Not this one"} — you said {picked}
          </span>
          <span dangerouslySetInnerHTML={{ __html: item.verdictHtml }} />
          <span className="fg-chips">
            <button type="button" className="chip" onClick={() => setPicked(null)}>
              Try again
            </button>
          </span>
        </>
      )}
    </div>
  );
}
