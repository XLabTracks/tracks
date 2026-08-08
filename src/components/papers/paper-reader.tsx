import "katex/dist/katex.min.css";
import "@/components/mdx/arxiv-paper.css";
import "./substack-post.css";
import "./lesswrong-post.css";
import "./paper-reader.css";
import { Fragment } from "react";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { buildAbsUrl, buildPdfUrl } from "@/lib/arxiv/id";
import type { ConversionWarning, PaperTocEntry } from "@/lib/arxiv/types";
import { buildPostUrl } from "@/lib/substack/id";
import {
  buildPostUrl as buildLwPostUrl,
  displayHost,
} from "@/lib/lesswrong/id";
import { resolvePaperSource } from "@/lib/papers/source-artifact";
import {
  editTargetRef,
  type Paper,
  type PaperInsertionItem,
} from "@/lib/content/types";
import { getGlossaryTerm, getRelatedTermNames } from "@/lib/content/glossary";
import { insertionAnchorId } from "@/lib/papers/split-paper";
import {
  applyPaperEdits,
  type AppliedPaper,
  type PaperPart,
} from "@/lib/papers/apply-edits";
import { collapseTailSections } from "@/lib/papers/collapse-tail";
import { resolveInternalReadingHref } from "@/lib/readings/resolve";
import { rewriteReadingLinks } from "@/lib/readings/rewrite-links";
import { renderGatePromptHtml } from "@/lib/papers/patch-section";
import { Demo } from "@/components/mdx/demo";
import { Exercise } from "@/components/mdx/exercise";
import { ExerciseSequence } from "@/components/mdx/exercise-sequence";
import { MathText } from "@/components/exercises/math-text";
import { EmbeddedLesson } from "./embedded-lesson";
import { PaperCollapse } from "./paper-collapse";
import { PaperGlossary, type PaperGlossaryEntry } from "./paper-glossary";
import { PaperGate } from "./paper-gate";
import { PaperSidenotes } from "./paper-sidenotes";
import {
  LessWrongUnavailable,
  PaperUnavailable,
  SubstackUnavailable,
} from "./paper-unavailable";

/**
 * Full-page paper renderer: the converted paper HTML with the paper's edits
 * applied — hidden text behind expandable markers, editorial additions, and
 * activity blocks (exercise cards, inline lessons) interleaved at section
 * ends, between blocks, or mid-paragraph. All dangerouslySetInnerHTML stays
 * in this server component — html parts never cross into client components,
 * so there is no hydration surface (hide toggles are native details/checkbox
 * markup). Activity blocks sit BETWEEN .arxiv-paper wrappers, never inside
 * them, so the paper's scoped CSS can't bleed into the cards; the
 * descendant-only styling makes sibling wrappers render identically to one.
 *
 * Both source kinds share everything downstream of the artifact — the edit
 * engine, insertion blocks, and footer — because both converters emit the
 * same annotated-HTML contract (data-anchor/data-s/toc). Only artifact
 * lookup, external links, and fallback copy differ per source.
 *
 * Post-sourced papers additionally get their post-to-post links rewritten to
 * internal destinations (course pages, or /readings for pre-built linked
 * readings). `internalSublinks={false}` turns that off — the standalone
 * /readings viewer uses it, which is what keeps the feature one layer deep.
 */
export async function PaperReader({
  paper,
  signedIn,
  completedContentIds,
  internalSublinks = true,
}: {
  paper: Paper;
  signedIn: boolean;
  completedContentIds: Set<string>;
  internalSublinks?: boolean;
}) {
  switch (paper.source.kind) {
    case "arxiv":
      return (
        <ArxivPaperReader
          paper={paper}
          arxivId={paper.source.arxivId}
          signedIn={signedIn}
          completedContentIds={completedContentIds}
        />
      );
    case "substack":
      return (
        <SubstackPaperReader
          paper={paper}
          postUrl={paper.source.postUrl}
          signedIn={signedIn}
          completedContentIds={completedContentIds}
          internalSublinks={internalSublinks}
        />
      );
    case "lesswrong":
      return (
        <LessWrongPaperReader
          paper={paper}
          postUrl={paper.source.postUrl}
          signedIn={signedIn}
          completedContentIds={completedContentIds}
          internalSublinks={internalSublinks}
        />
      );
  }
}

async function LessWrongPaperReader({
  paper,
  postUrl,
  signedIn,
  completedContentIds,
  internalSublinks,
}: {
  paper: Paper;
  postUrl: string;
  signedIn: boolean;
  completedContentIds: Set<string>;
  internalSublinks: boolean;
}) {
  const resolved = await resolvePaperSource({ kind: "lesswrong", postUrl });
  if (resolved.state === "invalid") {
    return (
      <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-xl border p-6 text-sm">
        Invalid LessWrong post URL <code>{postUrl}</code> — the public post
        URL is required, e.g.{" "}
        <code>https://www.lesswrong.com/posts/abc123/some-post</code>.
      </div>
    );
  }
  if (resolved.state !== "ready") {
    return (
      <ActivitiesOnlyFallback
        paper={paper}
        signedIn={signedIn}
        completedContentIds={completedContentIds}
      >
        <LessWrongUnavailable
          postRef={resolved.sourceRef}
          state={resolved.state}
        />
      </ActivitiesOnlyFallback>
    );
  }

  return (
    <EditedPaperBody
      paper={paper}
      html={
        internalSublinks
          ? rewriteReadingLinks(resolved.html, resolveInternalReadingHref)
          : resolved.html
      }
      toc={resolved.toc}
      // .arxiv-paper carries the shared reading typography + the edit-UI
      // (ax-hidden/ax-added) styles; .lesswrong-post scopes the lw-* extras.
      wrapperClassName="arxiv-paper lesswrong-post"
      converterVersion={resolved.convVersion}
      blocksCommand={`npm run lesswrong:build -- --blocks ${resolved.sourceRef.id}`}
      signedIn={signedIn}
      completedContentIds={completedContentIds}
      sidenotePrefix="lw"
      footer={
        <PaperFooter
          links={[
            {
              label: `Read on ${displayHost(resolved.sourceRef)}`,
              href:
                resolved.meta.canonicalUrl ?? buildLwPostUrl(resolved.sourceRef),
            },
          ]}
          warnings={resolved.warnings}
        />
      }
    />
  );
}

async function ArxivPaperReader({
  paper,
  arxivId,
  signedIn,
  completedContentIds,
}: {
  paper: Paper;
  arxivId: string;
  signedIn: boolean;
  completedContentIds: Set<string>;
}) {
  const resolved = await resolvePaperSource({ kind: "arxiv", arxivId });
  if (resolved.state === "invalid") {
    return (
      <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-xl border p-6 text-sm">
        Invalid arXiv id <code>{arxivId}</code> — a pinned version is required,
        e.g. <code>2301.12345v2</code>.
      </div>
    );
  }
  if (resolved.state !== "ready") {
    return (
      <ActivitiesOnlyFallback
        paper={paper}
        signedIn={signedIn}
        completedContentIds={completedContentIds}
      >
        <PaperUnavailable id={resolved.sourceRef} state={resolved.state} />
      </ActivitiesOnlyFallback>
    );
  }

  return (
    <EditedPaperBody
      paper={paper}
      html={resolved.html}
      toc={resolved.toc}
      wrapperClassName="arxiv-paper"
      converterVersion={resolved.convVersion}
      blocksCommand={`npm run arxiv:build -- --blocks ${resolved.sourceRef.id}`}
      signedIn={signedIn}
      completedContentIds={completedContentIds}
      sidenotePrefix="ax"
      footer={
        <PaperFooter
          links={[
            { label: "Abstract", href: buildAbsUrl(resolved.sourceRef) },
            { label: "PDF", href: buildPdfUrl(resolved.sourceRef) },
          ]}
          warnings={resolved.warnings}
        />
      }
    />
  );
}

async function SubstackPaperReader({
  paper,
  postUrl,
  signedIn,
  completedContentIds,
  internalSublinks,
}: {
  paper: Paper;
  postUrl: string;
  signedIn: boolean;
  completedContentIds: Set<string>;
  internalSublinks: boolean;
}) {
  const resolved = await resolvePaperSource({ kind: "substack", postUrl });
  if (resolved.state === "invalid") {
    return (
      <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-xl border p-6 text-sm">
        Invalid Substack post URL <code>{postUrl}</code> — the public post URL
        is required, e.g. <code>https://example.substack.com/p/some-post</code>.
      </div>
    );
  }
  if (resolved.state !== "ready") {
    return (
      <ActivitiesOnlyFallback
        paper={paper}
        signedIn={signedIn}
        completedContentIds={completedContentIds}
      >
        <SubstackUnavailable
          postRef={resolved.sourceRef}
          state={resolved.state}
        />
      </ActivitiesOnlyFallback>
    );
  }

  return (
    <EditedPaperBody
      paper={paper}
      html={
        internalSublinks
          ? rewriteReadingLinks(resolved.html, resolveInternalReadingHref)
          : resolved.html
      }
      toc={resolved.toc}
      // .arxiv-paper carries the shared reading typography + the edit-UI
      // (ax-hidden/ax-added) styles; .substack-post scopes the sb-* extras.
      wrapperClassName="arxiv-paper substack-post"
      converterVersion={resolved.convVersion}
      blocksCommand={`npm run substack:build -- --blocks ${resolved.sourceRef.id}`}
      signedIn={signedIn}
      completedContentIds={completedContentIds}
      sidenotePrefix="sb"
      footer={
        <PaperFooter
          links={[
            {
              label: `Read on ${resolved.sourceRef.host}`,
              href:
                resolved.meta.canonicalUrl ?? buildPostUrl(resolved.sourceRef),
            },
          ]}
          warnings={resolved.warnings}
        />
      }
    />
  );
}

/**
 * Non-ready artifact: the paper can't render, but its activities (and
 * completion) must stay reachable — stack them below the fallback card.
 */
function ActivitiesOnlyFallback({
  paper,
  signedIn,
  completedContentIds,
  children,
}: {
  paper: Paper;
  signedIn: boolean;
  completedContentIds: Set<string>;
  children: React.ReactNode;
}) {
  const allItems = (paper.edits ?? []).flatMap((edit) =>
    edit.op === "activity" ? edit.items : [],
  );
  return (
    <div className="paper-reader">
      {children}
      {allItems.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Activities</h2>
          {allItems.map((item) => (
            <InsertionBlock
              key={insertionAnchorId(item)}
              item={item}
              signedIn={signedIn}
              completedContentIds={completedContentIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Edit application is pure and its inputs are static per paper (committed
 * artifact html + code-defined edits), but the route is always dynamic (auth
 * cookies) — memoize per isolate keyed on paper id so the HAST
 * parse/patch/serialize work runs once, not on every request. Same idiom as
 * the bestResponse memo in src/lib/control-model/: NEVER mutate the returned
 * object. The stored-html check keeps the cache honest for post papers,
 * whose html is re-derived per request by rewriteReadingLinks (equal
 * content, fresh string).
 */
const appliedEditsCache = new Map<string, { html: string; applied: AppliedPaper }>();

function applyPaperEditsCached(
  paper: Paper,
  html: string,
  toc: PaperTocEntry[],
): AppliedPaper {
  const hit = appliedEditsCache.get(paper.id);
  if (hit && hit.html === html) return hit.applied;
  const edited = applyPaperEdits(html, toc, paper.edits);
  // Collapse trailing apparatus (references/appendix/footnotes) AFTER edits:
  // edit targets are resolved against the artifact's byte offsets, which the
  // details wrappers would shift. The references-seen flag threads through
  // the html parts in document order (and on into the ungated tail), so an
  // activity/gate split after References doesn't reset the appendix walk —
  // the whole document collapses as one pass.
  // `collapseTail: false` leaves the tail as ordinary sections — for papers
  // whose appendix is the document rather than its apparatus.
  const collapsing = paper.collapseTail !== false;
  let sawReferences = false;
  const parts = edited.parts.map((part) => {
    if (part.kind !== "html" || !collapsing) return part;
    const collapsed = collapseTailSections(part.html, sawReferences);
    sawReferences = collapsed.sawReferences;
    return { ...part, html: collapsed.html };
  });
  const applied: AppliedPaper = {
    ...edited,
    parts,
    ungatedTailHtml:
      edited.ungatedTailHtml &&
      (collapsing
        ? collapseTailSections(edited.ungatedTailHtml, sawReferences).html
        : edited.ungatedTailHtml),
  };
  appliedEditsCache.set(paper.id, { html, applied });
  return applied;
}

/** The ready path all sources share: apply edits, interleave activities. */
function EditedPaperBody({
  paper,
  html,
  toc,
  wrapperClassName,
  converterVersion,
  blocksCommand,
  signedIn,
  completedContentIds,
  footer,
  sidenotePrefix,
}: {
  paper: Paper;
  html: string;
  toc: PaperTocEntry[];
  wrapperClassName: string;
  converterVersion: number;
  blocksCommand: string;
  signedIn: boolean;
  completedContentIds: Set<string>;
  footer: React.ReactNode;
  /**
   * Footnote id namespace ("ax"/"sb"/"lw") to render as margin sidenotes
   * when there's room. User-toggleable via SidenotesToggle in the page
   * header; the in-document footnotes section stays canonical either way.
   */
  sidenotePrefix?: string;
}) {
  const { parts, ungatedTailHtml, unmatchedEdits } = applyPaperEditsCached(
    paper,
    html,
    toc,
  );
  if (unmatchedEdits.length > 0) {
    // Committed content can't reach this (content.test.ts validates every
    // edit target against the artifact); this is a local-iteration net.
    console.warn(
      `[papers] ${paper.id}: unmatched edit target(s): ` +
        unmatchedEdits
          .map((op) => {
            const ref = editTargetRef(op);
            return "anchor" in ref
              ? `${ref.anchor}${ref.s ? ` s=${ref.s}` : ""} ("${ref.snippet}")`
              : ref.sectionEnd;
          })
          .join(", "),
    );
  }
  const unmatchedItems = unmatchedEdits.flatMap((op) =>
    op.op === "activity" ? op.items : [],
  );

  return (
    <div className="paper-reader">
      {renderParts(parts, 0, {
        paperId: paper.id,
        wrapperClassName,
        converterVersion,
        signedIn,
        completedContentIds,
      })}

      {ungatedTailHtml && (
        // References/footnotes, split off the gated walk in apply-edits.ts:
        // they stay mounted while gates above are closed, so citations and
        // footnote markers in the visible text keep live targets and the
        // sidenote layer has note bodies to clone. The `paper-gated-tail`
        // class visually hides the footnotes SECTION itself (a gated paper
        // would otherwise dump every note — including gated ones — right below
        // the first gate, a spoiler); the notes stay in the DOM, so per-marker
        // margin sidenotes still render for content the learner has revealed.
        // References stay visible (citations must keep a live target).
        <div
          className={`${wrapperClassName} paper-gated-tail`}
          data-conv={converterVersion}
          dangerouslySetInnerHTML={{ __html: ungatedTailHtml }}
        />
      )}

      {unmatchedItems.length > 0 && (
        <div className="mt-10">
          {process.env.NODE_ENV !== "production" && (
            <p className="text-muted-foreground border-border bg-muted/30 rounded-lg border border-dashed p-3 text-xs">
              Dev note: the activities below target anchors/sections that
              don&apos;t exist in this paper (see the server console) — they
              were appended here instead. Run <code>{blocksCommand}</code> to
              list valid targets.
            </p>
          )}
          {unmatchedItems.map((item) => (
            <InsertionBlock
              key={insertionAnchorId(item)}
              item={item}
              signedIn={signedIn}
              completedContentIds={completedContentIds}
            />
          ))}
        </div>
      )}

      {footer}
      {sidenotePrefix && <PaperSidenotes prefix={sidenotePrefix} />}
      <PaperCollapse />
      <GlossaryLayer paper={paper} />
    </div>
  );
}

/**
 * Mounts the PaperGlossary interaction layer when the paper has gloss
 * edits, with each referenced term's card data resolved here — definitions
 * math-render server-side (MathText), so the client layer receives finished
 * nodes, never strings to interpret.
 */
function GlossaryLayer({ paper }: { paper: Paper }) {
  const termIds = new Set(
    (paper.edits ?? []).flatMap((edit) =>
      edit.op === "gloss" ? [edit.termId] : [],
    ),
  );
  const entries: PaperGlossaryEntry[] = [...termIds].flatMap((termId) => {
    const term = getGlossaryTerm(termId);
    // Unknown ids fail glossary.test.ts; at render time the span simply
    // gets no card.
    if (!term) return [];
    return [
      {
        termId,
        card: {
          term: term.term,
          definition: <MathText text={term.definition} />,
          related: getRelatedTermNames(term),
          source: term.source,
        },
      },
    ];
  });
  if (entries.length === 0) return null;
  return <PaperGlossary entries={entries} />;
}

interface RenderCtx {
  paperId: string;
  wrapperClassName: string;
  converterVersion: number;
  signedIn: boolean;
  completedContentIds: Set<string>;
}

/**
 * Renders the applied parts from `from` onward. A gate part wraps EVERYTHING
 * after it (recursively, so later gates nest inside earlier ones) in a
 * client <PaperGate> whose children are these same server-rendered nodes —
 * html stays in this server component, the client side only mounts/unmounts
 * the finished subtree. The footer, the sidenote layer, AND the trailing
 * references/footnotes sections (apply-edits.ts splits them into
 * ungatedTailHtml) render outside this walk — only body content is ever
 * withheld.
 */
function renderParts(
  parts: PaperPart[],
  from: number,
  ctx: RenderCtx,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  for (let i = from; i < parts.length; i++) {
    const part = parts[i];
    if (part.kind === "html") {
      nodes.push(
        <div
          key={i}
          className={ctx.wrapperClassName}
          data-conv={ctx.converterVersion}
          dangerouslySetInnerHTML={{ __html: part.html }}
        />,
      );
    } else if (part.kind === "activity") {
      nodes.push(
        <Fragment key={i}>
          {part.items.map((item) => (
            <InsertionBlock
              key={insertionAnchorId(item)}
              item={item}
              signedIn={ctx.signedIn}
              completedContentIds={ctx.completedContentIds}
            />
          ))}
        </Fragment>,
      );
    } else {
      nodes.push(
        <PaperGate
          key={i}
          paperId={ctx.paperId}
          gateId={part.id}
          cta={part.cta}
          written={part.written}
          minChars={part.minChars}
          prompt={
            part.prompt ? (
              <div
                className={`${ctx.wrapperClassName} ax-gate-prompt`}
                data-conv={ctx.converterVersion}
                dangerouslySetInnerHTML={{
                  __html: renderGatePromptHtml(part.prompt),
                }}
              />
            ) : undefined
          }
        >
          {renderParts(parts, i + 1, ctx)}
        </PaperGate>,
      );
      return nodes;
    }
  }
  return nodes;
}

function InsertionBlock({
  item,
  signedIn,
  completedContentIds,
}: {
  item: PaperInsertionItem;
  signedIn: boolean;
  completedContentIds: Set<string>;
}) {
  return (
    <section id={insertionAnchorId(item)}>
      {item.kind === "lesson" ? (
        <EmbeddedLesson
          lessonId={item.id}
          signedIn={signedIn}
          completed={completedContentIds.has(item.id)}
        />
      ) : item.kind === "demo" ? (
        <div className="my-8">
          <Demo id={item.id} framed={item.framed} />
        </div>
      ) : item.kind === "sequence" ? (
        <div className="my-8">
          <ExerciseSequence ids={item.exerciseIds} label={item.label} />
        </div>
      ) : (
        <div className="my-8">
          <Exercise id={item.id} />
        </div>
      )}
    </section>
  );
}

function PaperFooter({
  links,
  warnings,
}: {
  links: { label: string; href: string }[];
  warnings: ConversionWarning[];
}) {
  const approximated = warnings.reduce((n, w) => n + w.count, 0);
  return (
    <div className="border-border mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-xs">
      {links.map((link) => (
        <FooterLink key={link.href} href={link.href}>
          {link.label}
        </FooterLink>
      ))}
      {approximated > 0 && (
        <details className="text-muted-foreground min-w-0">
          <summary className="flex cursor-pointer items-center gap-1.5 [&::-webkit-details-marker]:hidden">
            <TriangleAlert className="size-3.5 text-amber-600" aria-hidden />
            Some elements are approximated — see the original for exact
            rendering.
          </summary>
          <ul className="mt-2 list-disc space-y-0.5 pl-5">
            {warnings.slice(0, 12).map((w) => (
              <li key={`${w.code}-${w.detail}`}>
                {w.code}: {w.detail}
                {w.count > 1 ? ` (×${w.count})` : ""}
              </li>
            ))}
            {warnings.length > 12 && <li>…and {warnings.length - 12} more</li>}
          </ul>
        </details>
      )}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-foreground hover:text-destructive inline-flex items-center gap-1 font-medium transition-colors"
    >
      {children}
      <ExternalLink className="size-3" aria-hidden />
    </a>
  );
}
