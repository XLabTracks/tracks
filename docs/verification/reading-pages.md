# Reading-page architecture

Verification lessons and embedded papers use editorial page boundaries. The
site does not infer pages from heading depth, character count, or viewport
height.

## Evidence behind the rule

- Brysbaert's meta-analysis of 190 studies estimates average adult silent
  nonfiction reading in English at 238 words per minute, with most adults in
  a broad 175–300 wpm range. Second-language reading is generally slower:
  <https://biblio.ugent.be/publication/8647789>
- Rey et al.'s meta-analysis of 56 investigations finds that meaningful,
  coherent, learner-paced segmentation improves retention and transfer and
  reduces cognitive load. It also increases learning time:
  <https://eric.ed.gov/?id=EJ1217373>
- W3C's cognitive-accessibility guidance recommends short blocks, one topic
  per paragraph, purpose stated early, and descriptive headings:
  <https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p05-succinct-text/>
- A 2026 network meta-analysis found a screen disadvantage concentrated in
  scrolling conditions; studies without scrolling did not show a reliable
  paper–screen difference. It also summarizes earlier evidence that the
  disadvantage is more likely in texts above 1,000 words:
  <https://link.springer.com/article/10.1007/s10639-025-13843-8>
- Haverkamp et al. found paging supported a more integrated understanding and
  more strategic backtracking than scrolling among university students,
  while cautioning that the observed effect was modest:
  <https://link.springer.com/article/10.1007/s11145-022-10328-9>

These findings do not establish a universal page length. They support
learner-controlled pages that preserve coherent meaning, with length used as
an editorial warning rather than a cutting algorithm.

## Editorial rule

One page should contain one complete learner action: understand one claim,
read one evidence packet, compare one set of alternatives, or complete one
exercise.

Keep together:

- a question and the evidence needed to answer it;
- an explanation and its immediate check;
- an exercise's instructions, materials, and response surface;
- a source passage whose argument would be distorted by an arbitrary cut.

Start a new page before:

- a genuinely new question or analytical operation;
- a new source packet that the learner must read independently;
- a substantial exercise after its preparatory explanation;
- a new stage in a multi-stage workshop task.

As a review flag, ordinary dense-prose pages should usually take about 4–8
minutes. For this technical, international audience, estimate conservatively
at 175–200 wpm: roughly 700–1,400 words. Shorter pages are legitimate when a
widget carries the work. Longer pages are legitimate when preserving an
intact source section or legal provision matters more than the target range.

Do not force every viewport to contain a whole page. Screen height varies,
text can be enlarged, and accessibility settings must reflow rather than
shrink content. The aim is a manageable conceptual page, not a slide.

## Authoring lessons

Place an explicit marker where the next page begins:

```mdx
<PageBreak title="Question the source" />

## Question the source
```

The title labels the destination in the pager. Headings continue to express
document hierarchy and populate navigation; they do not create pages. A
lesson without a `PageBreak` renders as one continuous page.

The reader hides pages rather than unmounting them, so unfinished interactive
work remains in memory while the learner moves between pages. The whole-
lesson mode restores find-in-page and printing across the complete lesson.

## Authoring embedded papers

For a paper that should be paged, add `pageSectionIds` to its entry in
`src/content/papers.data.ts`. Each value must be a stable section id from the
committed artifact's table of contents, in source order. The content-integrity
test rejects missing, duplicate, or reordered ids. Papers without an authored
list render continuously.

Prefer the source author's sections. Do not invent mid-paragraph cuts merely
to meet a word target. For a very long treaty article or paper section, add a
finer boundary only when the source itself supplies a meaningful subsection.

## Verification-course audit decisions

- Modules 0 and 1 use pages for distinct conceptual questions, document
  packets, policy alternatives, and workshop stages.
- Module 2 keeps short hardware and intelligence lessons continuous. The
  longer cloud and human-layer lessons split at changes from reading to
  comparison or exercise, not at every heading.
- Module 3's overview separates the assigned external reading from the
  questions that follow it; its short technical lessons remain continuous.
- Module 4 pages the feasibility workshop by analytical operation. The
  research-tips reference and the one-decision capstone sign-up remain
  continuous.
- The long Scher treaty paper uses authored source-section boundaries. Complete
  articles stay intact even when they exceed the ordinary prose target.
