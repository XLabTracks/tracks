"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { VerificationWidgetProps } from "@/components/verification/kit/types";
import {
  BLOOM,
  DETECTION_GAP,
  EO_2023,
  evade,
  type MetricId,
  type Policy,
} from "@/lib/detection-game";

const METRICS: {
  id: MetricId;
  label: string;
  reports: string;
  mod: number;
}[] = [
  {
    id: "total-flops",
    label: "Total operations",
    reports:
      "Floating-point operations summed across everything an account runs.",
    mod: 0,
  },
  {
    id: "cluster-size",
    label: "GPU cluster size",
    reports: "The largest group of GPUs one instance uses at once.",
    mod: 1,
  },
  {
    id: "power",
    label: "Power draw",
    reports: "Power consumed by the hardware behind an account's instances.",
    mod: 2,
  },
  {
    id: "data-transfer",
    label: "Large data transfers",
    reports: "Training data arriving suddenly in a newly registered account.",
    mod: 3,
  },
  {
    id: "instruction-pattern",
    label: "Instruction pattern",
    reports:
      "The share of multiply-accumulate operations, which training runs high.",
    mod: 4,
  },
];

const FLOPS_CEILINGS = [1e22, 1e23, 1e24, 1e26];
const CLUSTER_CEILINGS = [1e16, 1e18, 1e20];
const POWER_CEILINGS = [50, 150, 500];
const SESSION_SIZES = [1e20, 1e21, 1e22, 1e23];

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

const exp = (value: number) => {
  const power = Math.round(Math.log10(value));
  const digits = String(power)
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)] ?? d)
    .join("");
  return `10${digits}`;
};

const count = (value: number) => Math.round(value).toLocaleString("en-US");

const days = (value: number) =>
  value >= 10 ? Math.round(value).toLocaleString("en-US") : value.toFixed(1);

export function DetectionGame({
  onComplete,
  initialCompleted,
}: VerificationWidgetProps) {
  const [mandatory, setMandatory] = useState<MetricId[]>(["total-flops"]);
  const [totalFlops, setTotalFlops] = useState<number>(EO_2023.totalFlops);
  const [clusterFlopsPerSecond, setCluster] = useState<number>(
    EO_2023.clusterFlopsPerSecond,
  );
  const [powerKilowatts, setPower] = useState(500);
  const [sessionSize, setSessionSize] = useState(1e22);
  const reported = useRef(initialCompleted);

  const policy: Policy = useMemo(
    () => ({ mandatory, totalFlops, clusterFlopsPerSecond, powerKilowatts }),
    [mandatory, totalFlops, clusterFlopsPerSecond, powerKilowatts],
  );
  const outcome = useMemo(
    () => evade(policy, sessionSize),
    [policy, sessionSize],
  );

  useEffect(() => {
    if (outcome.evaderWins || reported.current) return;
    reported.current = true;
    onComplete();
  }, [outcome.evaderWins, onComplete]);

  const toggle = (id: MetricId) =>
    setMandatory((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const on = (id: MetricId) => mandatory.includes(id);
  const binding = outcome.evaderWins ? null : outcome.binding;

  return (
    <div className="not-prose my-6 space-y-4">
      <section className="border-border bg-card rounded-xl border p-4">
        <p className="eyebrow text-muted-foreground">
          You write the reporting rule
        </p>
        <p className="mt-1.5 text-sm leading-relaxed">
          A customer wants to train BLOOM on a cloud provider without being
          reported. Its training cost is {exp(BLOOM.totalFlops)} operations —
          above the {exp(EO_2023.totalFlops)} threshold, so running it in one
          piece would report. The customer may split the run across as many
          accounts as it likes. Choose what providers must measure, and watch
          what the customer does about it.
        </p>
      </section>

      <section className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">What must a provider measure?</p>
        <div className="mt-3 space-y-2">
          {METRICS.map((metric) => {
            const active = on(metric.id);
            const stops = binding === metric.id;
            return (
              <button
                key={metric.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(metric.id)}
                className={cn(
                  "block w-full rounded-lg border p-3 text-left transition-colors",
                  active
                    ? "border-border bg-muted"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span
                    className="text-sm font-semibold"
                    style={
                      active
                        ? { color: `var(--mod-${metric.mod}-text, inherit)` }
                        : undefined
                    }
                  >
                    {metric.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {active ? "Mandatory" : "Not required"}
                  </span>
                  {stops && (
                    <span className="text-met text-xs font-medium">
                      ✓ Stops the split
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                  {metric.reports}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {(on("total-flops") || on("cluster-size") || on("power")) && (
        <section className="border-border rounded-xl border p-4">
          <p className="text-sm font-medium">Set the thresholds</p>
          <div className="mt-3 space-y-3">
            {on("total-flops") && (
              <Choice
                label="Operations per account, before it reports"
                options={FLOPS_CEILINGS.map((v) => ({
                  value: v,
                  label: exp(v),
                }))}
                value={totalFlops}
                onChange={setTotalFlops}
              />
            )}
            {on("cluster-size") && (
              <Choice
                label="Operations per second for one GPU group"
                options={CLUSTER_CEILINGS.map((v) => ({
                  value: v,
                  label: `${exp(v)}/s`,
                }))}
                value={clusterFlopsPerSecond}
                onChange={setCluster}
              />
            )}
            {on("power") && (
              <Choice
                label="Average power per account"
                options={POWER_CEILINGS.map((v) => ({
                  value: v,
                  label: `${v} kW`,
                }))}
                value={powerKilowatts}
                onChange={setPower}
              />
            )}
          </div>
        </section>
      )}

      <section className="border-border rounded-xl border p-4">
        <p className="text-sm font-medium">
          How big does the customer make each session?
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          Its own lever. Bigger sessions need fewer accounts and take longer.
        </p>
        <div className="mt-3">
          <Choice
            label="Operations per session"
            options={SESSION_SIZES.map((v) => ({ value: v, label: exp(v) }))}
            value={sessionSize}
            onChange={setSessionSize}
          />
        </div>
      </section>

      <Result outcome={outcome} />
    </div>
  );
}

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: number; label: string }[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-[1_1_88px] rounded-lg border px-3 py-2 text-sm transition-colors",
              option.value === value
                ? "border-primary bg-primary text-primary-foreground font-medium"
                : "border-border hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Result({ outcome }: { outcome: ReturnType<typeof evade> }) {
  if (!outcome.evaderWins) {
    const why: Partial<Record<MetricId, string>> = {
      "total-flops":
        "One session already breaks the threshold, and no arrangement of accounts hides a session.",
      power:
        "Training needs at least one instance, and one instance already draws more than this.",
      "data-transfer":
        "The dataset does not get smaller when the run is cut up. It has to arrive somewhere, and arriving in a new account is the signal.",
      "instruction-pattern":
        "The share of multiply-accumulate operations belongs to the algorithm, not to the account. Splitting does not change a ratio.",
    };
    return (
      <section className="border-border rounded-xl border p-4">
        <p className="text-met text-sm font-semibold">The split fails</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          {why[outcome.binding] ??
            "No arrangement of accounts stays under this threshold."}
        </p>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          The customer can still train — by buying less capable hardware, by
          accepting a longer run, or by going somewhere this rule does not
          reach. What it can no longer do is stay unreported here.
        </p>
      </section>
    );
  }

  const { plan } = outcome;
  const rows = [
    ["Accounts to register", count(plan.accounts)],
    ["Sessions in total", count(plan.sessions)],
    ["Sessions per account", count(plan.sessionsPerAccount)],
    ["GPUs in one instance", count(plan.gpusPerInstance)],
    ["Days per session", days(plan.daysPerSession)],
    ["Days for the whole run", days(plan.totalDays)],
  ];

  return (
    <section className="border-border rounded-xl border p-4">
      <p className="text-sm font-semibold">Nothing reports</p>
      <p className="mt-1.5 text-sm leading-relaxed">
        Every account stays under every threshold, so the provider has no
        account to hand over and the customer trains unobserved.
      </p>
      <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        {rows.map(([term, value]) => (
          <div key={term} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
        BLOOM sits inside the gap this leaves: models costing between{" "}
        {exp(DETECTION_GAP.low)} and {exp(DETECTION_GAP.high)} operations.
        Thresholds here are inputs, not recommendations — the report uses this
        calculation to show how an evader exploits the unit a rule adds up over.
      </p>
    </section>
  );
}
