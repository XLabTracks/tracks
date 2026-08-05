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
import { VerificationExercise } from "@/components/verification/verification-exercise";
import { Term } from "./term";

// Components available by name inside every lesson `.mdx` body. Authors drop
// <Video/>, <Demo/>, <Exercise/>, <ExerciseSequence/>, <Callout/>,
// <ArxivPaper/>, <Footnote/>, <Term/>, <SiteQuote/>, <PopUp/>,
// <VerificationExercise/> directly into prose.
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
  NextSteps,
  PopUp,
  SiteQuote,
  VerificationExercise,
  Term,
};
