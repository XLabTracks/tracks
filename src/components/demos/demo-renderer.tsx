"use client";

import { getDemo } from "@/lib/demos/registry";
import { ChromelessDemo, DemoFrame } from "./demo-frame";

export interface DemoByIdProps {
  id: string;
  /**
   * When false, render without the titled card — the chromeless shell keeps
   * the error boundary and (for interactive demos) the remount Reset.
   */
  framed?: boolean;
}

export function DemoById({ id, framed = true }: DemoByIdProps) {
  const demo = getDemo(id);
  if (!demo) {
    return (
      <div className="not-prose border-destructive/40 bg-destructive/5 text-destructive my-6 rounded-xl border p-4 text-sm">
        Unknown demo: <code>{id}</code>
      </div>
    );
  }
  const Component = demo.component;
  if (!framed)
    return (
      <ChromelessDemo showReset={demo.interactive !== false}>
        <Component />
      </ChromelessDemo>
    );
  return (
    <DemoFrame
      title={demo.title}
      description={demo.description}
      showReset={demo.interactive !== false}
    >
      <Component />
    </DemoFrame>
  );
}
