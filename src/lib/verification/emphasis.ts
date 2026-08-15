/**
 * `**bold**` inside an authored string, and nothing else.
 *
 * The course owner writes her exercise specs in markdown and marks the
 * load-bearing phrase in a question — the statute, the guide, the standard the
 * answer turns on — in bold. Transcribed into a data file as a plain string
 * that emphasis was silently dropped, and a stem that names three possible
 * sources reads flat when one of them is the one being asked about.
 *
 * Deliberately not a markdown parser. Widget data is not a document: it is
 * short authored strings rendered into a specific layout, and a parser would
 * bring headings, lists, links and raw HTML into places that have no room for
 * them. One mark, one meaning, no escape hatch — and no `dangerouslySet`
 * anywhere, because this returns text runs and the component wraps them.
 *
 * An unclosed `**` is left alone rather than swallowing the rest of the line:
 * a typo in a data file should look like a typo, not delete the sentence.
 */

export interface TextRun {
  text: string;
  strong: boolean;
}

export function splitEmphasis(source: string): TextRun[] {
  // Built per call: a shared /g regex carries lastIndex between callers, which
  // is the classic way a function like this starts skipping every other match.
  // [^] rather than the s flag: the tsconfig target predates dotAll, and a
  // marked phrase may still wrap across a line in an authored string.
  const marked = /\*\*([^]+?)\*\*/g;
  const runs: TextRun[] = [];
  let at = 0;
  for (const m of source.matchAll(marked)) {
    if (m.index > at) runs.push({ text: source.slice(at, m.index), strong: false });
    runs.push({ text: m[1]!, strong: true });
    at = m.index + m[0].length;
  }
  if (at < source.length) runs.push({ text: source.slice(at), strong: false });
  return runs;
}
