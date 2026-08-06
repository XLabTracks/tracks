# Module 3 — build log

Running log for the Verification track's module 3 (`v-covert`, "Covert
development"). Append; do not rewrite. Same contract as `module-2-log.md`.

---

## 2026-08-06 — 3.1.1 promoted to its own subsubmodule

Source: "WIP Verification Track Outline 11", tab "3.1.1 Evasion Scenario
Taxonomy".

The outline gives module 3 three submodules and two subsubmodules:

```
3.0 What is Covert Development?
3.1 How Could a Determined Actor Cheat?
    3.1.1 Evasion Scenario Taxonomy
3.2 Red-team/Blue-team Exercises
    3.2.1 Evasion Scenario Taxonomy Revisited
```

The graph had the three submodules and neither subsubmodule. Both existed, but
as headings inside their parents: the before-the-case taxonomy was a `##` inside
`covert-how-to-cheat.mdx`, and the post-case scored version is a `##` inside
`covert-red-blue.mdx`.

**Done:** `v-covert-taxonomy` (3.1.1) now exists, nested under 3.1 by
`sectionItemId`. The ten-route table was **moved** out of 3.1, not copied. A
second copy inside the same module is the duplication the Verification notes
say to reduce and never widen, so 3.1 keeps a one-line pointer to 3.1.1 and
3.2.1 instead of the table.

**Verified:** all four module 3 routes return 200 against a running server;
3.1.1's title de-duplicates correctly (0 repeats in the body); the sidebar
renders 3.1.1 nested under 3.1; `?u=3.1` still resolves to 3.1's own reading.
Generators clean, typecheck clean, 814 tests pass, 0 lint errors.

---

## Open items

1. **3.2.1 is still a heading inside 3.2** and owes the same promotion 3.1.1
   just got. Blocked only on the decision below about what 3.2 becomes.

2. **3.2's taxonomy table is missing three of the outline's ten routes.**
   `covert-red-blue.mdx` carries seven scored rows. Absent: *hide an undeclared
   cluster*, *attack or capture verification*, and *exploit thresholds or
   definitions*. The outline has all ten with full scores and annotations, so
   this is transcription owed, not a content decision.

3. **The MIRI packet for 3.2 is not built.** The outline's 3.2 tab carries a
   five-page adapted reading packet drawn from two MIRI Technical Governance
   Team publications (Scher et al., *An International Agreement to Prevent the
   Premature Creation of Artificial Superintelligence*, Articles IV to VII;
   Cankaya, *A System Overview for Near-Term, Low-Trust AI Compute
   Verification*, Sections 1 to 3), plus a ten-question expert review
   assignment. The packet self-describes as an instructional adaptation rather
   than a verbatim reproduction, so how it should be embedded is the author's
   call and is being held for an answer.

4. **Section A of the red-team/blue-team case is still unbuilt.** The author
   note at the top of `covert-red-blue.mdx` has said so since before this
   change; 3.0's worked example stands in for it.

---

## External links: not verified, and why

A link audit was attempted across all verification content and **could not be
completed in this environment**. The session's egress proxy returns
`403 Forbidden` on CONNECT for every host outside its allowlist, including
`arxiv.org`. `/root/.ccr/README.md` says to report blocked hosts rather than
route around them, so no link in this repo currently has a tested status.
Treat the rows below as the static findings only.

What static inspection did establish, no network required:

| Finding | Where |
| --- | --- |
| `ai-2040.com/supplements/verification-plan` written bare, so it renders as text and cannot be clicked | `intuitions.mdx` |
| `ai-2040.com/supplements/faq` written bare | `exercises.ts` |
| `ai-2027.com` written bare | `exercises.ts` |
| `https://airisk.mit.edu/+` has a trailing `+` | `capstone-feasibility.mdx` |
| Two Wikimedia `Special:FilePath` URLs truncated mid-filename with unbalanced parens | `what-do-they-say.ts` |
| Eight prototype hosts shipped in content, including `rainbow-puppy-79f680.netlify.app` | `facilitator-guide.ts`, `mechanism-effective.mdx`, `scoping-actors.mdx`, `scoping-upstream-downstream.mdx`, `capstone-feasibility.mdx`, `exercises.ts` |

Note that `https://ai-2040.com/?choices=plan-a-root#playbook-insider-pov` does
appear as a real anchor inside a committed Redwood Research artifact, so the
domain is referenced by a third party and was not invented here. Whether it
resolves is untested.

The full extraction is reproducible: 150 distinct URLs plus four bare-domain
references across `src/content/lessons/verification`,
`src/content/verification`, and `src/lib/verification`.

**Nothing above was fixed.** Link repairs are held pending a session with
outbound network, so that a corrected URL can be confirmed rather than guessed.
