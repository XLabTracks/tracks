/**
 * Drill Bench: Supply Chain — the cross-module drill deck ported from the standalone
 * playground page (verification-drills-data.js). Content is human-authored
 * curriculum copied verbatim: do NOT re-author a statement, option, note or
 * reveal. The task grammar is adapted from the All-Russian social-studies
 * olympiad final rounds (2021) — true/false with absolutist traps, minimal
 * generalizing concept, spot-every-error, resolve-the-dispute, who-is-who
 * deduction, derivation chains, argument sorting, consequence analysis.
 *
 * The only edits made in the port are cross-references: the source page
 * numbered its modules 0/1/2.x/3/4, which is not this track's structure, so
 * those pointers now name the concept or the bench that carries it here.
 */
import type { DrillDeck } from "./drills";

export const DRILLS_SUPPLY_CHAIN: DrillDeck = {
  id: "drills-supply-chain",
  title: "Drill Bench: Supply Chain",
  blurb: "Four benches over the mechanism layers: group nine mechanisms into their layers, audit a too-confident hardware proposal, judge a cloud dispute where both sides are partly right, and separate what the crypto promises from what only people can testify to.",
  benches: [
    {
      id: "layers",
      label: "Layers",
      name: "Layer bench",
      kicker: "Group nine mechanisms into their layers, catch the series outside the typology, then read the fleet panel.",
      time: "~8 min",
      steps: [
        {
          type: "multi",
          brief: "A passage and nine mechanisms. Passage: “The cooperative layers put the verifier inside the fence: hardware attests, the cloud provider reports, people testify.” Six of the nine mechanisms below form two series from this passage’s typology. Three form a series the passage does not name — leave those alone for now.",
          q: "First series: mark exactly the three hardware-layer mechanisms.",
          need: 3,
          items: [
            {
              t: "Chip identity and hardware roots of trust",
              err: true,
              note: "Hardware — the layer’s most mature piece (solved, not unbreakable)."
            },
            {
              t: "Customer vetting (KYC) at account opening",
              err: false,
              note: "Cloud — the provider’s gate, not the silicon’s."
            },
            {
              t: "Overhead and thermal imagery of facilities",
              err: false,
              note: "Not in this series — hold that thought."
            },
            {
              t: "Compute metering on-die (proposed)",
              err: true,
              note: "Hardware — and still proposals, not deployed capability."
            },
            {
              t: "Procurement- and customs-trail analysis",
              err: false,
              note: "Not in this series either."
            },
            {
              t: "Chip registries and supply-chain tracking",
              err: true,
              note: "Hardware — the paper shadow that follows the physical chip."
            },
            {
              t: "Workload telemetry and job logging",
              err: false,
              note: "Cloud — what the provider sees over the customer’s shoulder."
            },
            {
              t: "Power-grid draw estimation",
              err: false,
              note: "Also not in this series. A pattern is forming."
            },
            {
              t: "Provider reporting duties to regulators",
              err: false,
              note: "Cloud — the institutional half of the provider layer."
            }
          ],
          whyAll: "One series down, one to go — and three mechanisms keep refusing to fit. The source format plants exactly this: series that belong to the text’s typology, plus one that does not."
        },
        {
          type: "multi",
          brief: "Six mechanisms remain from the nine.",
          q: "Second series: mark exactly the three cloud-layer mechanisms.",
          need: 3,
          items: [
            {
              t: "Customer vetting (KYC) at account opening",
              err: true,
              note: "Cloud — identity at the gate."
            },
            {
              t: "Workload telemetry and job logging",
              err: true,
              note: "Cloud — visibility during the run."
            },
            {
              t: "Overhead and thermal imagery of facilities",
              err: false,
              note: "Still not fitting. Third refusal."
            },
            {
              t: "Provider reporting duties to regulators",
              err: true,
              note: "Cloud — the reporting spine at three levels."
            },
            {
              t: "Procurement- and customs-trail analysis",
              err: false,
              note: "Not cloud — nobody asked the provider anything."
            },
            {
              t: "Power-grid draw estimation",
              err: false,
              note: "Not cloud either. The leftover trio is now complete."
            }
          ],
          whyAll: "Two clean series inside the passage’s typology. The leftover trio — imagery, procurement trails, grid draw — is not noise: it is a series with its own organizing principle."
        },
        {
          type: "pick",
          q: "The leftover trio — imagery, procurement trails, grid-draw estimation — forms a series. Which layer, and why does it sit outside the passage’s typology?",
          opts: [
            "Intelligence — the uninvited layer: it reads footprints without the monitored side’s cooperation, so it is not a “cooperative” mechanism at all",
            "Human — these are things inspectors do on site visits",
            "Hardware — sensing at a distance is still sensing the hardware",
            "They do not form a series; the grouping is arbitrary"
          ],
          right: 0,
          why: "The passage’s typology was “cooperative layers” — and the trio’s shared principle is exactly non-cooperation: nothing is asked of the monitored party. Knowing a taxonomy includes knowing its edges; the extra series is the intelligence layer’s whole territory."
        },
        {
          type: "pick",
          brief: "The fleet panel: five declared cloud campuses, year over year.",
          table: {
            cols: [
              "site",
              "declared workload change",
              "metered power change"
            ],
            rows: [
              [
                "A",
                "+20%",
                "+22%"
              ],
              [
                "B",
                "−5%",
                "−3%"
              ],
              [
                "C",
                "−30%",
                "+40%"
              ],
              [
                "D",
                "+12%",
                "+15%"
              ],
              [
                "E",
                "0%",
                "+2%"
              ]
            ]
          },
          q: "One site’s self-reports and physics diverge. Which site, and what is the leading hypothesis?",
          opts: [
            "Site C — declared activity fell while draw surged: undeclared expansion; escalate for corroboration",
            "Site C — a hot summer explains the extra cooling load",
            "Site B — declining sites are the suspicious ones",
            "Site A — growth that fast is inherently suspect"
          ],
          right: 0,
          why: "Read the panel the way the source task reads its charts: four sites move together (declarations tracking watts within a few points), one breaks the pattern by 70 points in the wrong direction. Weather does not produce that gap in year-normalized data, and growth with matching declarations (site A) is exactly what honesty looks like. Divergence, not level, is the tripwire."
        },
        {
          type: "pick",
          brief: "Fleet-wide paradox: accelerator efficiency (FLOP/s per watt) improved ~1.6× this year — yet total fleet power draw ROSE 25%. A commentator concludes the efficiency figures must be fraudulent.",
          q: "Is the inference sound?",
          opts: [
            "Yes — more efficiency must mean less power",
            "No — power tracks capacity decisions: cheaper compute per FLOP raises demand for FLOP, so draw rises while efficiency genuinely improves",
            "No — metered power figures are unreliable anyway"
          ],
          right: 1,
          why: "The commentator assumed fixed demand — the one assumption the AI buildout most visibly violates. Efficiency reduces power only if you hold computation constant; nobody is. For a verifier the corollary is sharper: efficiency gains mean a fixed power reading bounds MORE compute every year — the conversion factor is a moving part, not a constant."
        },
        {
          type: "number",
          brief: "Compound it, the way the source task chains its index: a verifier estimated Site B’s compute ceiling from its power draw in 2026. Accelerator efficiency improves ~1.6× per year and the estimate is never updated.",
          q: "By 2029 — same watts — how many times more compute can that power support? Enter the factor.",
          min: 3.4,
          max: 4.8,
          unit: "× stale factor",
          reveal: "1.6 × 1.6 × 1.6 ≈ 4.1. Three years of compounding quadruples what the same substation can feed — the same arithmetic as chaining annual inflation rates into a price level, and the reason power-based ceilings carry a decay clock."
        }
      ]
    },
    {
      id: "hardware",
      label: "Hardware",
      name: "Hardware bench",
      kicker: "Audit a too-confident proposal for every error, then earn the threshold arithmetic.",
      time: "~6 min",
      steps: [
        {
          type: "multi",
          brief: "A ministry circulates a hardware-verification proposal. Six of its claims, verbatim:",
          q: "Mark every claim that is wrong as stated. Part marks for the reasons, not the count.",
          need: "errors",
          items: [
            {
              t: "“Every modern accelerator ships with a hardware root of trust, so chip identity is a solved problem.”",
              err: false,
              note: "Stands — with the module’s asterisk: solved, not unbreakable. Identity is genuinely the most mature piece of the stack."
            },
            {
              t: "“Secure boot was designed to stop exactly our adversary: the chip’s owner.”",
              err: true,
              note: "The threat-model inversion, named. Secure boot defends a cooperative owner against outside attackers; governance flips it — the owner with physical possession and unlimited time IS the party you are trying to catch."
            },
            {
              t: "“Inspectors will read each chip’s tamper-resistant total-FLOP meter at quarterly visits.”",
              err: true,
              note: "No production chip meters compute tamper-resistantly today. Metering is a proposal in the literature, not a deployed capability — a regime drafted on it is drafted on futureware."
            },
            {
              t: "“Proof-of-learning will automatically validate every declared training run.”",
              err: true,
              note: "Proof-of-learning is fragile and has been spoofed in the literature. Probabilistic recomputation by a verification cluster is the honest cousin — expensive, partial, not automatic."
            },
            {
              t: "“A licensing regime makes hardware smuggling impossible.”",
              err: true,
              note: "“Impossible” is the tell. Licensing and registries raise cost and create paper trails; the smuggling that remains is the evasion taxonomy’s bucket 2, not a solved problem."
            },
            {
              t: "“FLOP and FLOP/s are different quantities; capping one is not capping the other.”",
              err: false,
              note: "Stands — and it is the proposal’s one moment of precision. Hold onto it for the next three steps."
            }
          ],
          whyAll: "Four of six claims fail the same way: each promotes a real mechanism into a guarantee. The module’s cost mindset — what it serves, feasibility today, what can be faked — is exactly the error-detector you just ran."
        },
        {
          type: "pick",
          brief: "Given: one current accelerator delivers ~2×10¹⁵ FLOP/s. A covert cluster has 10,000 of them.",
          q: "Peak throughput of the cluster?",
          opts: [
            "~2×10¹⁷ FLOP/s",
            "~2×10¹⁹ FLOP/s",
            "~2×10²¹ FLOP/s"
          ],
          right: 1,
          why: "10⁴ chips × 2×10¹⁵ FLOP/s = 2×10¹⁹ FLOP/s peak. Exponent bookkeeping is the entire skill — and the reason FLOP-threshold clauses are checkable by anyone who can add small integers."
        },
        {
          type: "pick",
          brief: "Real runs do not hit peak: assume ~40% sustained utilization, so ~8×10¹⁸ FLOP/s effective.",
          q: "How long until this cluster crosses the EU AI Act reference line — 10²⁵ total FLOP?",
          opts: [
            "~3 hours",
            "~2 weeks",
            "~4 years"
          ],
          right: 1,
          why: "10²⁵ ÷ 8×10¹⁸ ≈ 1.25×10⁶ seconds ≈ 14.5 days. A two-week detection window against a 10k-chip cluster — that is the operational meaning of a stock threshold: the odometer rolls over fast when the speedometer is high."
        },
        {
          type: "number",
          brief: "No options this time — the source round scores the computed value. Same cluster, ~8×10¹⁸ FLOP/s effective; a day is 86,400 seconds.",
          q: "How many days until the cluster crosses the rescinded EO 14110 line, 10²⁶ FLOP? Enter the number of days.",
          min: 120,
          max: 170,
          unit: "days",
          reveal: "10²⁶ ÷ 8×10¹⁸ = 1.25×10⁷ seconds ≈ 145 days. One more order of magnitude = 10× the wall-clock. Two levers move this number: fleet size (double the chips, halve the time — thresholds bind fleets, not chips) and the efficiency clock (~1.6×/yr improvement shortens every answer on this bench, every year)."
        }
      ]
    },
    {
      id: "cloud",
      label: "Cloud",
      name: "Cloud bench",
      kicker: "A dispute where both sides are partly right, a three-reads-in-one passage, then the fakeability sort.",
      time: "~7 min",
      steps: [
        {
          type: "pick",
          brief: "The dispute: the Compliance Office moves against Northgrid Cloud. The record — Northgrid ran KYC at onboarding and delivered quarterly logs; the account was opened through a chain of three resellers; the customer declared “climate modeling”; job telemetry shows months of sustained all-to-all interconnect traffic, the signature of large training. Rule of the bench: neither side is right about everything.",
          q: "Northgrid: “We performed KYC at onboarding, so our customer-identity obligation is met.” Who is right on this point?",
          opts: [
            "Northgrid — KYC was performed, the obligation is discharged",
            "The Office — KYC on a reseller front identifies the intermediary, not the user",
            "Both fully — the claims do not conflict"
          ],
          right: 1,
          why: "The Office, on this point. A three-link reseller chain is the canonical KYC gap: each link knows only its neighbor, so onboarding-time checks name the front, not the customer. Identity is on the module’s fakeable list precisely because layering intermediaries fakes it cheaply."
        },
        {
          type: "pick",
          brief: "Same record.",
          q: "Northgrid: “Logs were delivered on schedule, so our workload-reporting obligation is satisfied.” Who is right?",
          opts: [
            "Northgrid — delivery is the obligation",
            "The Office — delivered logs that contradict telemetry are the failure mode, not compliance",
            "Neither — logs are irrelevant to verification"
          ],
          right: 1,
          why: "The Office again — “self-reporting alone is a paperwork regime” is this module’s central warning. Logs are self-produced artifacts (fakeable); interconnect use is physics-adjacent (hard to fake). When the two disagree, the regime’s job is to notice, not to file."
        },
        {
          type: "pick",
          brief: "Same record.",
          q: "The Office: “The interconnect pattern proves an undeclared frontier training run.” Who is right?",
          opts: [
            "The Office — hard-to-fake evidence is proof",
            "Northgrid, partly — the pattern warrants escalation, not a verdict; other workloads produce it too",
            "Northgrid fully — telemetry can be discarded"
          ],
          right: 1,
          why: "Northgrid gets a point back — this is the dispute’s honest split. Hard-to-fake is not the same as unambiguous: HPC simulation and large-scale inference can produce training-shaped traffic. The pattern justifies the next rung (declarations cross-check, on-site audit), never the verdict itself. Both sides leave the bench partly right — as in the source record."
        },
        {
          type: "pick",
          brief: "A passage from the module’s closing argument: “A regime that files reports is not yet a regime that verifies. The declarations column is a courtesy the honest extend to us; the physics column is the only one the dishonest cannot edit. Build the escalation ladder on watts and traffic, and let the paperwork corroborate — never carry.”",
          q: "Three reads in one: what does the author critique, what do they advocate, and where is the principled line?",
          opts: [
            "Critiques declaration-led oversight; advocates physics-anchored escalation; the line is who can edit the evidence — the monitored party rewrites paperwork, not watts",
            "Critiques the cloud layer entirely; advocates abolishing declarations — paperwork has no role",
            "Critiques intrusive monitoring; advocates trusting established providers",
            "Critiques physics-based signals as too coarse; advocates richer self-reporting"
          ],
          right: 0,
          // The reveal opens on "the second option is the planted over-reading".
          fixedOrder: true,
          why: "The second option is the planted over-reading — “corroborate, never carry” assigns paperwork a real role, so “abolish” misstates the author; the source round docks exactly that. Critique pole, advocacy pole, and the distinction that separates them: a text is not read until you can state all three without importing your own position."
        },
        {
          type: "multi",
          brief: "The module’s two lists, shuffled — seven things a cloud provider or its customer presents to a verifier.",
          q: "Mark the ones an evader can cheaply fake.",
          need: "errors",
          items: [
            {
              t: "Customer identity documents",
              err: true,
              note: "Fakeable — shells, fronts, reseller chains; the dispute you just judged."
            },
            {
              t: "Declared workload purpose",
              err: true,
              note: "Fakeable — a text field, checked (if ever) at onboarding."
            },
            {
              t: "Workload labels in job metadata",
              err: true,
              note: "Fakeable — the training-disguised-as-inference move, the evasion taxonomy’s bucket 5."
            },
            {
              t: "Provider-produced usage logs",
              err: true,
              note: "Fakeable — self-reported artifacts; falsified logs are the evasion taxonomy’s bucket 6."
            },
            {
              t: "Facility power draw",
              err: false,
              note: "Hard to fake — watts are physics; hiding them means hiding generation, itself observable."
            },
            {
              t: "Interconnect utilization patterns",
              err: false,
              note: "Hard to fake at scale — the traffic shape of distributed training is expensive to disguise."
            },
            {
              t: "Satellite-visible construction and cooling buildout",
              err: false,
              note: "Hard to fake — overhead imagery does not take the customer’s word for anything."
            }
          ],
          whyAll: "The split is the module in one line: everything declared can be faked; everything physical resists. Regimes that lean on declarations alone inherit the left column."
        }
      ]
    },
    {
      id: "secrets-and-people",
      label: "Secrets",
      name: "Secrets & people bench",
      kicker: "What the crypto actually promises, and what only humans can testify to.",
      time: "~6 min",
      steps: [
        {
          type: "pick",
          statement: "A zero-knowledge proof convinces a verifier that a claim is true while revealing nothing beyond the truth of the claim.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 0,
          why: "True — and that “nothing beyond” is why 2.0 exists: it is the exact shape of the confidentiality-vs-verifiability dilemma, resolved in principle. The catch is scope: you still have to bind the proof to the real system it speaks for, which is where hardware identity re-enters."
        },
        {
          type: "pick",
          statement: "CWC managed access is a cryptographic protocol for inspecting chemical plants.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 1,
          why: "False — managed access is institutional, not cryptographic: negotiated inspection scope, shrouding of non-covered equipment, escorted access. It is the module’s historical proof that when the cryptographic solution does not exist yet, a procedural one can carry the load — imperfectly, but for decades."
        },
        {
          type: "pick",
          statement: "TEE attestation remains a strong guarantee even when the adversary owns the hardware and has unlimited physical access.",
          q: "True or false?",
          opts: [
            "True",
            "False"
          ],
          right: 1,
          why: "False — physical possession is the hard case: TEEs were designed against remote and software adversaries, and published attacks with physical access have repeatedly broken them. Same inversion as secure boot on the hardware bench: governance makes the owner the adversary, and the guarantees were not priced for that."
        },
        {
          type: "pick",
          brief: "A course passage: “Hardware tells you what ran; power tells you how much; imagery tells you where. None of them tells you what leadership believed, which warnings were suppressed, which corners were cut knowingly.”",
          q: "What is the principled distinction this passage draws for the human layer?",
          opts: [
            "Humans are cheaper sensors than satellites",
            "Human evidence covers mental states — belief, warning, intent — which physical sensors cannot record",
            "Human evidence is more reliable than telemetry",
            "The human layer replaces the other three at lower cost"
          ],
          right: 1,
          why: "The distinction is *kind*, not degree: sensors record footprints, humans testify to states of mind. Intent and knowledge decide whether a violation was policy or accident — and enforcement responses differ accordingly. Nothing about reliability follows; insider evidence still needs corroboration like everything else."
        },
        {
          type: "multi",
          brief: "Four claims about making the human layer work at frontier labs.",
          q: "Mark the false ones.",
          need: "errors",
          items: [
            {
              t: "Insider evidence reaches verifiers only where reporting channels exist, retaliation is credibly punished, and the receiving institution is independent.",
              err: false,
              note: "Sound — the module’s three conditions, and each is load-bearing."
            },
            {
              t: "Equity compensation strengthens the human layer: insiders with stock have more to lose from company wrongdoing.",
              err: true,
              note: "Backwards. Equity ties the insider’s wealth to the company’s valuation — the thing a disclosure damages. It raises the personal price of speaking, which is why the module lists it beside NDAs as frontier-specific friction."
            },
            {
              t: "NDAs are irrelevant to treaty verification, since international obligations override private contracts.",
              err: true,
              note: "Legally cute, practically false: the chilling effect operates before any court would. A channel that does not shield reporters from private legal retaliation will simply not be used."
            },
            {
              t: "Humans can reveal what hardware, cloud, and intelligence layers cannot: what the company believed and suppressed.",
              err: false,
              note: "Sound — the layer’s unique contribution, as in the previous step."
            }
          ],
          whyAll: "The two false claims share a failure: reasoning from formal position (shareholder alignment, legal hierarchy) instead of from the incentives a real person faces on the day they decide whether to report."
        }
      ]
    }
  ]
};
