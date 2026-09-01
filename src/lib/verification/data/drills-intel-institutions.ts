import type { DrillDeck } from "./drills";

export const DRILLS_INTEL_INSTITUTIONS: DrillDeck = {
  id: "drills-intel-institutions",
  title: "Drill Bench: The Institutional Layer",
  blurb:
    "Two benches over 2.3.4: the clause anatomy drills what each NTM clause forbids and how it negotiated, and the asymmetry drill seats four parties at the sharing table. Free-riding and authentication live here, and your red-line inherits both.",
  benches: [
    {
      id: "clause-anatomy",
      label: "Clause anatomy",
      name: "The clause anatomy",
      kicker:
        "Three clauses make up every NTM article since SALT I. For each: predict what it actually forbids or requires, and what its negotiation history was — then reveal.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          brief:
            "\"Each Party undertakes not to interfere with the National Technical Means of verification of other Parties operating in accordance with the above.\"",
          statement: "Noninterference with NTM",
          q: "What does this clause actually do?",
          opts: [
            "Requires granting the other side overflight and site access on request",
            "Forbids attacking or degrading the other side's collection — jamming, blinding, dazzling, spoofing the sensors watching you",
            "Forbids operating your own satellites over the other party's territory",
            "Requires disclosing what your NTM can and cannot see",
          ],
          right: 1,
          why: "Committed. Now the negotiation history: was this clause easy or impossible to agree, and why?",
        },
        {
          type: "pick",
          statement: "Noninterference with NTM — the negotiation",
          q: "What was its negotiation history?",
          opts: [
            "Agreed only after decades of deadlock, traded against inspection rights",
            "Never accepted in any arms-control treaty",
            "One of the earliest and easiest points of agreement — it costs nothing: you keep your secrets and simply don't attack their sensors (Gottemoeller)",
          ],
          right: 2,
          why: "SALT I / ABM boilerplate, reused through New START and into the MIRI draft. It converts a capability into a mutual legal right not to be interfered with — and since neither side gives up anything it values, it signs easily.",
        },
        {
          type: "pick",
          brief:
            "\"Each Party undertakes not to use deliberate concealment measures which impede verification by national technical means of compliance with the provisions of this Agreement.\"",
          statement: "No deliberate concealment",
          q: "What does this clause actually do?",
          opts: [
            "Requires declaring every relevant facility to the other side",
            "Forbids building underground facilities of any kind",
            "Forbids active measures that impede NTM — camouflage, disguise, deliberate masking of the observables — while requiring no disclosure at all",
            "Requires switching off encryption during monitored events",
          ],
          right: 2,
          why: "Committed. Now the negotiation history: was this clause easy or impossible to agree, and why?",
        },
        {
          type: "pick",
          statement: "No deliberate concealment — the negotiation",
          q: "What was its negotiation history?",
          opts: [
            "Standard boilerplate beside noninterference — but its edge is soft: the line between ordinary security practice and \"deliberate concealment\" gets argued case by case",
            "Rejected in SALT and never revived",
            "Accepted bilaterally only, never in multilateral text",
          ],
          right: 0,
          why: "The clause bans hiding, not privacy: nothing obliges a party to show anything — only not to actively defeat the other side's lawful watching. For AI the argument moves to what counts as deliberate: behind-the-meter generation, windowless halls, workload obfuscation.",
        },
        {
          type: "pick",
          brief: "(No standard text exists — that absence is the datum.)",
          statement: "Intelligence sharing",
          q: "What does this clause do, in every real treaty?",
          opts: [
            "Obliges each party to hand verified intelligence to the treaty organization",
            "Requires sharing raw sensor feeds with all parties",
            "In every real treaty: nothing — no arms-control treaty imposes a duty to share intelligence; the practice is voluntary, informal, inconsistent",
            "Obliges sharing only with parties under formal suspicion",
          ],
          right: 2,
          why: "Committed. Now the negotiation history: why is this the clause that never gets written?",
        },
        {
          type: "pick",
          statement: "Intelligence sharing — the negotiation",
          q: "What is its negotiation history?",
          opts: [
            "Easy boilerplate, signed since SALT I",
            "The clause where drafting dies: sources-and-methods means a shared tip risks burning the collection that produced it — and a tip the rival cannot authenticate is worthless anyway",
            "Solved in New START via a joint intelligence commission",
          ],
          right: 1,
          why: "Baker §2.3.3: sharing is unobligated, voluntary, inconsistent — the regime leans on intelligence it has no right to demand. Kissinger's disclosure paradox is the general form. Your red-line meets this clause head-on in the written output.",
        },
      ],
    },
    {
      id: "who-watches",
      label: "Who watches for whom",
      name: "Who watches for whom",
      kicker:
        "The NTM article reads as if every party brings the same eyes. Nobody does. For each of four parties: predict what its own collection can see, and what it mostly does at the intelligence-sharing table — then reveal.",
      time: "~10 min",
      steps: [
        {
          type: "pick",
          statement: "The strongest collector (the United States, in the current record)",
          q: "What can its own collection see?",
          opts: [
            "Full-spectrum NTM — imagery, signals, and measurement constellations, plus decades of tradecraft to fuse them",
            "Real but partial collection — strong in niches, dependent on partners for the rest",
            "Little or none of its own — commercial imagery subscriptions and open sources at best",
            "No collection at all — it owns no satellites and runs no agents; treaties never gave it espionage powers",
          ],
          right: 0,
          why: "Committed. Now the sharing table: what does this party mostly do there?",
        },
        {
          type: "pick",
          statement: "The strongest collector — at the sharing table",
          q: "What does it mostly do at the intelligence-sharing table?",
          opts: [
            "Gives more than it gets — and pays for every tip in sources-and-methods risk",
            "Trades selectively — shares to build coalitions, keeps the crown jewels",
            "Consumes — free-rides on stronger collectors, with little to offer back",
            "Receives only — it depends on voluntary tips it has no right to demand",
          ],
          right: 0,
          why: "The case record runs on its output: most of Baker's tips-driven investigations began with US or allied collection, and every tip passed onward carried the sources-and-methods bill. Wasil's \"usable unilaterally\" describes this seat best — which is also why its capital treats NTM as the sovereignty-compatible layer and resists anything that obliges disclosure.",
        },
        {
          type: "pick",
          statement: "A middle-power ally with real but partial collection",
          q: "What can its own collection see?",
          opts: [
            "Full-spectrum NTM — imagery, signals, and measurement constellations, plus decades of tradecraft to fuse them",
            "Real but partial collection — strong in niches, dependent on partners for the rest",
            "Little or none of its own — commercial imagery subscriptions and open sources at best",
            "No collection at all — it owns no satellites and runs no agents; treaties never gave it espionage powers",
          ],
          right: 1,
          why: "Committed. Now the sharing table: what does this party mostly do there?",
        },
        {
          type: "pick",
          statement: "A middle-power ally — at the sharing table",
          q: "What does it mostly do at the intelligence-sharing table?",
          opts: [
            "Gives more than it gets — and pays for every tip in sources-and-methods risk",
            "Trades selectively — shares to build coalitions, keeps the crown jewels",
            "Consumes — free-rides on stronger collectors, with little to offer back",
            "Receives only — it depends on voluntary tips it has no right to demand",
          ],
          right: 1,
          why: "Partial constellations, deep niches, alliance plumbing. Sharing is its coalition currency: the Al-Kibar file itself crossed an alliance table (Israeli collection handed to Washington) before any regime ever saw a finding. Middle powers share to be in the room — and hold back exactly the sources that bought the seat.",
        },
        {
          type: "pick",
          statement: "A small treaty signatory with no satellites",
          q: "What can its own collection see?",
          opts: [
            "Full-spectrum NTM — imagery, signals, and measurement constellations, plus decades of tradecraft to fuse them",
            "Real but partial collection — strong in niches, dependent on partners for the rest",
            "Little or none of its own — commercial imagery subscriptions and open sources at best",
            "No collection at all — it owns no satellites and runs no agents; treaties never gave it espionage powers",
          ],
          right: 2,
          why: "Committed. Now the sharing table: what does this party mostly do there?",
        },
        {
          type: "pick",
          statement: "A small treaty signatory — at the sharing table",
          q: "What does it mostly do at the intelligence-sharing table?",
          opts: [
            "Gives more than it gets — and pays for every tip in sources-and-methods risk",
            "Trades selectively — shares to build coalitions, keeps the crown jewels",
            "Consumes — free-rides on stronger collectors, with little to offer back",
            "Receives only — it depends on voluntary tips it has no right to demand",
          ],
          right: 2,
          why: "The free-riding seat — and the treaty is designed to let it ride: it signs the same NTM clauses, contributes almost nothing to detection, and consumes the deterrence the strong collectors generate. Baker's point is that this is structural, not scandalous: a verification regime whose evidence layer only strong states can operate is a regime with unequal stakeholders by construction.",
        },
        {
          type: "pick",
          statement: "The treaty organization itself (the IAEA-analog)",
          q: "What can its own collection see?",
          opts: [
            "Full-spectrum NTM — imagery, signals, and measurement constellations, plus decades of tradecraft to fuse them",
            "Real but partial collection — strong in niches, dependent on partners for the rest",
            "Little or none of its own — commercial imagery subscriptions and open sources at best",
            "No collection at all — it owns no satellites and runs no agents; treaties never gave it espionage powers",
          ],
          right: 3,
          why: "Committed. Now the sharing table: what does this party mostly do there?",
        },
        {
          type: "pick",
          statement: "The treaty organization — at the sharing table",
          q: "What does it mostly do at the intelligence-sharing table?",
          opts: [
            "Gives more than it gets — and pays for every tip in sources-and-methods risk",
            "Trades selectively — shares to build coalitions, keeps the crown jewels",
            "Consumes — free-rides on stronger collectors, with little to offer back",
            "Receives only — it depends on voluntary tips it has no right to demand",
          ],
          right: 3,
          why: "The institutional punchline: the body that adjudicates compliance is the weakest collector at the table. The IAEA received the tips that opened its hardest files — it could never have demanded them. Six Layers argues this is the right design: an espionage-authorized international body would create new risks. The org's power is not collection; it is the right to act on a lead — clarification, access, samples.",
        },
      ],
    },
  ],
};
