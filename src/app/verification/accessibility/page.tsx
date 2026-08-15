import type { Metadata } from "next";

/* Accessibility — one of the course's own pages, reached from the footer.
 *
 * Every claim below describes something the code does, and names where it
 * lives so the next person can check it rather than trust it. The rule for
 * editing this page is the same as the verification-log rule everywhere else:
 * do not write a commitment here that nothing implements, and when something
 * lands, say what it does rather than that the site is "accessible".
 *
 * It carries no script of its own; the chrome, the theme switch and the
 * notebook belong to the app. */

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How the Verification course handles themes, contrast, colour, motion, keyboard use and reading length — and what is still missing.",
};

const CONTACT = "mailto:xlab-info@uchicago.edu";
const ISSUES = "https://github.com/XLabTracks/tracks/issues";

export default function Page() {
  return (
    <>
      <link
        rel="stylesheet"
        href="/verification/platform.css"
        precedence="high"
      />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <main id="main">
        <div className="wrap">
          <div className="page-head">
            <h1>Accessibility</h1>
            <p className="lede">
              What this course does so it can be read and worked by more people,
              in enough detail that you can tell before you start whether it
              will suit you. Where something is missing, it says so.
            </p>
          </div>

          <div className="prose">
            <h2>Theme and text size</h2>
            <p>
              Day, night, and high contrast with larger text. The switch sits in
              the header on every page and the choice is remembered on your
              device, so you set it once.
            </p>
            <p>
              The Aa menu offers text at 100%, 125%, 150%, 175%, or 200% and
              remembers that choice too. High contrast opens at 200% until you
              choose another size in Aa; after that, your explicit text-size
              choice takes priority.
            </p>
            <p>
              High contrast is never inferred from your system settings — a
              system set to dark mode gets the night theme, not the
              high-contrast one, because those are different needs and guessing
              between them is how people end up with a display mode they did not
              ask for. Your choices are read and applied before the page paints,
              so it never flashes the wrong ground or text size at you first.
            </p>
            <p>
              All three themes are one set of colour names solved three times
              rather than three separate designs, which is what stops a corner
              of the site from staying light when everything else has gone dark.
            </p>

            <h2>Colour never carries meaning on its own</h2>
            <p>
              Everywhere this course marks something — a correct answer, a
              missed one, a module, a completed unit — the colour is accompanied
              by a word, a glyph, a fraction or a position. If two hues are
              indistinguishable to you, nothing on the page becomes unreadable
              and no exercise becomes unanswerable.
            </p>
            <p>
              Text is set to clear a 4.5:1 contrast ratio against the surface it
              sits on, in each of the three themes.
            </p>

            <h2>Motion</h2>
            <p>
              If your system asks for reduced motion, animations and transitions
              are cut to effectively nothing across the whole course. Nothing
              here moves on its own, nothing hijacks your scrolling, and no
              exercise advances you to the next step before you say so.
            </p>

            <h2>Keyboard and screen readers</h2>
            <p>
              A skip link is the first thing on every page, so a keyboard or
              screen-reader user can jump past the header to the content. Focus
              is always visible, with a heavier outline on the high-contrast
              theme, because a focus ring that exists but cannot be found is not
              a focus ring.
            </p>
            <p>
              The interactive exercises drag things into places, and every one
              of them can be worked three ways: drag with a pointer, click the
              thing then click where it goes, or focus it and use Enter or
              Space, with Escape to put it back down. What you picked up and
              where it landed are announced, so the exercise is followable
              without seeing the board.
            </p>
            <p>
              The tools that act on selected text — highlight it, look a term
              up, keep the passage in your notebook — watch the selection itself
              rather than the mouse. Selecting with Shift and the arrow keys, or
              by dragging a phone&rsquo;s own selection handles, offers you the
              same three actions a mouse drag does.
            </p>

            <h2>Reading length is yours to set</h2>
            <p>
              Course readings are served one part at a time by default, with a
              strip to jump between parts. If that suits you badly — a screen
              reader, a print-out, or simply wanting the whole argument at once
              — &ldquo;Read the whole lesson&rdquo; lays it all out, and the
              choice is remembered.
            </p>
            <p>
              Nothing completes itself because you scrolled. Marking a unit
              complete is always something you do deliberately, so a meter can
              never claim you have read something you have not.
            </p>
            <p>
              On papers, footnotes render as margin notes when the window is
              wide enough, and that is a switch in the paper header rather than
              something imposed on you. The footnotes stay in the document
              itself either way, so nothing is only reachable through the
              margin.
            </p>

            <h2>What is not done yet</h2>
            <p>
              This page is a description, not a conformance claim. The course
              has not been through a formal WCAG audit or tested end to end with
              a screen reader by somebody who uses one daily, and until it has,
              that is the honest state of it.
            </p>
            <p>
              Two known gaps: the exercises are visual boards, and while each is
              operable by keyboard and announces what happens, a few of them
              convey spatial relationships that no announcement fully replaces.
              And the course quotes real reports, several of which are PDFs on
              other people&rsquo;s sites whose accessibility we do not control.
            </p>

            <h2>Tell us what breaks</h2>
            <p>
              If something here blocks you, that is a defect and we want the
              report. Open an issue at{" "}
              <a href={ISSUES} target="_blank" rel="noopener noreferrer">
                the course repository
              </a>
              , which is public, or write to{" "}
              <a href={CONTACT}>xlab-info@uchicago.edu</a>. Say what you were
              trying to do and what got in the way — that is more useful than a
              standard name.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
