# Module 2.1 verification log

Every factual claim added to 2.1's learner copy in the redesign pass, with its
source and status. `confirmed` means checked against the primary source named
in the row during this pass. `second-hand` means the primary source could not
be read here and the claim rests on a record made by someone who did read it,
named in the row. `unchecked` means neither, and no `unchecked` row may carry a
number into learner copy without a hedge in the prose beside it.

Rows are updated in place when a check completes. The log is the audit trail
and is not deleted.

## Post-January-2026 items (beyond the model's knowledge cutoff)

| Claim in copy | Where | Source | Status |
| --- | --- | --- | --- |
| Rahman and Tajdari, *Detecting Hidden ML Training With Zero-Overhead Telemetry*, arXiv 2606.19262, submitted 17 June 2026; authors Robi Rahman and Sabiha Tajdari | 2.1.4 | arXiv abstract page | confirmed 2026-09-10 |
| 98.2% binary accuracy across the corpus; 20 evasion strategy families; 9 GPU models; 4 architecture generations; 5 rounds of monitor-evader iteration | 2.1.4, monitor-evader widget | arXiv 2606.19262 abstract | confirmed 2026-09-10 |
| Round 1: utilization modulation, low-utilization training, temporal disruption; monitor retrains on adversarial examples; baseline 6–96%, hardened 100% seen / 59–100% unseen | monitor-evader widget | arXiv 2606.19262 full text | confirmed 2026-09-10 |
| Round 2: minimal-memory, interleaving, clock throttling, FFT and mining mimicry, stochastic, PID; monitor retrains; baseline 0–91%, hardened 100% seen / 80–100% unseen | monitor-evader widget | arXiv 2606.19262 full text | confirmed 2026-09-10 |
| Round 3: online learning and dilution at 2, 5, 10, 20x inference; monitor adds power-memory correlation and cumulative energy; baseline 52–60%, hardened 100% seen / 87–100% unseen | monitor-evader widget | arXiv 2606.19262 full text | confirmed 2026-09-10 |
| Round 4: min-memory composite, gradient-accumulation structuring, idle padding 0–95%, multi-GPU DDP variants; monitor adds pre-allocation memory-plateau features and multi-GPU traces; baseline 19–100% single-GPU and 72–100% multi-GPU, hardened 100% | monitor-evader widget | arXiv 2606.19262 full text | confirmed 2026-09-10 |
| Round 5: diluted full-model and LoRA fine-tuning with the classifier in hand; monitor widens its non-adversarial inference corpus; 43–87% on unseen white-box strategies; leave-one-out detection 42.6% for diluted LoRA and 87.4% for full-model | 2.1.4, monitor-evader widget | arXiv 2606.19262 full text | confirmed 2026-09-10 |
| Study limits: single-node up to 8 GPUs; NVIDIA cards released since 2020, no AMD, Huawei or TPU; framework-level PyTorch evasion only, no custom CUDA kernels; up to 70B training and 671B MoE inference | 2.1.4, monitor-evader widget | arXiv 2606.19262 full text | confirmed 2026-09-10 |
| The study assumes the adversary cannot tamper with NVML readings or performance counters or inject synthetic telemetry, and states those guarantees require a hardware-enabled mechanism for tamper-resistant telemetry and an authenticated channel | 2.1.4, monitor-evader widget | arXiv 2606.19262 full text | confirmed 2026-09-10 |
| Battering RAM: an active DDR4 interposer costing under $50, transparent at boot, redirects protected addresses afterwards; breaks Intel scalable SGX and defeats AMD SEV-SNP attestation on patched systems; requires brief one-time physical access; schematics open source | 2.1.2 | batteringram.eu, the authors' own site | confirmed 2026-09-10 |
| Battering RAM authorship and venue: De Meulemeester, Oswald, Verbauwhede, Van Bulck (KU Leuven, University of Birmingham); 47th IEEE Symposium on Security and Privacy, May 2026 | 2.1.2 | batteringram.eu | confirmed 2026-09-10 |
| Battering RAM was disclosed in September 2025 | not in copy | the module drafts | unchecked; the date was removed from the citation rather than shipped |
| Tinfoil, "How Tinfoil Proves Exactly What Model Is Running", 3 February 2026: attestation measures launch state, not runtime state; Modelwrap attests a Merkle root hash of the weights together with the mechanism that re-checks it on every read | 2.1.2 | the captured post in the playground references, read in full | confirmed 2026-09-10 |
| NVIDIA attestation claim names (`ueid`, `hwmodel`, `eat_nonce`, `measres`, `secboot`, `dbgstat`, VBIOS and driver versions, the signature-verified claims) and the Remote Attestation Service | 2.1.2 | NVIDIA *Attestation Quick Start Guide*, Hopper single-GPU example | confirmed 2026-09-10 |
| Blackwell multi-GPU attestation attests each GPU independently and does not attest topology or switches; Hopper Protected PCIe configurations can add switch checks | 2.1.2 | NVIDIA documentation, as cited on the page before this pass | carried forward, not re-checked this pass |
| Cankaya et al., *Fingerprinting All AI Cluster I/O Without Mutually Trusted Processors*, arXiv 2606.10724, June 2026 | 2.1.6, pointer only | cited on the page before this pass | carried forward; 2.1 now points at it rather than summarising it, and Module 3.0 owns the reading |
| GPU fingerprinting for location verification, arXiv 2605.01930 | not in copy | the module notes | unchecked; held out of learner copy pending a read of the paper |

## Sources at or before the cutoff, checked this pass

| Claim in copy | Where | Source | Status |
| --- | --- | --- | --- |
| *Near-Term Enforcement of AI Chip Export Controls Using a Firmware-Based Design for Offline Licensing*, arXiv 2404.18308, 28 April 2024, is by **James Petrie, sole author** | 2.1.5 | arXiv abstract page | corrected 2026-09-10: the redesign spec's works-cited list attributes it to "Kulp, Gabriel, et al.", which is a different work (RAND WR-A3056-1). The page's existing attribution to Petrie was right and stands |
| Petrie's design depends on firmware verification, rollback protection and secure non-volatile memory, which public documentation suggests the H100 has; physical attacks remain a concern without hardware changes | 2.1.5 | arXiv 2404.18308 abstract | confirmed 2026-09-10 |
| O'Gara, Kulp, Hodgkins, Petrie et al., *Hardware-Enabled Mechanisms for Verifying Responsible AI Development*, arXiv 2505.03742, 2025; the paper presents approaches under investigation rather than fielded capability | 2.1 head | arXiv abstract page | confirmed 2026-09-10. The abstract page rendered a submission date of 2 April 2025, which does not sit with a 2505 identifier; only the year is used in copy |
| *Creating the First Confidential GPUs*, Communications of the ACM, January 2024, by Dhanuskodi, Guha, Krishnan, Manjunatha, Nertney, O'Connor and Rogers; the H100's TEE is anchored in an on-die hardware root of trust and confidential-computing mode turns on hardware protections for code and data | 2.1.2 | ACM listing and quoted text; the article page itself returns 403 to this environment | confirmed for authorship, date and the two quoted mechanisms; the fuller account (secure and measured boot, the enclave session, only manufacturer-signed firmware in CC mode) is described in the reading card as what the article covers, not asserted as a finding |
| Aarne, Fist and Withers, *Secure, Governable Chips*, CNAS, January 2024 | 2.1.2 | CNAS listing | confirmed 2026-09-10 |
| Harack, Trager, Reuel et al., *Verification for International AI Governance*, Oxford Martin AI Governance Initiative, July 2025 | 2.1.1 | the publisher's listing | confirmed 2026-09-10 |
| Abbaszadeh, Pappas, Katz and Papadopoulos, *Zero-Knowledge Proofs of Training for Deep Neural Networks*, 2024: 15 minutes of prover time per iteration, VGG-11, 10 million parameters | 2.1.7, 2.1.8 | ePrint 2024/162 | confirmed 2026-09-10 |
| Schnabl, Hugenroth, Marino and Beresford, *Attestable Audits*, arXiv 2506.23706, 2025: a prototype run against Llama-3.1 | 2.1.7 | arXiv abstract page | confirmed 2026-09-10 |
| Attested evaluation in a TEE costs roughly 21.7x, or about 100x slower, than the same work on a GPU | not in copy | the module notes | unchecked: the figures are not in the paper's abstract and the full text was not read here. The numbers were removed from learner copy and the claim reduced to "a prototype rather than a costed production path" |
| Proof-of-learning's anti-spoofing guarantee is currently broken in the general case | 2.1.7, 2.1.8 | Fang et al., arXiv 2208.03567, already cited on 2.1.7 before this pass | carried forward, not re-checked this pass |

## The treaty text

| Claim in copy | Where | Source | Status |
| --- | --- | --- | --- |
| FLI *Draft Articles* define Advanced AI as AI systems posing systemic or global catastrophic risks; the operative gate is an annexed list of uses, risks and capabilities with the Agency judging sufficiency; no FLOP or compute threshold appears in the document | 2.1.8, chain-builder widget | the PDF in the playground references | second-hand: confirmed by the course owner's own full-text extraction recorded in `verification-module-2-1-notes.md` (2026-07-20). Not re-extracted in this pass. The file's text layer is font-subsetted and did not extract in this environment, the publisher URL in the notes returns 404, and no PDF tooling was available here |
| Annex C authorises chips by clock cycles: on a verified violation the next authorization is withheld, and at the start of the next clock cycle the chips detect the absence of authorization and refuse to complete any computation, inside a tamper-proof enclosure with a guarantee processor | 2.1.5, 2.1.8, chain-builder widget | the PDF in the playground references | second-hand, same extraction and same limits as the row above |

## Constructed artifacts

The registry extract on 2.1.3, the utilization series on 2.1.4 and the license
token on 2.1.5 are constructed for the exercises and each says so on the page.
Their shapes are taken from the mechanisms cited beside them; none of the
numbers is an observation of a real site. The attestation result on 2.1.2 is
not constructed: its field names are NVIDIA's own, from the documentation
example cited there.

## Still owed

- The 21.7x / 100x TEE cost figures: read the Attestable Audits paper and
  either restore them with a citation or leave the qualitative claim standing.
- GPU fingerprinting (2605.01930): read before it is offered as extension
  reading on 2.1.3.
- The FLI rows: re-extract from the PDF with working tooling, or have the
  owner confirm the two rows again, so they can move from second-hand to
  confirmed.
- Epoch's compute-smuggling estimate: named in the module notes, not used in
  2.1 copy, and belonging to 3.1 in any case.
