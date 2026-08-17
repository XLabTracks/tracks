/**
 * The outline's "[put these on a sliding scale]": a metric's Low and High
 * anchor examples at the two ends of one rail, so the pair reads as a range
 * rather than two more bullets. The words "Low"/"High" carry the meaning —
 * the rail and its end dots are decoration, which is why they stay in the
 * hairline/foreground greys and take no hue.
 */
export function SlidingScale({ low, high }: { low: string; high: string }) {
  return (
    <div className="not-prose my-4">
      <div className="relative h-2" aria-hidden>
        <div className="bg-border absolute inset-x-1 top-1/2 h-px -translate-y-1/2" />
        <span className="bg-muted-foreground/50 absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full" />
        <span className="bg-foreground absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full" />
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-6 text-xs leading-relaxed">
        <div>
          <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase select-none">
            Low
          </p>
          <p className="text-foreground/80">{low}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-[11px] tracking-[0.14em] uppercase select-none">
            High
          </p>
          <p className="text-foreground/80">{high}</p>
        </div>
      </div>
    </div>
  );
}
