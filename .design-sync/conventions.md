# Tracks UI Kit — build conventions

React components from `window.Tracks` (27 components, 103 exports — subcomponents are flat named exports: `DialogContent`, `CardHeader`, `SelectItem`, …). No provider or theme wrapper is required: tokens live on `:root` in the stylesheet. One exception: render `<Toaster />` once per app to use toasts, and **import `toast` from the kit, never from the `sonner` package** — `Tracks.toast(...)` talks to the bundled Toaster's store; a separate sonner copy renders nothing.

## Styling: precompiled utilities + token variables

The stylesheet is **precompiled** — there is no Tailwind runtime. A class not listed below (or not used by the kit itself) does not exist and silently does nothing. The compiled vocabulary:

| Family | Compiled values |
|---|---|
| Spacing | `p/px/py/pt/pr/pb/pl/m/mx/my/mt/mr/mb/ml`-`0…6,8,10,12,16`, `mx-auto`, `gap-0…6,8`, `space-x/y-1…4,6,8` |
| Size | `w-full/fit/auto/1/2/1/3/2/3/1/4/3/4`, `max-w-xs…5xl,full`, `h-full/fit/auto/screen`, `min-h-screen/full`, `min-w-0` |
| Type | `text-xs…4xl`, `font-normal/medium/semibold/bold`, `text-left/center/right`, `leading-tight/snug/normal/relaxed`, `tracking-tight/normal/wide/widest`, `uppercase`, `italic`, `underline`, `truncate`, `font-sans/mono` |
| Flex/Grid | `flex`, `inline-flex`, `flex-row/col/wrap/1/none`, `shrink-0`, `grow`, `items-*`, `justify-*`, `self-*`, `grid`, `grid-cols-1…6,12`, `col-span-1…4,6,12` |
| Surface | `bg-background/card/popover/primary/secondary/muted/accent/destructive/sidebar/transparent`, `bg-primary/10` (and secondary/muted/accent/destructive at `/10`), `text-foreground/muted-foreground/primary/primary-foreground/…/destructive/link`, `border`, `border-border/input/primary/destructive/transparent`, `border-0/2/t/b/l/r`, `divide-y`, `rounded-xs…3xl,full,none`, `shadow-soft`, `shadow-soft-md`, `shadow-soft-lg` |
| Layout | `relative/absolute/fixed/sticky`, `inset-0`, `top/bottom/left/right-0`, `z-10/20/50`, `block/inline-block/hidden`, `overflow-hidden/auto`, `opacity-50/60/70/80`, `transition`, `cursor-pointer`, `select-none`, `sr-only` |

Anything beyond this: inline `style` with the token variables — `var(--background|--foreground|--card|--popover|--primary|--secondary|--muted|--muted-foreground|--accent|--destructive|--border|--input|--ring|--link)`, radius scale `var(--radius-xs|sm|md|lg|xl|2xl|3xl)` (8px controls, 14px cards), shadows `var(--shadow-soft|--shadow-soft-md|--shadow-soft-lg)`, charts `var(--chart-1…5)`, sidebar `var(--sidebar…)`.

## The look

- Light ("paper & ink", default): off-white paper, very-dark-navy ink primary, neutral-grey surfaces. **Red (`--destructive`/`--ring`/`--link`) is a deliberate tertiary accent** — focus rings and links are red by design; don't "correct" them, and keep red off large surfaces.
- Dark: add class `dark` on a root element — warm stone ground with ember primary. High contrast: `dark contrast` together. All tokens flip via the same variables; never hardcode hex.
- Fonts self-load from the stylesheet: Inter (`--font-sans`, headings 600 with -0.015em tracking) and JetBrains Mono (`--font-mono`).
- `--comply/--defect/--hide/--exaggerate/--free-ride` (Okabe-Ito) encode meaning in data displays only — always paired with a label or icon, never color alone.

## Where the truth lives

`styles.css` → `_ds_bundle.css` (every compiled class + all three theme token blocks) and `fonts/fonts.css`. Per component: `components/<group>/<Name>/<Name>.d.ts` (exact props) and `<Name>.prompt.md` (usage + examples).

## Idiomatic snippet

```jsx
const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } = window.Tracks;

<Card className="shadow-soft w-full max-w-md">
  <CardHeader>
    <Badge variant="secondary">Technical</Badge>
    <CardTitle className="mt-2 text-xl">Control</CardTitle>
    <CardDescription>Monitoring, auditing, and the control game.</CardDescription>
  </CardHeader>
  <CardContent className="text-muted-foreground text-sm">4 modules · ~12h</CardContent>
  <CardFooter><Button className="w-full">Open track</Button></CardFooter>
</Card>
```
