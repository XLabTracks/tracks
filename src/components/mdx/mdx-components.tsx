import type { MDXComponents } from "mdx/types";
import { Video } from "./video";
import { ArxivPaper } from "./arxiv-paper";
import { Callout } from "./callout";
import { Demo } from "./demo";
import { Exercise } from "./exercise";
import { ExerciseSequence } from "./exercise-sequence";
import { Footnote } from "./footnote";
import { MdxLink } from "./mdx-link";
import { NextSteps } from "./next-steps";
import { PopUp } from "./pop-up";
import { SiteQuote } from "./site-quote";
import { SourceCredit } from "./source-credit";
import { MemoDesk } from "@/components/verification/memo-desk-card";
import { VerificationExercise } from "@/components/verification/verification-exercise";
import { Term } from "./term";
import { CapstoneBank } from "./reader/capstone-bank";
import { Check } from "./reader/check";
import { GapFill } from "./reader/gap-fill";
import { Src, SourceQuote } from "./reader/source-quote";

// Components available by name inside every lesson `.mdx` body. Authors drop
// <Video/>, <Demo/>, <Exercise/>, <ExerciseSequence/>, <Callout/>,
// <ArxivPaper/>, <Footnote/>, <Term/>, <SiteQuote/>, <PopUp/>,
// <SourceCredit/>, <MemoDesk/>, <VerificationExercise/>, <Check/>, <GapFill/>, <SourceQuote/>,
// <Src/>, <NextSteps/> and <CapstoneBank/> directly into prose.
// Markdown links render through MdxLink, which routes known Substack /
// LessWrong posts to the internal reader.
export const mdxComponents: MDXComponents = {
  a: MdxLink,
  Video,
  ArxivPaper,
  Callout,
  Demo,
  Exercise,
  ExerciseSequence,
  Footnote,
  MemoDesk,
  NextSteps,
  PopUp,
  SiteQuote,
  SourceCredit,
  VerificationExercise,
  Term,
  // The reader blocks the Verification units were written against:
  // a committed-then-revealed check, a word-bank gap fill, a reproduced
  // passage with its attribution above it, a citation riding with its
  // passage, and the capstone bank printed inside its unit.
  CapstoneBank,
  Check,
  GapFill,
  SourceQuote,
  Src,
};
