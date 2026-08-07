import type { MDXComponents } from "mdx/types";
import { Video } from "./video";
import { ArxivPaper } from "./arxiv-paper";
import { Callout } from "./callout";
import { Fold } from "./fold";
import { Demo } from "./demo";
import { Exercise } from "./exercise";
import { ExerciseSequence } from "./exercise-sequence";
import { Cite } from "./cite";
import { Footnote } from "./footnote";
import { MdxLink } from "./mdx-link";
import { NextSteps } from "./next-steps";
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
import { Src, SourceQuote } from "./reader/source-quote";
import { ReadingCard } from "./reader/reading-card";

// Components available by name inside every lesson `.mdx` body. Authors drop
// <Video/>, <Demo/>, <Exercise/>, <ExerciseSequence/>, <Callout/>,
// <ArxivPaper/>, <Cite/>, <Footnote/>, <Term/>, <SiteQuote/>, <PopUp/>,
// <SourceCredit/>, <MemoDesk/>, <VerificationExercise/>, <Check/>, <GapFill/>, <SourceQuote/>,
// <Src/>, <NextSteps/>, <CapstoneBank/> and <CapstoneSignup/> directly into prose.
// Markdown links render through MdxLink, which routes known Substack /
// LessWrong posts to the internal reader.
export const mdxComponents: MDXComponents = {
  a: MdxLink,
  Video,
  ArxivPaper,
  Callout,
  Fold,
  Demo,
  Exercise,
  ExerciseSequence,
  Cite,
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
  Src,
};
