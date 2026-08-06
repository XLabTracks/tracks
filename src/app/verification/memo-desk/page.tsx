import type { Metadata } from "next";
import { LegacyScripts } from "@/components/verification/legacy-scripts";

/* Memo desk — one of the course's own pages.
 *
 * It was a hand-written .html file under public/verification/ until the two
 * halves were folded together: a page served outside the app has no session,
 * so it could only ask an API whether somebody was signed in and never show
 * them their own account. The markup is unchanged; the behaviour is still
 * memo-desk's scripts, loaded in order by LegacyScripts. */

export const metadata: Metadata = { title: "Memo desk" };

const SCRIPTS = ["data/course.js", "data/skills.js", "data/memos.js", "data/chrome.js", "platform.js", "memo-desk.js"];

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/verification/platform.css" precedence="high" />
      <link rel="stylesheet" href="/verification/page.css" precedence="high" />
      <link rel="stylesheet" href="/verification/memo-desk.css" precedence="high" />
      <link rel="stylesheet" href="/verification/exercise.css" precedence="high" />
      <main id="main">
        <div className="wrap">
          <div className="desk-head">
            <h1>Memo desk</h1>
            <p>
              Every written output the track asks for, in one place. Where the
              assignment has a brief, it is quoted below in full; where it does not
              have one yet, this page says so rather than inventing one.
            </p>
          </div>

          <div className="desk">
            <aside className="slot-rail">
              <h2>Written outputs</h2>
              <div id="slotList"></div>
            </aside>

            <section className="paper">
              <h2 className="slot-title" id="slotTitle">—</h2>
              <p className="slot-meta" id="slotMeta"></p>
              <div id="slotBrief"></div>

              <div className="pins">
                <label className="pin">
                  <span className="pk">To — a specific audience</span>
                  <input id="fAudience" className="pin-in" type="text" autoComplete="off"
                    placeholder="e.g. the US delegation's technical adviser; the lab's policy lead…" />
                </label>
                <label className="pin">
                  <span className="pk">Decision this informs</span>
                  <input id="fDecision" className="pin-in" type="text" autoComplete="off"
                    placeholder="what the reader should do differently after reading" />
                </label>
                <label className="pin">
                  <span className="pk">What would change my mind</span>
                  <input id="fFalsifier" className="pin-in" type="text" autoComplete="off"
                    placeholder="the evidence that would flip your recommendation" />
                </label>
              </div>

              <input id="fTitle" className="title-in" type="text" autoComplete="off"
                placeholder="Title — the recommendation, not the topic" />
              <textarea id="fBody" className="body-in"
                placeholder="Write it. Markdown **bold** survives the skim — use it on the lines that must.&#10;&#10;Paragraph rule of thumb: the first sentence carries the point; a skimming reader gets nothing else."></textarea>

              <div className="desk-tools">
                <div className="budget">
                  <span className="mono" id="wordCount">0 words</span>
                  <div className="bbar"><i id="budgetBar" style={{ width: '0%' }}></i></div>
                </div>
                <button type="button" className="tool" id="exportBtn">Export .md</button>
                <button type="button" className="tool" id="clearBtn">Clear this draft</button>
              </div>

              {/* True, and worth saying where someone is about to type an opinion:
                   drafts sit in this browser under xlab-verification-memo-desk.v1
                   and are not part of the account sync. */}
              <p className="desk-note">Drafts autosave in this browser. Nothing you write here leaves it.</p>
            </section>

            <aside className="check-rail">
              <div className="modes" role="tablist" aria-label="Rail mode">
                <button type="button" className="mode" id="modeWrite" role="tab" aria-selected="true" aria-controls="paneWrite">Desk checks</button>
                <button type="button" className="mode" id="modeSkim" role="tab" aria-selected="false" aria-controls="paneSkim">Skim test</button>
              </div>

              <div id="paneWrite" role="tabpanel" aria-labelledby="modeWrite">
                <div className="rail-card">
                  <p className="rk">Genre checks
                    <span className="rk-note">rule-based heuristics, every rule named — the rubric is the judge, not this rail</span>
                  </p>
                  <div id="lint"></div>
                </div>
                <div className="rail-card" id="criteriaCard" hidden>
                  <p className="rk">Peer review runs on <span className="rk-note">this slot&apos;s own criteria</span></p>
                  <ul id="criteriaList" style={{ marginLeft: '18px', fontSize: '13px', lineHeight: '1.6' }}></ul>
                </div>
                <div className="rail-card">
                  <p className="rk">Steelman deck <span className="rk-note">contested claims get challenged, not narrated</span></p>
                  <p className="deck-card" id="deckCard">Draw a challenge and answer it inside the memo — or in the falsifier field.</p>
                  <button type="button" className="tool" id="deckBtn">Draw a challenge</button>
                </div>
              </div>

              <div id="paneSkim" role="tabpanel" aria-labelledby="modeSkim" hidden>
                <div className="rail-card">
                  <p className="rk">What a reader in a hurry sees
                    <span className="rk-note">first sentences plus your <b>bold</b> lines; the rest is what a skim discards</span>
                  </p>
                  <p className="skim-stats mono" id="skimStats"></p>
                  <div className="skim" id="skimOut"></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <LegacyScripts src={SCRIPTS} />
    </>
  );
}
