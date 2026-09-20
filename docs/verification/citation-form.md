# How a source is cited in a lesson

One rule, and it is about the link: **the link opens from the work's own
title.** Never from an author–date bracket, never from a bare locator, never
from a label like "Source:" or the publisher's name.

Two placements follow from where the citation sits:

- **A citation that ends a passage rides on its own `<Src>` line** under it:
  `<Src>Author, [*Title*](url), publisher, year.</Src>`. The reader meets the
  claim, then the source, and the two cannot be read apart.
- **A citation inside a sentence stays inside it**, with the title as the
  linked phrase and the locator or year as plain text: "…as Shavit sets out in
  [*What Does It Take to Catch a Chinchilla?*](url), §6."

Both produce the same thing downstream: every `href` in a lesson is collected
into that lesson's **Works cited** appendix automatically, so a correctly
placed link is also a correctly registered source. There is no separate
footnote mechanism to keep in step.

**What this replaces.** An author–date bracket carrying the link —
`([Krawec, 2026](url))` — reads as a footnote marker, hides the work behind a
surname, and makes the same source look like two different things in two
lessons. Those are gone from the course's own prose.

**Two things this rule does not touch:**

- **Reproduced text.** Anything inside `<SourceQuote>` is somebody else's
  published prose. The Sastry passage in 2.1 carries a dozen author–date
  parentheticals of its own — "(Pilz & Heim, 2023)", "(OECD, 2022)" — and they
  stay exactly as the authors wrote them. A sweep that rewrites them is a
  sweep that falsifies a quotation.
- **A source with no link.** If no URL is known for a work, the citation is
  left as it stands and reported, rather than given a link that was guessed.
  `(The Substrate, 2026)` in 2.3's finance lesson is the open case.
