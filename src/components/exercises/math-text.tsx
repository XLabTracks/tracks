import { MathSpans } from "./math-spans";
import { cn } from "@/lib/utils";

/**
 * Renders a plain string containing `$inline$` and `$$display$$` LaTeX math.
 * Exercise `prompt`/`sampleAnswer` are plain TS strings — unlike lesson MDX
 * they never pass through remark-math/rehype-katex, so this is the equivalent
 * for exercise content.
 *
 * The common case is the one that matters: a string with no `$` in it returns
 * its own text and touches nothing. KaTeX lives behind MathSpans, which is
 * reached only by a string that has maths in it — see the note there for what
 * that costs and what it saves.
 */
const HAS_MATH = /\$\$?[^$]+\$\$?/;

export function MathText({ text }: { text: string }) {
  if (!HAS_MATH.test(text)) return <>{text}</>;
  return <MathSpans text={text} />;
}

/**
 * Renders `\n\n`-separated paragraphs, preserving single `\n`s as line breaks
 * within each one (e.g. a formula on its own line, a numbered task list), and
 * rendering `$inline$`/`$$display$$` math within each one.
 */
export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph, i) => (
        <p key={i} className={cn("whitespace-pre-wrap", className)}>
          <MathText text={paragraph} />
        </p>
      ))}
    </>
  );
}
