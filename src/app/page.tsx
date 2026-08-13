import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="space-y-5">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          XLab<span className="text-destructive dark:text-primary"> · </span>Tracks
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-balance">
          Learn to make AI go well.
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-lg leading-relaxed text-balance">
          Tracks is a structured program for learning AI safety, offering a
          technical track on AI control and a governance track on verifying
          international AI agreements, with primary literature rendered in
          full, interactive demos, and writing practice.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/tracks/control">Control track</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/tracks/verification">Verification track</Link>
        </Button>
      </div>
    </main>
  );
}
