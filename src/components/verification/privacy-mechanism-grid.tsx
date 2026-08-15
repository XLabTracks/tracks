"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * The outline's "2x2 pop-up grid" for 2.0.1's five privacy-preserving
 * mechanisms: each card is a named pop-up (the PopUp contract — the label
 * carries the meaning, opening it is for the body) with a small diagram of
 * what actually crosses the facility boundary. The diagrams share one visual
 * grammar so they read against each other: the muted zone is the facility,
 * the lock is what stays inside, the circle is the verifier, and the single
 * primary-accented element is the evidence that crosses — which is the whole
 * lesson. Labels restate the lesson prose; they never add claims of their own.
 *
 * Trap (same as PopUp): the dialog portals out of `.lesson-body`, so no
 * `prose` rule reaches it — the body's type and rhythm are stated here.
 */

type DiagramKey = "attestation" | "telemetry" | "zkp" | "mpc" | "managed-access";

/* ---- shared glyphs ---------------------------------------------------- */

function LockGlyph({ x, y }: { x: number; y: number }) {
  // 12x12 padlock, anchored at its top-left
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden>
      <path
        d="M2.5 5.5 V4 a3.5 3.5 0 0 1 7 0 v1.5"
        fill="none"
        strokeWidth="1.2"
        className="stroke-muted-foreground"
      />
      <rect
        x="0.5"
        y="5.5"
        width="11"
        height="7"
        rx="1.5"
        strokeWidth="1.2"
        className="fill-card stroke-muted-foreground"
      />
    </g>
  );
}

function VerifierGlyph({ cx, cy }: { cx: number; cy: number }) {
  // head + shoulders in a ring: the party doing the checking
  return (
    <g aria-hidden>
      <circle
        cx={cx}
        cy={cy}
        r="13"
        strokeWidth="1.2"
        className="fill-card stroke-foreground/70"
      />
      <circle cx={cx} cy={cy - 4} r="3.5" strokeWidth="1.2" fill="none" className="stroke-foreground/70" />
      <path
        d={`M ${cx - 6} ${cy + 8} a 6 6 0 0 1 12 0`}
        fill="none"
        strokeWidth="1.2"
        className="stroke-foreground/70"
      />
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, accent = false, dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; accent?: boolean; dashed?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hx = (a: number) => x2 - 7 * Math.cos(angle - a);
  const hy = (a: number) => y2 - 7 * Math.sin(angle - a);
  const cls = accent ? "stroke-primary" : "stroke-muted-foreground";
  return (
    <g aria-hidden>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        strokeWidth="1.3"
        strokeDasharray={dashed ? "3 3" : undefined}
        className={cls}
      />
      <path
        d={`M ${x2} ${y2} L ${hx(0.45)} ${hy(0.45)} L ${hx(-0.45)} ${hy(-0.45)} Z`}
        className={accent ? "fill-primary" : "fill-muted-foreground"}
      />
    </g>
  );
}

function Label({ x, y, children, accent = false, anchor = "middle" }: {
  x: number; y: number; children: string; accent?: boolean; anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize="8.5"
      className={accent ? "fill-primary" : "fill-muted-foreground"}
    >
      {children}
    </text>
  );
}

function FacilityZone({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <rect
      x={x} y={y} width={w} height={h} rx="8"
      strokeWidth="1"
      className="fill-muted/40 stroke-border"
    />
  );
}

/* ---- the five diagrams ------------------------------------------------ */

function AttestationDiagram() {
  return (
    <svg viewBox="0 0 260 120" className="h-auto w-full" role="img" aria-label="A chip inside a facility sends a signed attestation report to the verifier; the verifier gets no direct access to the workload or weights.">
      <FacilityZone x={4} y={14} w={122} h={92} />
      <Label x={65} y={26}>facility</Label>
      {/* chip with pins */}
      <rect x="34" y="42" width="34" height="34" rx="3" strokeWidth="1.2" className="fill-card stroke-foreground/70" />
      <rect x="42" y="50" width="18" height="18" rx="1.5" strokeWidth="1" fill="none" className="stroke-foreground/50" />
      {[46, 51, 56].map((p) => (
        <g key={p}>
          <line x1={p} y1="38" x2={p} y2="42" strokeWidth="1" className="stroke-foreground/50" />
          <line x1={p} y1="76" x2={p} y2="80" strokeWidth="1" className="stroke-foreground/50" />
        </g>
      ))}
      <Label x={51} y={92}>chip</Label>
      <LockGlyph x={90} y={52} />
      <Label x={96} y={92}>weights</Label>
      {/* the report that crosses */}
      <Arrow x1={70} y1={52} x2={140} y2={46} accent />
      <rect x="142" y="34" width="30" height="24" rx="3" strokeWidth="1.2" className="fill-card stroke-primary" />
      <path d="M 150 46 l 4 4 l 8 -8" fill="none" strokeWidth="1.6" className="stroke-primary" />
      <Arrow x1={174} y1={46} x2={206} y2={52} accent />
      <Label x={157} y={70} accent>signed report</Label>
      <Label x={157} y={80} accent>model · firmware · state</Label>
      <VerifierGlyph cx={224} cy={58} />
      <Label x={224} y={86}>verifier</Label>
      {/* the access that never happens */}
      <Arrow x1={206} y1={98} x2={112} y2={98} dashed />
      <line x1="155" y1="92" x2="165" y2="104" strokeWidth="1.3" className="stroke-muted-foreground" />
      <Label x={160} y={114}>no direct access</Label>
    </svg>
  );
}

function TelemetryDiagram() {
  return (
    <svg viewBox="0 0 260 120" className="h-auto w-full" role="img" aria-label="Physical signals such as power and temperature leave the facility for classification; the workload's contents stay sealed inside.">
      <FacilityZone x={4} y={14} w={116} h={92} />
      <Label x={62} y={26}>facility</Label>
      <rect x="24" y="40" width="52" height="40" rx="3" strokeWidth="1.2" className="fill-card stroke-foreground/70" />
      <Label x={50} y={56}>workload</Label>
      <LockGlyph x={44} y={60} />
      <Label x={50} y={94}>contents sealed</Label>
      {/* the waveform that crosses */}
      <path
        d="M 76 60 q 8 -16 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0"
        fill="none"
        strokeWidth="1.5"
        className="stroke-primary"
      />
      <Arrow x1={166} y1={60} x2={204} y2={60} accent />
      <Label x={150} y={82} accent>power · memory ·</Label>
      <Label x={150} y={92} accent>temperature signals</Label>
      <VerifierGlyph cx={222} cy={60} />
      <Label x={222} y={88}>training run?</Label>
    </svg>
  );
}

function ZkpDiagram() {
  return (
    <svg viewBox="0 0 260 120" className="h-auto w-full" role="img" aria-label="A proof that the run satisfied the rule crosses to the verifier; the protected inputs themselves reveal nothing else.">
      <FacilityZone x={4} y={14} w={110} h={92} />
      <Label x={59} y={26}>prover</Label>
      <rect x="22" y="40" width="52" height="40" rx="3" strokeWidth="1.2" className="fill-card stroke-foreground/70" />
      <Label x={48} y={55}>protected</Label>
      <Label x={48} y={65}>inputs</Label>
      <LockGlyph x={42} y={66} />
      {/* the proof badge that crosses */}
      <Arrow x1={74} y1={60} x2={136} y2={60} accent />
      <circle cx="152" cy="60" r="14" strokeWidth="1.3" className="fill-card stroke-primary" />
      <path d="M 145 60 l 5 5 l 9 -10" fill="none" strokeWidth="1.8" className="stroke-primary" />
      <Arrow x1={166} y1={60} x2={202} y2={60} accent />
      <Label x={152} y={88} accent>proof: the run</Label>
      <Label x={152} y={98} accent>satisfied the rule</Label>
      <Label x={152} y={112}>nothing else revealed</Label>
      <VerifierGlyph cx={220} cy={60} />
      <Label x={220} y={88}>verifier</Label>
    </svg>
  );
}

function MpcDiagram() {
  return (
    <svg viewBox="0 0 260 120" className="h-auto w-full" role="img" aria-label="Developer and verifier each hold private inputs; a joint computation returns only the agreed result to both.">
      {/* two private zones */}
      <FacilityZone x={4} y={14} w={92} h={54} />
      <Label x={50} y={26}>developer</Label>
      <LockGlyph x={26} y={38} />
      <Label x={62} y={48}>weights</Label>
      <FacilityZone x={164} y={14} w={92} h={54} />
      <Label x={210} y={26}>verifier</Label>
      <LockGlyph x={186} y={38} />
      <Label x={224} y={48}>eval cases</Label>
      {/* inputs never cross to each other */}
      <line x1="100" y1="30" x2="160" y2="30" strokeWidth="1.2" strokeDasharray="3 3" className="stroke-muted-foreground" />
      <line x1="125" y1="24" x2="135" y2="36" strokeWidth="1.2" className="stroke-muted-foreground" />
      <Label x={130} y={16}>inputs never shared</Label>
      {/* both feed the joint computation */}
      <Arrow x1={72} y1={64} x2={114} y2={84} accent />
      <Arrow x1={188} y1={64} x2={146} y2={84} accent />
      <rect x="102" y="80" width="56" height="22" rx="11" strokeWidth="1.3" className="fill-card stroke-primary" />
      <Label x={130} y={94} accent>joint result</Label>
      <Label x={130} y={116}>each side learns only the output</Label>
    </svg>
  );
}

function ManagedAccessDiagram() {
  return (
    <svg viewBox="0 0 260 120" className="h-auto w-full" role="img" aria-label="A cleared inspector enters the facility under agreed rules; sensitive equipment stays shrouded.">
      <FacilityZone x={64} y={14} w={192} h={92} />
      <Label x={160} y={26}>facility</Label>
      {/* the inspector who crosses, under rules */}
      <VerifierGlyph cx={22} cy={58} />
      <Label x={22} y={86}>inspector</Label>
      <Arrow x1={38} y1={58} x2={82} y2={58} accent />
      <Label x={60} y={46} accent>agreed rules</Label>
      {/* what may be examined */}
      <rect x="96" y="42" width="60" height="42" rx="3" strokeWidth="1.2" className="fill-card stroke-primary" />
      <Label x={126} y={58} accent>records under</Label>
      <Label x={126} y={68} accent>inspection</Label>
      {/* what stays shrouded */}
      <rect x="176" y="42" width="60" height="42" rx="3" strokeWidth="1.2" strokeDasharray="4 3" className="fill-muted/60 stroke-muted-foreground" />
      <LockGlyph x={200} y={48} />
      <Label x={206} y={76}>shrouded</Label>
      <Label x={160} y={100}>no recording · no copying beyond the rules</Label>
    </svg>
  );
}

const DIAGRAMS: Record<DiagramKey, () => ReactNode> = {
  attestation: AttestationDiagram,
  telemetry: TelemetryDiagram,
  zkp: ZkpDiagram,
  mpc: MpcDiagram,
  "managed-access": ManagedAccessDiagram,
};

/* ---- the grid and its cards ------------------------------------------- */

export function MechanismGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "not-prose my-6 grid gap-3 sm:grid-cols-2",
        // an odd count leaves the last card alone in its row; let it take the
        // full width rather than sit against an empty cell
        "sm:[&>*:last-child:nth-child(odd)]:col-span-2",
      )}
    >
      {children}
    </div>
  );
}

export function MechanismCard({
  label,
  diagram,
  children,
}: {
  label: string;
  diagram: DiagramKey;
  children: ReactNode;
}) {
  // Rendered by plain call, not as a JSX component: the map's values are
  // module-scope functions, and a per-render alias would trip
  // react-hooks/static-components.
  const scene = DIAGRAMS[diagram]?.() ?? null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-border bg-card hover:bg-muted flex flex-col gap-2 rounded-lg border",
            "p-3 text-left transition-colors select-none",
          )}
        >
          {/* bounded so the odd full-width card keeps the same diagram size
              as its half-width neighbours */}
          <span className="block w-full max-w-[300px] self-center">{scene}</span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <Plus className="text-muted-foreground size-4 shrink-0" aria-hidden />
            <span className="min-w-0">{label}</span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="mx-auto w-full max-w-[380px]">{scene}</div>
        {/* the portal escapes .lesson-body, so links must state their own
            affordance or they read as body text */}
        <div className="text-sm leading-relaxed [&>*+*]:mt-3 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-muted-foreground/60 [&_a:hover]:decoration-foreground">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
