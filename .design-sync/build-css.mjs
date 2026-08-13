// Compile the design-system stylesheet for design-sync (cfg.buildCmd).
//
// The app has no prebuilt component CSS — the UI kit styles itself entirely
// through Tailwind v4 utilities, compiled at app build time. This script
// produces the equivalent standalone sheet for the DS bundle:
//   src/app/globals.css (tokens, three themes, @layer base)
//   → scoped to the UI kit + authored previews as content
//   → .design-sync/.cache/ds.css  (cfg.cssEntry)
//
// Transforms over the verbatim globals.css:
//   - `@import "tailwindcss"` gains source(none) + explicit @source dirs, so
//     the utility scan covers exactly src/components/ui and
//     .design-sync/previews (not the whole app).
//   - The KaTeX import is dropped (math CSS + its fonts are app-only).
//   - JetBrains Mono loads from Google Fonts (the app uses next/font/google;
//     there is no local file to ship).
//   - --font-sans/--font-mono are defined literally: the app injects them via
//     next/font at runtime, which the DS bundle doesn't have. InterVariable's
//     @font-face ships separately via cfg.extraFonts (fonts-inter.css).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const cacheDir = join(here, ".cache");
mkdirSync(cacheDir, { recursive: true });

let css = readFileSync(join(repo, "src/app/globals.css"), "utf8");

// Safelist a structural-utility vocabulary beyond what the kit + previews use:
// claude.ai/design has no Tailwind runtime (designs get only this precompiled
// sheet), so any class the design agent writes must already be compiled here.
const SAFELIST = [
  "{p,px,py,pt,pr,pb,pl,m,mx,my,mt,mr,mb,ml}-{0,1,2,3,4,5,6,8,10,12,16}",
  "mx-auto",
  "gap-{0,1,2,3,4,5,6,8}",
  "space-{x,y}-{1,2,3,4,6,8}",
  "w-{full,fit,auto,1/2,1/3,2/3,1/4,3/4}",
  "max-w-{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,full}",
  "h-{full,fit,auto,screen}",
  "min-h-{screen,full}",
  "min-w-0",
  "text-{xs,sm,base,lg,xl,2xl,3xl,4xl}",
  "font-{normal,medium,semibold,bold}",
  "text-{left,center,right}",
  "leading-{tight,snug,normal,relaxed}",
  "tracking-{tight,normal,wide,widest}",
  "uppercase",
  "flex",
  "inline-flex",
  "flex-{row,col,wrap,1,none}",
  "shrink-0",
  "grow",
  "items-{start,center,end,stretch,baseline}",
  "justify-{start,center,end,between,around}",
  "self-{start,center,end,stretch}",
  "grid",
  "grid-cols-{1,2,3,4,5,6,12}",
  "col-span-{1,2,3,4,6,12}",
  "rounded-{xs,sm,md,lg,xl,2xl,3xl,full,none}",
  "border",
  "border-{0,2,t,b,l,r}",
  "shadow-{soft,soft-md,soft-lg,none}",
  "bg-{background,card,popover,primary,secondary,muted,accent,destructive,sidebar,transparent}",
  "bg-{primary,secondary,muted,accent,destructive}/10",
  "text-{foreground,muted-foreground,card-foreground,popover-foreground,primary,primary-foreground,secondary-foreground,accent-foreground,destructive,link}",
  "border-{border,input,primary,destructive,transparent}",
  "divide-y",
  "overflow-{hidden,auto,y-auto,x-auto}",
  "relative",
  "absolute",
  "fixed",
  "sticky",
  "inset-0",
  "top-0",
  "bottom-0",
  "left-0",
  "right-0",
  "z-{10,20,50}",
  "block",
  "inline-block",
  "hidden",
  "truncate",
  "whitespace-nowrap",
  "italic",
  "underline",
  "line-through",
  "opacity-{50,60,70,80}",
  "transition",
  "cursor-pointer",
  "select-none",
  "sr-only",
  "font-{sans,mono}",
];
const safelistDirectives = SAFELIST.map((s) => `@source inline("${s}");`).join("\n");

css = css.replace(
  '@import "tailwindcss";',
  '@import "tailwindcss" source(none);\n@source "../../src/components/ui";\n@source "../previews";\n' +
    safelistDirectives,
);
css = css.replace(/@import\s+"katex\/dist\/katex\.min\.css";\n?/, "");

const remoteFonts =
  '@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap");\n';
// Re-emit the @theme-inline radius scale (inlined into utilities, so the vars
// never reach :root on their own) plus shadow aliases, so design-agent inline
// styles can use var(--radius-*) / var(--shadow-soft*). Extracted from the
// globals.css text itself — a scale change upstream lands here on rebuild.
const radiusVars = [...css.matchAll(/--radius-[a-z0-9]+:\s*[^;]+;/g)]
  .map((m) => `  ${m[0]}`)
  .join("\n");

const fontVars = `
/* design-sync: the app sets these via next/font on <html>; the DS bundle
   defines them directly. InterVariable @font-face ships via fonts-inter.css. */
:root {
  --font-sans: "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
${radiusVars}
  --shadow-soft: var(--soft-shadow);
  --shadow-soft-md: var(--soft-shadow-md);
  --shadow-soft-lg: var(--soft-shadow-lg);
}
`;

const entryPath = join(cacheDir, "ds-entry.generated.css");
writeFileSync(entryPath, remoteFonts + css + fontVars);

const { default: postcss } = await import("postcss");
const { default: tailwindcss } = await import("@tailwindcss/postcss");

const outPath = join(cacheDir, "ds.css");
const result = await postcss([tailwindcss({ base: repo })]).process(
  readFileSync(entryPath, "utf8"),
  { from: entryPath, to: outPath },
);
writeFileSync(outPath, result.css);
console.log(`ds.css: ${(result.css.length / 1024).toFixed(0)}kB → ${outPath}`);
