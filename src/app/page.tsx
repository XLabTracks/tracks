import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getModulesForTrack, tracks } from "@/lib/content";
import { Button } from "@/components/ui/button";
import {
  LANDING_ACTIONS,
  LANDING_BAND_PAD,
  LANDING_BUTTON,
  LANDING_H1,
  LANDING_H2,
  LANDING_HERO,
  LANDING_LEDE,
  LANDING_WRAP,
} from "@/components/landing/landing";

const KIND_LABEL: Record<string, string> = {
  foundations: "Foundations",
  technical: "Technical",
  governance: "Governance",
};

// Verification's front door is its own landing, not the track overview.
const TRACK_HOME: Record<string, string> = {
  verification: "/verification/landing",
};

export default function Home() {
  return (
    <main className="flex-1">
      <section className={LANDING_HERO}>
        <div className={`landing-stagger ${LANDING_WRAP}`}>
          <h1 className={LANDING_H1}>Learn to make AI go well.</h1>
          <p className={LANDING_LEDE}>
            Tracks is a structured program for learning AI safety, offering a
            technical track on AI control and a governance track on verifying
            international AI agreements, with primary literature rendered in
            full, interactive demos, and writing practice.
          </p>
          <div className={LANDING_ACTIONS}>
            <Button asChild size="lg" className={LANDING_BUTTON}>
              <Link href="/tracks/control">Control track</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className={LANDING_BUTTON}
            >
              <Link href="/verification/landing">Verification track</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-border bg-card border-y">
        <div className={`${LANDING_WRAP} ${LANDING_BAND_PAD}`}>
          <h2 data-reveal className={LANDING_H2}>
            The tracks
          </h2>
          <ul role="list" className="mt-7 grid list-none gap-4 md:grid-cols-2">
            {tracks.map((track) => {
              const href = TRACK_HOME[track.id] ?? `/tracks/${track.slug}`;
              const moduleCount = getModulesForTrack(track.id).length;
              return (
                <li key={track.id} data-reveal>
                  <Link
                    href={href}
                    className="border-border bg-background landing-lift hover:shadow-soft-md group flex h-full flex-col rounded-xl border p-5"
                  >
                    <span className="text-muted-foreground text-xs">
                      {KIND_LABEL[track.kind] ?? track.kind} · {moduleCount}{" "}
                      modules
                    </span>
                    <span className="mt-1.5 text-lg font-semibold tracking-tight">
                      {track.title}
                    </span>
                    <span className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {track.description}
                    </span>
                    <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium">
                      Open the track
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
