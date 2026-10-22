import { getExerciseById } from "./index";
import { EXERCISE_TYPE_LABELS, getExerciseDisplayTitle } from "./types";

// A prompt-bearing exercise has no title of its own, and a run of sidebar
// rows all reading "Writing prompt" navigates nothing — so those rows are
// labelled with the prompt's own opening line instead (markdown stripped,
// truncated on a word). An opener too short to identify anything (a bare
// table header like "Posture") falls back to the type label rather than
// masquerading as a title.
export function exerciseLabel(exerciseId: string): string {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return "Exercise";
  const title = getExerciseDisplayTitle(exercise);
  if (title !== EXERCISE_TYPE_LABELS[exercise.type]) return title;
  const opener = "prompt" in exercise ? promptOpener(exercise.prompt) : null;
  return opener ?? title;
}

function promptOpener(prompt: string): string | null {
  const line = prompt
    .split("\n")
    .map((raw) =>
      raw
        .replace(/^#{1,6}\s+/, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .find((text) => text.length > 0);
  if (!line || line.length < 12) return null;
  if (line.length <= 72) return line;
  return line.slice(0, 71).replace(/\s+\S*$/, "") + "…";
}
