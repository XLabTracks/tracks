# Report a bug from a selection

Selecting text anywhere in the course reading offers a fourth action beside
Highlight, Define and Add to notebook: **Report a bug**. It opens a dialog on
the page — the passage, a comment, an email and a screenshot — and posts to
the Google Form without the reader leaving the lesson. When the form refuses
an anonymous post it says so and offers the real form with the passage and
page carried over, so no report is lost.

The form is live and wired:
<https://forms.gle/cHcPDncBBB6tjZQx7>. What follows is how it was set up and
what to redo if its questions ever change.

It fails closed rather than half-wired: `isBugReportConfigured()` is false
while the config is blank, and the action simply does not render.

## The form as it stands

| Question | Type | Field | Filled by |
|---|---|---|---|
| Selected text | Paragraph | `entry.805073738` | the page |
| Page | Short answer | `entry.568752826` | the page |
| Link | Short answer | `entry.1180304402` | the page |
| Comment | Paragraph | `entry.692528752` | the reporter |

None is required, which is right: a required question that arrives prefilled
is fine until a prefill fails, and then the reporter is stuck on a field they
cannot answer and the report is lost rather than imperfect.

Two things still worth doing to it: the form is titled "Untitled form", which
is what a reporter sees when they land on it from a course page; and the
three prefilled questions read as questions, so titling them "Selected text
(filled in automatically)" and the like tells people not to rewrite them.

## Making the form

Four questions, in this order. The first three are filled in automatically;
the fourth is the one the reporter writes.

| # | Question | Type | Filled by |
|---|---|---|---|
| 1 | What did you select? | Paragraph | the page |
| 2 | Which page? | Short answer | the page |
| 3 | Link | Short answer | the page |
| 4 | What is wrong with it? | Paragraph | the reporter |

Add anything else you want (a severity, an email, a screenshot upload) after
these. A question the page does not fill is simply left empty.

Do not make questions 1-3 **required**. A required question that arrives
prefilled is fine, but if a prefill ever fails the reporter is stuck on a
field they cannot answer, and the report is lost rather than imperfect.

## Getting the four values the code needs

1. Open the form, then the **⋮** menu → **Get pre-filled link**.
2. Type a recognisable dummy answer into each of the first three questions —
   `QUOTE`, `PAGE`, `LINK` — and leave the comment blank.
3. Press **Get link**, then **Copy link**. It looks like:

```
https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url
  &entry.1234567890=QUOTE
  &entry.987654321=PAGE
  &entry.555555555=LINK
```

4. Read the four values out of it and put them in
   `src/lib/verification/bug-report.ts`:

```ts
export const BUG_REPORT_FORM: BugReportForm = {
  viewformUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform",
  quoteField: "entry.1234567890",
  pageField: "entry.987654321",
  urlField: "entry.555555555",
};
```

`viewformUrl` is everything before the `?`. The three `entry.` names are the
ones sitting in front of `QUOTE`, `PAGE` and `LINK` — they are the field ids,
and they do not change when you edit a question's wording. They **do** change
if you delete a question and add it back, so re-copy the prefilled link after
any restructuring.

`pageField` and `urlField` may be left `""` if you would rather not collect
them; the quote and the form URL are the only two the action needs.

## Screenshots are the reporter's own, not the page's

The dialog takes a real screenshot by having the reporter paste, drop or
choose one. That is not a fallback for something better — it *is* the better
option:

- **A page cannot photograph itself.** No browser gives a document access to
  its own pixels. Chrome's own "Send feedback" can, because it is browser
  chrome, not a page.
- **`getDisplayMedia` is the only real-pixel API a page can reach**, and it
  opens a "choose what to share" picker on every use and does not exist on
  iOS Safari at all.
- **Rendering the DOM to a canvas was tried and removed.** `html-to-image` on
  the attack-trees lesson dropped every node box and every connecting line and
  left the labels floating loose over the dot grid — precisely the diagram
  somebody would be filing a bug about. A 520KB dependency that fails hardest
  on the pages most likely to need it.

The image does not go into the form either: a file-upload question makes
Google require a signed-in Google session from every responder. It is stored
under a `feedback/` prefix in the R2 bucket that already holds the videos, and
the form carries its URL. Uploading requires an app sign-in, which is the
whole rate limit — an endpoint that turns a POST into a public URL is an open
file host otherwise. A signed-out reporter still sends their report, without a
picture.

## Three settings that each force a Google sign-in

Any one of these makes the form reject an anonymous post with 401, and the
dialog can only hand off to Google. All three must be clear:

1. **Collect email addresses** set to `Verified`. Use `Responder input`, which
   is an ordinary question the dialog can fill.
2. **A file-upload question.** Delete it; the screenshot has its own home
   above, and a short-answer question holds the link.
3. **Limit to 1 response.**

If the form is owned by a Workspace, "restrict to users in this organisation"
does the same thing.

## Notes

- **Collecting an email is deliberate: the audience is playtesters** (course
  owner, 2026-09-01), and a named group whose reports you can follow up is
  worth the field. Collect it as a **question** (`Responder input`), not as
  the `Verified` setting — verified means Google, not the reporter, supplies
  it, and that forces a sign-in the dialog cannot satisfy. Delete the question
  when the audience widens past playtesting; that is the whole removal.
- A selection longer than 1200 characters is truncated with an ellipsis
  (`QUOTE_LIMIT`). The prefill travels in a URL, and a whole chapter in a
  query string is refused by the browser before it ever reaches Google.
- Line breaks in a selection are collapsed to single spaces, so a passage
  spanning paragraphs arrives as one readable run.
- The page name is the document title up to the first `·`, the same value the
  notebook stores with a captured quote, so a report and a notebook entry name
  the page identically.
- The rules live in `src/lib/verification/selection-actions.ts` and the
  prefill in `src/lib/verification/bug-report.ts`, both pure and both tested.
  Adding a fifth tool is an entry in the first and an entry point published on
  `window`, never a fifth `selectionchange` listener.
