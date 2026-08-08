/**
 * Drill Bench: Evasion & Regime Design — the cross-module drill deck ported from the standalone
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

export const DRILLS_GAMES: DrillDeck = {
  id: "drills-games",
  title: "Drill Bench: Evasion & Regime Design",
  blurb: "Three benches on the adversarial end: classify four evasion schemes and survive the statistics trap, take a skeptical memo apart claim by claim, then run the critique taxonomy and the prognostic analysis a manifesto skipped.",
  benches: [
    {
      id: "evasion",
      label: "Evasion",
      name: "Evasion bench",
      kicker: "Classify four schemes against the taxonomy, then survive the statistics trap.",
      time: "~7 min",
      steps: [
        {
          type: "pick",
          statement: "A lab’s declared inference cluster shows training-shaped utilization: sustained all-to-all traffic in long nightly blocks, checkpoint-sized storage writes every few hours.",
          q: "Which of the eight evasion buckets is this?",
          opts: [
            "Proxy organizations",
            "Smuggled hardware",
            "Threshold gaming",
            "Repurposed infrastructure",
            "Distributed training"
          ],
          right: 3,
          why: "Bucket 5, repurposed infrastructure — training disguised as inference on legitimately held compute. Detectability is its weak flank: workload labels are cheap to fake, but utilization shape is not, which is why the cloud layer’s telemetry is the natural tripwire here."
        },
        {
          type: "pick",
          statement: "A subsidiary registered in a non-party state buys five thousand accelerators; its parent company is a treaty-bound lab. The chips never appear in the parent’s declarations.",
          q: "Which bucket?",
          opts: [
            "Proxy organizations",
            "Weight exfiltration",
            "False reporting",
            "Tampering with verification mechanisms",
            "Threshold gaming"
          ],
          right: 0,
          why: "Bucket 1, proxy organizations — the Meridian pattern from the actor bench, now as a scheme: legal separation used to break the paper trail between buyer and beneficiary. The counter lives at the chokepoint (chip registries follow the silicon, not the org chart) plus beneficial-ownership analysis."
        },
        {
          type: "pick",
          statement: "Three sites in three jurisdictions each run training just below the notification threshold; the checkpoints are periodically merged.",
          q: "Which bucket?",
          opts: [
            "Smuggled hardware",
            "Distributed training",
            "Repurposed infrastructure",
            "False reporting",
            "Proxy organizations"
          ],
          right: 1,
          why: "Bucket 8, distributed training — sub-threshold fragmentation. It attacks the *aggregation rule*, not the sensor: each site is individually legal. Which is the lesson — thresholds need language about combined runs and affiliated entities, or arithmetic becomes a loophole."
        },
        {
          type: "pick",
          statement: "Extracted attestation keys are used to replay valid-looking quotes from a cluster whose actual firmware was replaced months ago.",
          q: "Which bucket?",
          opts: [
            "Tampering with verification mechanisms",
            "Weight exfiltration",
            "Threshold gaming",
            "False reporting",
            "Smuggled hardware"
          ],
          right: 0,
          why: "Bucket 7, tampering — the scheme aimed at the regime’s own instruments rather than at the underlying rule. Nastiest property: it converts a verification signal from evidence into disinformation, which is why key compromise procedures and cross-layer corroboration are regime-design requirements, not nice-to-haves."
        },
        {
          type: "pick",
          brief: "Case: the treaty’s first monitoring year ends. Confirmed-violation findings are triple the pre-treaty estimate of covert activity. A columnist: “the treaty tripled cheating.” A minister proposes scrapping it.",
          q: "Did covert activity necessarily increase?",
          opts: [
            "Yes — findings tripled",
            "No — the instrument changed; found violations and existing violations are different quantities",
            "Cannot say anything from these numbers"
          ],
          right: 1,
          why: "No — before the treaty there was no monitoring, so the baseline “estimate” counted a fraction of an invisible total. Findings measure detection × incidence; the treaty changed the first factor massively. (Answer C overcorrects: the numbers do say something — they bound detection performance.)"
        },
        {
          type: "pick",
          brief: "The classic case, one century older: when steel helmets replaced cloth caps in the First World War, field hospitals recorded MORE head wounds — because soldiers who previously died were now surviving into the statistics.",
          q: "Name the shared error.",
          opts: [
            "Base-rate neglect",
            "A selection effect: the observation instrument changed, so the observed sample changed",
            "Sunk-cost reasoning",
            "Circular reasoning"
          ],
          right: 1,
          why: "Both stories move cases across a visibility boundary — dead→wounded, invisible→detected — and both invite blaming the instrument for what it newly reveals. Verification regimes face this politically every year one: rising findings will be spun as regime failure when they are the regime working. Brief accordingly."
        }
      ]
    },
    {
      id: "regime",
      label: "Regime",
      name: "Regime bench",
      kicker: "Extract what the memo actually claims, sort strong from weak, counter both kinds, price the stack.",
      time: "~10 min",
      steps: [
        {
          type: "multi",
          brief: "MEMORANDUM — from the Deputy Minister for Strategy, re: the proposed verification regime. “(1) Every verification mechanism on offer can be defeated by a resourced adversary: attestation falls to physical access, proof-of-learning has been spoofed, customer vetting dissolves in reseller chains. (2) It follows that a regime stacked from such layers can be defeated too. (3) The BWC episode settles the politics: states will not accept intrusive verification — that protocol died, and so will this one. (4) And pause-grade inspection collides with legitimate secrecy: classified workloads, trade secrets, national-security systems. (5) Strategy should therefore preserve freedom of action and fund national capability instead.”",
          q: "Before judging a text, establish what it says. Mark every statement the memo actually asserts.",
          need: "errors",
          items: [
            {
              t: "Individual verification mechanisms can each be defeated by a resourced adversary.",
              err: true,
              note: "Asserted — sentence (1), with three supporting examples."
            },
            {
              t: "A regime layered from defeatable mechanisms is itself defeatable.",
              err: true,
              note: "Asserted — sentence (2), flagged by its own “it follows”."
            },
            {
              t: "Independent layers multiply detection probability.",
              err: false,
              note: "The memo asserts the OPPOSITE. Marking this means reading your rebuttal into the author’s mouth — the extraction error the source round punishes hardest."
            },
            {
              t: "States will not accept intrusive verification; the BWC proves it.",
              err: true,
              note: "Asserted — sentence (3)."
            },
            {
              t: "Verification technology will mature substantially within a decade.",
              err: false,
              note: "Never addressed — plausible-sounding and absent, the classic planted distractor."
            },
            {
              t: "Pause-grade inspection conflicts with legitimate secrecy.",
              err: true,
              note: "Asserted — sentence (4)."
            },
            {
              t: "The ministry should preserve freedom of action and fund national capability.",
              err: true,
              note: "Asserted — sentence (5), the memo’s recommendation."
            }
          ],
          whyAll: "Extraction precedes evaluation: you cannot sort strong from weak until the claim list is the author’s and not yours. Five claims in, two phantoms out — now the sorting can start."
        },
        {
          type: "pick",
          brief: "Sorting rule from the source pedagogy: strong arguments get engaged on the merits; weak ones get their flaw named. Both earn marks — mislabeling earns none.",
          statement: "Memo sentence (1): “Every verification mechanism on offer can be defeated by a resourced adversary.”",
          q: "Strong or weak?",
          opts: [
            "Strong — engage it",
            "Weak — name the flaw"
          ],
          right: 0,
          why: "Strong — the course itself teaches it: attestation breaks under physical access, PoL was spoofed, KYC dissolves in reseller chains. Concede the premise honestly; the regime’s answer is layering, never mechanism-perfection. Steelmanning the opponent’s true premises is what makes the eventual rebuttal land."
        },
        {
          type: "pick",
          statement: "Memo sentence (2): “It follows that a regime stacked from such layers can be defeated too.”",
          q: "Strong or weak?",
          opts: [
            "Strong — engage it",
            "Weak — name the flaw"
          ],
          right: 1,
          why: "Weak — a composition fallacy: what is true of each layer separately is not true of the stack, *provided the layers fail independently*. Note the memo’s own tell — “it follows” marks the exact joint where the inference breaks. You will price this fallacy in numbers two steps from now."
        },
        {
          type: "pick",
          statement: "Memo sentence (3): “The BWC episode settles the politics: states will not accept intrusive verification.”",
          q: "Strong or weak?",
          opts: [
            "Strong — engage it",
            "Weak — name the flaw"
          ],
          right: 1,
          why: "Weak — generalizing from one failure while the counterexamples run seventy years: IAEA safeguards, CWC managed access, START inspections. The honest residue is real, though: the BWC case proves political acceptability is a design constraint, which is exactly how the spine teaches it."
        },
        {
          type: "pick",
          statement: "Memo sentence (4): “Pause-grade inspection collides with legitimate secrecy — classified workloads, trade secrets, national-security systems.”",
          q: "Strong or weak?",
          opts: [
            "Strong — engage it",
            "Weak — name the flaw"
          ],
          right: 0,
          why: "Strong — the secrets-and-people bench exists because this is true. The engagement: confidentiality-preserving verification (ZK proofs, attestation) where the technology exists, managed access where it does not yet. A reply that dismisses the secrecy concern loses the reader who most needs convincing."
        },
        {
          type: "pick",
          brief: "Counterargument discipline, part two of the source format: for each argument, formulate the counter that MEETS it — not the author, not the vibe.",
          q: "Which counterargument actually meets memo sentence (2) — the stack-fails-too inference?",
          opts: [
            "Three independent layers each missing 30% of the time jointly miss ~3% of the time — composition flips the odds, provided failures are independent",
            "The Deputy Minister has no technical background in verification",
            "Verification also builds trust between rivals, which has diplomatic value",
            "Some verification mechanisms are in fact unbreakable"
          ],
          right: 0,
          why: "Only the first meets the inference where it lives — and carries its own scope condition. The second attacks the author (the position bench dissects that move), the third changes the subject, and the fourth concedes the memo’s frame by defending a claim the course itself rejects."
        },
        {
          type: "pick",
          q: "Which counterargument actually meets memo sentence (3) — the BWC-settles-the-politics claim?",
          opts: [
            "One dead protocol against seventy years of operating regimes — safeguards, CWC, START — is a sample of one, not a law; what the BWC proves is that acceptability is a design constraint",
            "The BWC failure was two decades ago; the politics have changed since",
            "Biology and AI are different technologies, so the case is irrelevant",
            "States that reject verification are simply acting in bad faith"
          ],
          right: 0,
          why: "The first names the inferential flaw (overgeneralization) AND salvages the argument’s true residue — the strongest form of counterargument in the source rubric. The second asserts without showing, the third dodges the political claim it needs to answer, the fourth moralizes and concedes nothing."
        },
        {
          type: "pick",
          brief: "The source tables demand counterarguments in the STRONG rows too — countering an argument you concede is sound is its own skill: you bound its scope, you never deny it.",
          q: "Memo sentence (4) is strong — verification really does collide with legitimate secrecy. Which counter meets even a strong argument?",
          opts: [
            "Concede the collision, then bound it: confidentiality-preserving proofs where the technology exists, CWC-style managed access where it does not — the carve-out is a designed feature with seventy years of practice behind it",
            "Secrecy claims are usually pretexts for having something to hide",
            "Transparency simply matters more than secrecy",
            "Trade secrets have no protection in international law anyway"
          ],
          right: 0,
          why: "Concede-and-bound is the only move that survives contact with a true premise. The second option is the attribution reflex (the position bench dissects it), the third is a value assertion that persuades nobody who does not already agree, and the fourth is false — and silent about classified workloads, the collision’s hardest case."
        },
        {
          type: "number",
          brief: "Now price the composition fallacy — computed, not chosen. Assume three independent evidence streams — hardware, intelligence, human — each with a 70% chance of catching a given covert program.",
          q: "What percentage of covert programs evades all three? Enter the number.",
          min: 2,
          max: 3.5,
          unit: "%",
          reveal: "0.3 × 0.3 × 0.3 = 0.027 → 2.7%. Each mediocre layer alone misses one time in three; the stack misses one in thirty-seven. The proviso is load-bearing: layers sharing a blind spot (all fed by the same declarations, say) are one layer wearing three uniforms — independence is a design requirement, not a free assumption."
        }
      ]
    },
    {
      id: "position",
      label: "Position",
      name: "Position bench",
      kicker: "Critique vectors on a radical manifesto — all the rubric’s rows — then the prognostic analysis it never did, run on our own measure.",
      time: "~9 min",
      steps: [
        {
          type: "pick",
          brief: "Movement one — the critique taxonomy. The Zero Hour Manifesto demands an immediate, unconditional, permanent global shutdown of all AI development; its author is a 22-year-old movement founder. Four critique lines from the public debate follow. Classify each: does it attack the SPEAKER (personal traits, hidden interests) or the ARGUMENT (premises, program)? Both kinds appear in every real debate — only one kind carries evidential weight.",
          statement: "Critique line 1: “Twenty-two years old, never trained a model, never held a clearance — this is not someone who understands the systems she wants to shut down.”",
          q: "Speaker-directed or argument-directed?",
          opts: [
            "Speaker-directed — personal characteristics",
            "Argument-directed — premises or program"
          ],
          right: 0,
          why: "Speaker-directed: age and credentials — the source rubric’s first family (personal characteristics: age, education, temperament). Cataloguing it is worth marks; relying on it is not: a claim’s truth does not vary with its speaker’s CV, and the strongest version of her argument survives her entirely."
        },
        {
          type: "pick",
          statement: "Critique line 2: “Follow the money — the movement’s donors hold short positions against AI companies. The manifesto is a trading strategy wearing a safety costume.”",
          q: "Speaker-directed or argument-directed?",
          opts: [
            "Speaker-directed — attribution of hidden motives",
            "Argument-directed — premises or program"
          ],
          right: 0,
          why: "Speaker-directed, second family: attribution — the speaker as instrument of concealed interests, declared goals diverging from real ones. Rhetorically devastating, evidentially empty: motives predict WHY someone argues, never WHETHER the argument holds. Flag it, name it, and return to the claims."
        },
        {
          type: "pick",
          statement: "Critique line 3: “The manifesto treats catastrophe-absent-shutdown as certain. That axiom is contestable — and every demand downstream inherits its uncertainty.”",
          q: "Speaker-directed or argument-directed?",
          opts: [
            "Speaker-directed — attribution of hidden motives",
            "Argument-directed — a contestable axiomatic premise"
          ],
          right: 1,
          why: "Argument-directed: the axiom family — the source rubric’s “contestable foundational premises”. This is the critique that does real work: it locates the load-bearing assumption and prices everything built on it. Note it applies symmetrically — the foundations’ securitization case must survive the same probe."
        },
        {
          type: "pick",
          statement: "Critique line 4: “It demands the terminal measure immediately, offers no transition plan, and never once analyzes what its own success would cause.”",
          q: "Speaker-directed or argument-directed?",
          opts: [
            "Speaker-directed — personal characteristics",
            "Argument-directed — non-constructiveness and missing prognostic analysis"
          ],
          right: 1,
          why: "Argument-directed, and a double hit from the rubric: radicalism-without-program (all negation, no positive design) and absent prognostic analysis (no accounting of the measure’s own consequences). That second flaw is fixable — and movement two of this bench fixes it, on our own measure, so the critique cannot be returned to sender."
        },
        {
          type: "pick",
          statement: "Critique line 5: “Her diagnosis is real and grave — which is exactly why this unserious prescription wrongs it. The gravity of the problem does not transfer to the proposal.”",
          q: "Speaker-directed or argument-directed?",
          opts: [
            "Speaker-directed — it concedes her sincerity, so it must be about her",
            "Argument-directed — the importance-of-problem vs. adequacy-of-solution mismatch"
          ],
          right: 1,
          why: "Argument-directed — the source rubric’s subtlest row: a contradiction between the weight of the stated problem and the unsatisfactoriness of the proposed path. Conceding the diagnosis makes it MORE argument-directed, not less; nothing about the speaker is in play. (The rubric’s one remaining row — ideological capture — sits on the argument side too: it indicts the reasoning’s incentives, not the person’s character, though in street debate it constantly decays into attribution.)"
        },
        {
          type: "pick",
          brief: "Movement two — the prognostic analysis the manifesto skipped, run honestly on the course’s own measure: an immediate emergency pause on all training runs above 10²⁵ FLOP. Source-pedagogy rule: a measure is not analyzed until you have named consequences for it and against it, across domains.",
          statement: "Consequence card: “Compute-rich actors redirect spending into algorithmic efficiency, eroding what the FLOP threshold measures.”",
          q: "Does this cut for or against the measure as designed?",
          opts: [
            "For — it shows the threshold binding",
            "Against — threshold-gaming pressure the design must anticipate"
          ],
          right: 1,
          why: "Against, in the technical domain — the evasion taxonomy’s bucket 3 arriving on schedule. Not fatal: it argues for effective-compute indexing and periodic threshold review rather than for no pause. Naming a consequence against your own preferred measure is the discipline being drilled."
        },
        {
          type: "pick",
          statement: "Consequence card: “Verification infrastructure built for the pause — registries, telemetry, inspection corps — survives the pause and supports weaker regimes afterward.”",
          q: "For or against?",
          opts: [
            "For — durable institutional gains in the political domain",
            "Against — sunk costs in the economic domain"
          ],
          right: 0,
          why: "For, institutionally — the foundations’ design exception running forward: pause-grade machinery is reusable for caps, transparency, licensing. Regime design compounds; even a pause that lapses leaves the verification commons better than it found it."
        },
        {
          type: "pick",
          statement: "Consequence card: “States that could never train at 10²⁵ FLOP bear no direct cost, while capable states bear all of it — resentment and defection pressure concentrate among exactly the parties whose compliance matters.”",
          q: "For or against?",
          opts: [
            "For — the burden falls on those who created the risk",
            "Against — a political-economy strain concentrated where compliance is most needed"
          ],
          right: 1,
          why: "Against, in the political domain — asymmetric burden with compliance-weighted stakes. The two-level-game primer predicts where this bites: capable states’ domestic ratification. Mitigations (sunset clauses, shared monitoring budgets, technology-access provisions) belong in the capstone, not in denial."
        },
        {
          type: "text",
          q: "Last commit, source-pedagogy category “other consequences named”: state one consequence of the pause in a domain the cards did not cover — economic, humanitarian, epistemic, ecological, your call. One or two sentences, with its direction.",
          minLen: 60,
          reveal: "No key for this one — the rubric habit is the point: the consequence table has more rows than any card deck, and capstone graders (like the source round’s graders) award the rows you open yourself. Carry your answer into your own regime design."
        }
      ]
    }
  ]
};
