"use client";

import { useCallback, useRef } from "react";

import { LegacyScripts } from "@/components/verification/legacy-scripts";

type SkillMapApi = {
  mount: (opts?: { query?: boolean }) => unknown;
};

const SCRIPTS = [
  "data/course.js",
  "data/skills.js",
  "data/chrome.js",
  "platform.js",
  "skill-web.js",
  "map.js",
];

export function SkillMapHost() {
  const mounted = useRef(false);

  const mount = useCallback(() => {
    if (mounted.current) return;
    const map = (window as unknown as { VTSkillMap?: SkillMapApi }).VTSkillMap;
    if (!map) return;
    mounted.current = true;
    map.mount({ query: true });
  }, []);

  return (
    <>
      <div className="mod-filters" id="modFilters"></div>

      <div className="constellation">
        <div>
          <div className="sky" id="sky"></div>
          <div className="sky-legend">
            <span>number inside a star — find it in the key below</span>
            <span>ring around a star — how much of it you hold</span>
            <span>solid beam — fed from inside the module</span>
            <span>dashed line — fed from another module</span>
            <span>
              arm from the hub — the module&apos;s own shape, not a dependency
            </span>
            <span className="on-hover">click a star or a key row to pin it</span>
            <span className="on-touch">tap a star or a key row to pin it</span>
          </div>
          <ol className="sky-key" id="skyKey"></ol>
        </div>
        <div className="sky-panel" id="skyPanel"></div>
      </div>
      <LegacyScripts src={SCRIPTS} onReady={mount} />
    </>
  );
}
