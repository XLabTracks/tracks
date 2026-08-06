"use client";

import { useState } from "react";

// Interactive version of the appendix BOTEC in "Notes on cooperating with
// unaligned AIs": a leading lab pledges 10% of its equity toward AI
// payments, and the estimate multiplies through to an all-things-considered
// takeover-risk reduction. Defaults reproduce the post's numbers (60% ×
// 50% × 75% ≈ 20% movable values; a 3x payment-belief shift on a
// log-uniform [0.1, 10] ratio ≈ 25% flip; other value-types half as
// promising → 15%; ×0.5 for multiple AIs → 7.5%; ×17pp risk cut → ~1.3pp
// in the main scenario; ×0.2 scenario probability ×0.55 understanding
// discount → ~0.14pp). The author calls the estimate a starting point, not
// a result — the sliders exist to find which assumptions the conclusion is
// actually sensitive to.

function fmtPct(v: number, digits = 1): string {
  return `${(v * 100).toFixed(digits)}%`;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums whitespace-nowrap">{display}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary w-full"
        aria-label={label}
      />
    </div>
  );
}

function Stage({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-2 ${
        accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="text-muted-foreground text-[11px] leading-tight">{label}</div>
      <div className="text-foreground text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export function CoopBotecDemo() {
  // Group 1 — does the intervention flip any AI to cooperating?
  const [pLong, setPLong] = useState(60); // cares about long-term resources, %
  const [pScope, setPScope] = useState(50); // scope-sensitive (~linear), %
  const [pDisunited, setPDisunited] = useState(75); // believes other AIs don't share its values, %
  const [mult, setMult] = useState(3); // how much a serious promise multiplies expected human payment
  const [multiAIs, setMultiAIs] = useState(50); // discount for "some other AI cooperates anyway", %
  // Group 2 — how much risk does cooperation remove?
  const [riskCut, setRiskCut] = useState(17); // pp reduction if AIs cooperate, off a 50% baseline
  // Group 3 — how likely is the scenario where all this matters?
  const [pScenario, setPScenario] = useState(20); // scheming-prone values, %
  const [understanding, setUnderstanding] = useState(55); // discount for lack-of-understanding worlds, %

  // The movable-values combination.
  const combo = (pLong / 100) * (pScope / 100) * (pDisunited / 100);
  // A payment-belief ratio log-uniform on [0.1, 10]; multiplying human
  // payment by `mult` flips a log10(mult)/2 slice of the distribution.
  const flip = Math.min(Math.max(Math.log10(mult) / 2, 0), 1);
  // Other value-types: half as promising on average (the post's assumption).
  const oneAI = combo * flip + (1 - combo) * (flip / 2);
  const anyAI = oneAI * (multiAIs / 100);
  const mainScenarioPP = anyAI * riskCut;
  const finalPP = mainScenarioPP * (pScenario / 100) * (understanding / 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stage
          label="AI has movable values (long-term × scope-sensitive × disunified)"
          value={fmtPct(combo)}
        />
        <Stage
          label="A serious promise flips some AI (others half as movable)"
          value={fmtPct(oneAI)}
        />
        <Stage
          label="…and it mattered (no other cooperator)"
          value={fmtPct(anyAI)}
        />
        <Stage
          label="Risk cut in the main scenario (of 50% takeover risk)"
          value={`${mainScenarioPP.toFixed(2)}pp`}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
        <Stage
          label="All-things-considered risk reduction, after the scenario discounts"
          value={`${finalPP.toFixed(2)}pp`}
          accent
        />
      </div>

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Slider
          label="AI mostly cares about long-term resources"
          value={pLong}
          min={0}
          max={100}
          step={5}
          display={`${pLong}%`}
          onChange={setPLong}
        />
        <Slider
          label="Those values are scope-sensitive (~linear)"
          value={pScope}
          min={0}
          max={100}
          step={5}
          display={`${pScope}%`}
          onChange={setPScope}
        />
        <Slider
          label="AI believes other AIs don't share its values"
          value={pDisunited}
          min={0}
          max={100}
          step={5}
          display={`${pDisunited}%`}
          onChange={setPDisunited}
        />
        <Slider
          label="Promise multiplies expected human payment by"
          value={mult}
          min={1}
          max={10}
          step={0.5}
          display={`${mult}x`}
          onChange={setMult}
        />
        <Slider
          label="Chance this AI's flip was the one that mattered"
          value={multiAIs}
          min={0}
          max={100}
          step={5}
          display={`×${(multiAIs / 100).toFixed(2)}`}
          onChange={setMultiAIs}
        />
        <Slider
          label="Risk reduction if AIs cooperate"
          value={riskCut}
          min={0}
          max={50}
          step={1}
          display={`${riskCut}pp`}
          onChange={setRiskCut}
        />
        <Slider
          label="Probability of widespread scheming-prone values"
          value={pScenario}
          min={0}
          max={100}
          step={5}
          display={`×${(pScenario / 100).toFixed(2)}`}
          onChange={setPScenario}
        />
        <Slider
          label="Discount for lack-of-understanding worlds"
          value={understanding}
          min={0}
          max={100}
          step={5}
          display={`×${(understanding / 100).toFixed(2)}`}
          onChange={setUnderstanding}
        />
      </div>

      <p className="text-muted-foreground text-sm">
        Defaults reproduce the text&apos;s own numbers, which its author
        offers as an exercise and starting point rather than a result — the
        point of dragging a slider is to see which assumptions the bottom
        line actually turns on.
      </p>
    </div>
  );
}
