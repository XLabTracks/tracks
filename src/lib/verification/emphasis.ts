
export interface TextRun {
  text: string;
  strong: boolean;
}

export function splitEmphasis(source: string): TextRun[] {
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
