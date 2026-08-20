
export type GameFamily = "pd" | "deadlock" | "assurance" | "harmony" | "chicken";

export type PersonaType = "cautious" | "opportunist" | "mirror";

export type Move = "restrain" | "race";

export interface LabState {
  v: number;
  c: number;
  p: number;
  F: number;
  delta: number;
  share: boolean;
  agreement: boolean;
}

export interface Payoffs {
  R: number;
  T: number;
  S: number;
  P: number;
}

export interface EffPayoffs extends Payoffs {
  transformed: boolean;
}

export const CONFIG = {
  payoffs: {
    R: 40,
    Tbase: 20,
    TslopeV: 0.6,
    S: -60,
    Pbase: 10,
    PslopeC: 0.9,
    shareFactor: 0.5,
  },
  sliders: {
    v: { min: 0, max: 100, step: 1, def: 75 },
    c: { min: 0, max: 100, step: 1, def: 25 },
    p: { min: 0, max: 1, step: 0.01, def: 0 },
    F: { min: 0, max: 100, step: 1, def: 40 },
    delta: { min: 0, max: 0.95, step: 0.05, def: 0 },
  },
  defaults: { share: false, agreement: true },
  presets: {
    hawk: { v: 90, c: 15, share: false },
    dove: { v: 40, c: 85, share: true },
  },
  schedule: ["cautious", "cautious", "opportunist", "mirror", "mirror"] as PersonaType[],
  opportunistCatchThreshold: 0.5,
  phase1p: 0,
  mirrorDefault: "restrain" as Move,
  eps: 1e-9,
  tiltUnit: 50,
  tiltMaxDeg: 7,
} as const;

export function basePayoffs(s: LabState): Payoffs {
  const k = CONFIG.payoffs;
  let T = k.Tbase + k.TslopeV * s.v;
  if (s.share) T -= k.shareFactor * s.c;
  const P = k.Pbase - k.PslopeC * s.c;
  return { R: k.R, T, S: k.S, P };
}

export function effPayoffs(s: LabState): EffPayoffs {
  const b = basePayoffs(s);
  if (!s.agreement) return { R: b.R, T: b.T, S: b.S, P: b.P, transformed: false };
  return {
    R: b.R,
    T: (1 - s.p) * b.T + s.p * (b.P - s.F),
    S: (1 - s.p) * b.S + s.p * b.P,
    P: b.P,
    transformed: true,
  };
}

export function classify(e: Payoffs): { fam: GameFamily; knife: boolean } {
  const eps = CONFIG.eps;
  const eq = (a: number, b: number) => Math.abs(a - b) <= eps;
  const tie1 = eq(e.T, e.R),
    tie2 = eq(e.P, e.S);
  const raceBR1 = tie1 ? true : e.T > e.R;
  const raceBR2 = tie2 ? true : e.P > e.S;
  let fam: GameFamily,
    knife = tie1 || tie2;
  if (raceBR1 && raceBR2) {
    const tie3 = eq(e.P, e.R);
    fam = !tie3 && e.P < e.R ? "pd" : "deadlock";
    knife = knife || tie3;
  } else if (!raceBR1 && raceBR2) fam = "assurance";
  else if (!raceBR1 && !raceBR2) fam = "harmony";
  else fam = "chicken";
  return { fam, knife };
}

export function equilibria(e: Payoffs): string[] {
  const eps = CONFIG.eps;
  const M = [
    [e.R, e.S],
    [e.T, e.P],
  ];
  const out: string[] = [];
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      const rowOK = M[i][j] >= M[1 - i][j] - eps;
      const colOK = M[j][i] >= M[1 - j][i] - eps;
      if (rowOK && colOK) out.push(i + "" + j);
    }
  return out;
}

export function repeatMultiplier(delta: number, p: number): number {
  return (delta * p) / (1 - delta * (1 - p));
}

export function repeatedVerdict(
  e: Payoffs,
  delta: number,
  p: number,
): { gain: number; cost: number; sustainable: boolean } {
  const gain = e.T - e.R;
  const cost = repeatMultiplier(delta, p) * (e.R - e.P);
  return { gain, cost, sustainable: cost >= gain - CONFIG.eps };
}

export function pacMove(
  type: PersonaType,
  mem: { betrayed?: boolean },
  ctx: { p?: number; lastYou?: Move | null },
): Move {
  if (type === "cautious") return mem.betrayed ? "race" : "restrain";
  if (type === "opportunist")
    return (ctx.p ?? 0) >= CONFIG.opportunistCatchThreshold ? "restrain" : "race";
  if (type === "mirror") return ctx.lastYou || CONFIG.mirrorDefault;
  throw new Error("unknown personality " + type);
}

export function labDefaults(): LabState {
  const s = CONFIG.sliders;
  return {
    v: s.v.def,
    c: s.c.def,
    p: s.p.def,
    F: s.F.def,
    delta: s.delta.def,
    share: CONFIG.defaults.share,
    agreement: CONFIG.defaults.agreement,
  };
}
