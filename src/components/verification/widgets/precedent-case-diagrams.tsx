import type { ReactElement } from "react";

const LABEL = "fill-muted-foreground";
const NAME = "fill-foreground";

function Arrow({
  x1,
  y1,
  x2,
  y2,
  className = "stroke-muted-foreground",
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  className?: string;
  dashed?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 6;
  const hx1 = x2 - head * Math.cos(angle - 0.45);
  const hy1 = y2 - head * Math.sin(angle - 0.45);
  const hx2 = x2 - head * Math.cos(angle + 0.45);
  const hy2 = y2 - head * Math.sin(angle + 0.45);
  return (
    <g className={className} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M ${hx1} ${hy1} L ${x2} ${y2} L ${hx2} ${hy2}`} />
    </g>
  );
}

function Tick({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M ${x - 3.5} ${y} l 2.6 2.8 l 4.6 -5.6`}
      className="stroke-comply"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Cross({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return (
    <g className="stroke-defect" strokeWidth="2" strokeLinecap="round">
      <line x1={x - r} y1={y - r} x2={x + r} y2={y + r} />
      <line x1={x + r} y1={y - r} x2={x - r} y2={y + r} />
    </g>
  );
}

function Frame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 340 116" className="w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function BaruchDiagram() {
  return (
    <Frame label="The US sequence, inspections then disarmament, runs opposite to the Soviet sequence; neither side would move first.">
      <text x="8" y="29" fontSize="10" fontWeight="600" className={NAME}>
        US
      </text>
      <rect x="46" y="12" width="118" height="26" rx="6" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
      <text x="105" y="28" fontSize="9.5" textAnchor="middle" className={NAME}>
        inspections first
      </text>
      <Arrow x1={164} y1={25} x2={196} y2={25} />
      <rect x="198" y="12" width="118" height="26" rx="6" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
      <text x="257" y="28" fontSize="9.5" textAnchor="middle" className={NAME}>
        then give up arsenal
      </text>

      <text x="8" y="93" fontSize="10" fontWeight="600" className={NAME}>
        USSR
      </text>
      <rect x="46" y="76" width="118" height="26" rx="6" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
      <text x="105" y="92" fontSize="9.5" textAnchor="middle" className={NAME}>
        eliminate weapons first
      </text>
      <Arrow x1={164} y1={89} x2={196} y2={89} />
      <rect x="198" y="76" width="118" height="26" rx="6" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
      <text x="257" y="92" fontSize="9.5" textAnchor="middle" className={NAME}>
        then inspections
      </text>

      <Cross x={92} y={56} />
      <text x="104" y="59" fontSize="9.5" className="fill-defect">
        neither side trusted the other to move first
      </text>
    </Frame>
  );
}

function IaeaDiagram() {
  return (
    <Frame label="Nuclear material sits inside layered rings: seals, identifiers and cameras, then inspections and material accountancy.">
      <rect x="30" y="8" width="280" height="96" rx="14" className="stroke-border" fill="none" strokeWidth="1.5" />
      <text x="170" y="22" fontSize="9" textAnchor="middle" className={LABEL}>
        inspections · material accountancy
      </text>
      <rect x="75" y="28" width="190" height="56" rx="10" className="stroke-border" fill="none" strokeWidth="1.5" />
      <text x="170" y="42" fontSize="9" textAnchor="middle" className={LABEL}>
        seals · identifiers · cameras
      </text>
      <rect x="120" y="50" width="100" height="22" rx="6" className="fill-muted/60 stroke-border" strokeWidth="1.5" />
      <text x="170" y="64" fontSize="9.5" textAnchor="middle" className={NAME}>
        nuclear material
      </text>
      <Tick x={90} y={95} />
      <text x="100" y="98" fontSize="9" className="fill-comply">
        no single device carries the system
      </text>
    </Frame>
  );
}

function AntarcticDiagram() {
  return (
    <Frame label="Observers enter Antarctica from every side, with aerial observation overhead; broad access was accepted.">
      <polygon
        points="140,46 196,42 218,62 206,86 166,94 132,80"
        className="fill-muted/50 stroke-border"
        strokeWidth="1.5"
      />
      <text x="172" y="70" fontSize="10" fontWeight="600" textAnchor="middle" className={NAME}>
        Antarctica
      </text>
      <Arrow x1={48} y1={40} x2={128} y2={58} className="stroke-comply" />
      <Arrow x1={292} y1={40} x2={224} y2={58} className="stroke-comply" />
      <Arrow x1={48} y1={96} x2={126} y2={80} className="stroke-comply" />
      <Arrow x1={292} y1={96} x2={224} y2={84} className="stroke-comply" />
      <text x="26" y="32" fontSize="9.5" className="fill-comply">
        observers
      </text>
      <path d="M 120 22 Q 172 6 224 22" className="stroke-muted-foreground" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
      <text x="230" y="20" fontSize="9" className={LABEL}>
        aerial observation
      </text>
      <Tick x={34} y={108} />
      <text x="44" y="111" fontSize="9" className="fill-comply">
        broad inspection rights accepted
      </text>
    </Frame>
  );
}

function BwcDiagram() {
  return (
    <Frame label="The prohibition on paper stands apart from a covert program; no routine on-site verification connects them.">
      <rect x="30" y="24" width="64" height="64" rx="4" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
      <g className="stroke-border" strokeWidth="1.5" strokeLinecap="round">
        <line x1="40" y1="38" x2="84" y2="38" />
        <line x1="40" y1="49" x2="84" y2="49" />
        <line x1="40" y1="60" x2="84" y2="60" />
        <line x1="40" y1="71" x2="70" y2="71" />
      </g>
      <text x="62" y="102" fontSize="9.5" textAnchor="middle" className={NAME}>
        prohibition on paper
      </text>

      <line x1="100" y1="56" x2="158" y2="56" className="stroke-muted-foreground" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="182" y1="56" x2="234" y2="56" className="stroke-muted-foreground" strokeWidth="1.5" strokeDasharray="4 3" />
      <Cross x={170} y={56} />
      <text x="170" y="36" fontSize="9" textAnchor="middle" className="fill-defect">
        no routine on-site verification
      </text>

      <rect x="240" y="24" width="76" height="64" rx="6" className="fill-defect/10 stroke-defect" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x="278" y="52" fontSize="10" fontWeight="600" textAnchor="middle" className={NAME}>
        Biopreparat
      </text>
      <text x="278" y="66" fontSize="9" textAnchor="middle" className={LABEL}>
        covert program
      </text>
      <text x="278" y="102" fontSize="9" textAnchor="middle" className={LABEL}>
        revealed by defectors
      </text>
    </Frame>
  );
}

function InfDiagram() {
  return (
    <Frame label="Missiles leave the Votkinsk plant through the CargoScan portal; permitted SS-25s pass, prohibited SS-20s cannot.">
      <rect x="24" y="40" width="84" height="48" rx="4" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
      <text x="66" y="61" fontSize="10" fontWeight="600" textAnchor="middle" className={NAME}>
        Votkinsk
      </text>
      <text x="66" y="74" fontSize="9" textAnchor="middle" className={LABEL}>
        missile plant
      </text>

      <rect x="150" y="26" width="5" height="64" className="fill-border" />
      <rect x="175" y="26" width="5" height="64" className="fill-border" />
      <g className="stroke-muted-foreground" strokeWidth="1" strokeDasharray="3 3">
        <line x1="155" y1="42" x2="175" y2="42" />
        <line x1="155" y1="58" x2="175" y2="58" />
        <line x1="155" y1="74" x2="175" y2="74" />
      </g>
      <text x="165" y="16" fontSize="9.5" textAnchor="middle" className={NAME}>
        CargoScan portal
      </text>

      <line x1="108" y1="52" x2="150" y2="46" className="stroke-muted-foreground" strokeWidth="1.5" />
      <Arrow x1={180} y1={44} x2={226} y2={38} className="stroke-comply" />
      <Tick x={236} y={35} />
      <text x="246" y="39" fontSize="9.5" className="fill-comply">
        SS-25 permitted
      </text>

      <line x1="108" y1="76" x2="150" y2="82" className="stroke-muted-foreground" strokeWidth="1.5" />
      <Cross x={192} y={86} />
      <text x="204" y="90" fontSize="9.5" className="fill-defect">
        SS-20 prohibited
      </text>
    </Frame>
  );
}

function SouthAfricaDiagram() {
  const sources = [
    { y: 8, label: "production records" },
    { y: 34, label: "former facilities" },
    { y: 60, label: "equipment" },
    { y: 86, label: "personnel interviews" },
  ];
  return (
    <Frame label="Records, facilities, equipment and personnel interviews each feed the finding that the declaration was complete.">
      {sources.map((s) => (
        <g key={s.label}>
          <rect x="24" y={s.y} width="110" height="18" rx="5" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
          <text x="79" y={s.y + 12.5} fontSize="9" textAnchor="middle" className={NAME}>
            {s.label}
          </text>
          <Arrow x1={134} y1={s.y + 9} x2={212} y2={55 + (s.y - 47) * 0.12} />
        </g>
      ))}
      <rect x="216" y="38" width="108" height="36" rx="6" className="fill-comply/10 stroke-comply" strokeWidth="1.5" />
      <Tick x={232} y={55} />
      <text x="244" y="53" fontSize="9.5" fontWeight="600" className={NAME}>
        declaration
      </text>
      <text x="244" y="66" fontSize="9.5" fontWeight="600" className={NAME}>
        complete
      </text>
      <text x="270" y="90" fontSize="9" textAnchor="middle" className={LABEL}>
        baseline rebuilt over ~2 years
      </text>
    </Frame>
  );
}

function CwcDiagram() {
  return (
    <Frame label="An inspection path crosses the facility around shrouded equipment and still answers the question; the challenge-inspection door stays unused.">
      <rect x="20" y="16" width="196" height="80" rx="8" className="stroke-border" fill="none" strokeWidth="1.5" />
      <rect x="112" y="30" width="72" height="34" rx="4" className="fill-muted/70 stroke-border" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="148" y="44" fontSize="9" textAnchor="middle" className={NAME}>
        shrouded
      </text>
      <text x="148" y="56" fontSize="9" textAnchor="middle" className={NAME}>
        equipment
      </text>
      <Arrow x1={24} y1={80} x2={196} y2={80} className="stroke-comply" dashed />
      <Tick x={204} y={76} />
      <text x="108" y="110" fontSize="9" textAnchor="middle" className="fill-comply">
        managed access · questions answered
      </text>

      <rect x="248" y="30" width="64" height="54" rx="4" className="fill-muted/30 stroke-border" strokeWidth="1.5" />
      <circle cx="304" cy="75" r="2" className="fill-muted-foreground" />
      <text x="280" y="52" fontSize="9" textAnchor="middle" className={NAME}>
        challenge
      </text>
      <text x="280" y="64" fontSize="9" textAnchor="middle" className={NAME}>
        inspection
      </text>
      <text x="280" y="100" fontSize="9" textAnchor="middle" className={LABEL}>
        never invoked
      </text>
    </Frame>
  );
}

function CtbtDiagram() {
  const stations = [
    { y: 22, label: "seismic" },
    { y: 46, label: "hydroacoustic" },
    { y: 70, label: "infrasound" },
    { y: 94, label: "radionuclide" },
  ];
  return (
    <Frame label="Signals from a test cross the border to seismic, hydroacoustic, infrasound and radionuclide stations, which detect it from outside.">
      <g className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round">
        <line x1="62" y1="50" x2="78" y2="66" />
        <line x1="78" y1="50" x2="62" y2="66" />
        <line x1="70" y1="47" x2="70" y2="69" />
        <line x1="59" y1="58" x2="81" y2="58" />
      </g>
      <text x="70" y="86" fontSize="9.5" textAnchor="middle" className={NAME}>
        test
      </text>
      <g className="stroke-muted-foreground" strokeWidth="1.5" fill="none">
        <path d="M 92 40 Q 108 58 92 76" />
        <path d="M 106 32 Q 126 58 106 84" />
        <path d="M 120 24 Q 144 58 120 92" />
      </g>
      <line x1="170" y1="10" x2="170" y2="98" className="stroke-border" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="170" y="110" fontSize="9" textAnchor="middle" className={LABEL}>
        border · no inspectors inside
      </text>
      {stations.map((s) => (
        <g key={s.label}>
          <path d={`M 210 ${s.y - 5} l 5 9 h -10 z`} className="fill-muted-foreground" />
          <text x="224" y={s.y + 3} fontSize="9" className={NAME}>
            {s.label}
          </text>
        </g>
      ))}
      <Tick x={308} y={56} />
      <text x="308" y="74" fontSize="9" textAnchor="middle" className="fill-comply">
        detected
      </text>
    </Frame>
  );
}

const DIAGRAMS: Record<string, () => ReactElement> = {
  baruch: BaruchDiagram,
  iaea: IaeaDiagram,
  antarctic: AntarcticDiagram,
  bwc: BwcDiagram,
  inf: InfDiagram,
  "south-africa": SouthAfricaDiagram,
  cwc: CwcDiagram,
  ctbt: CtbtDiagram,
};

export function PrecedentCaseDiagram({ caseId }: { caseId: string }) {
  const Diagram = DIAGRAMS[caseId];
  if (!Diagram) return null;
  return <Diagram />;
}
