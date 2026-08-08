import { Children, isValidElement, type ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import { Video } from "./video";
import { ArxivPaper } from "./arxiv-paper";
import { Callout } from "./callout";
import { Fold } from "./fold";
import { Demo } from "./demo";
import { Exercise } from "./exercise";
import { ExerciseSequence } from "./exercise-sequence";
import { Cite } from "./cite";
import { FelonyBench } from "./felony-bench";
import { Footnote } from "./footnote";
import { MdxLink } from "./mdx-link";
import { NextSteps } from "./next-steps";
import { Objectives } from "./objectives";
import { PopUp } from "./pop-up";
import { SiteQuote } from "./site-quote";
import { SourceCredit } from "./source-credit";
import { CapstoneSignup } from "@/components/verification/capstone-signup";
import { MemoDesk } from "@/components/verification/memo-desk-card";
import { VerificationExercise } from "@/components/verification/verification-exercise";
import { Term } from "./term";
import { CapstoneBank } from "./reader/capstone-bank";
import { Check } from "./reader/check";
import { GapFill } from "./reader/gap-fill";
import { Prompt } from "./reader/prompt";
import { Src, SourceBox, SourceQuote } from "./reader/source-quote";
import { SignatoryQuotes, Signatory } from "./reader/signatory-quotes";
import { ReadingCard } from "./reader/reading-card";

// Components available by name inside every lesson `.mdx` body. Authors drop
// <Video/>, <Demo/>, <Exercise/>, <ExerciseSequence/>, <Callout/>,
// <ArxivPaper/>, <Cite/>, <Footnote/>, <Term/>, <SiteQuote/>, <PopUp/>,
// <SourceCredit/>, <MemoDesk/>, <VerificationExercise/>, <Check/>, <GapFill/>, <SourceQuote/>,
// <Src/>, <NextSteps/>, <CapstoneBank/> and <CapstoneSignup/> directly into prose.
// Markdown links render through MdxLink, which routes known Substack /
// LessWrong posts to the internal reader.
/* Safari removes list semantics from any list styled `list-style: none`, and
 * it does that deliberately. app-bridge.css takes the markers off every lesson
 * `ul` (the dot is drawn as ::before) and off numbered lists of four or more
 * (the ledger draws the numeral the same way) — and ::before content is not in
 * the accessibility tree. Left alone, VoiceOver reads the course's five
 * learning objectives as five loose paragraphs carrying no order at all.
 * `role="list"` restores the list, and its items announce their position.
 *
 * On a `ul` the role is exactly the element's own, so it is applied always and
 * costs nothing. On an `ol` it trades "ordered list" for "list", so it is
 * applied only where the stylesheet has actually taken the markers away — a
 * short numbered list keeps its native markers and its stronger semantics.
 *
 * Trap: that four-item threshold is written twice — here and in the
 * `:has(> li:nth-child(4))` selector app-bridge.css restyles on. Move one and
 * the other must move with it, or a list loses its markers to CSS while
 * keeping semantics only sighted readers can see. */
const LEDGER_THRESHOLD = 4;

function MdxUl(props: ComponentPropsWithoutRef<"ul">) {
  return <ul role="list" {...props} />;
}

function MdxOl({ children, ...rest }: ComponentPropsWithoutRef<"ol">) {
  const items = Children.toArray(children).filter(isValidElement).length;
  return (
    <ol role={items >= LEDGER_THRESHOLD ? "list" : undefined} {...rest}>
      {children}
    </ol>
  );
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  ul: MdxUl,
  ol: MdxOl,
  Video,
  ArxivPaper,
  Callout,
  Fold,
  Demo,
  Exercise,
  ExerciseSequence,
  Cite,
  FelonyBench,
  Footnote,
  MemoDesk,
  NextSteps,
  Objectives,
  PopUp,
  SiteQuote,
  SourceCredit,
  VerificationExercise,
  Term,
  // The reader blocks the Verification units were written against:
  // a committed-then-revealed check, a word-bank gap fill, a reproduced
  // passage with its attribution above it, a citation riding with its
  // passage, a worked example's prompt set apart from the prose answering
  // it, the capstone bank printed inside its unit, and the capstone
  // sign-up sheet the facilitators read.
  CapstoneBank,
  CapstoneSignup,
  Check,
  ReadingCard,
  GapFill,
  Prompt,
  SourceQuote,
  SourceBox,
  // Several speakers quoted from one source: the speaker heads each card and
  // the work is named once, at the foot of the block.
  SignatoryQuotes,
  Signatory,
  Src,
};
