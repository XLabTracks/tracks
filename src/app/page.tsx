import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="space-y-5">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          XLab<span className="text-destructive"> · </span>Tracks
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-balance">
          Learn to make AI go well.
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-lg leading-relaxed text-balance">
          A calm, structured path into AI safety — technical and governance
          tracks, interactive demos, and real writing practice. Read, build,
          discuss. Then again.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/tracks/control">Control track</Link>
        </Button>
        {/* Verification is the standalone site under public/verification/, not
            an app route, so this is a plain anchor: next/link would try to
            prefetch an RSC payload that does not exist there. */}
        <Button asChild size="lg" variant="outline">
          <a href="/verification/landing.html">Verification track</a>
        </Button>
      </div>
    </main>
  );
}
