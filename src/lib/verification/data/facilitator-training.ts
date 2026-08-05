/**
 * Facilitator Training Track — the five sessions that train a facilitator,
 * as distinct from the field guide's plans for running the course's own
 * sessions. One prepares the person; the other is what they run afterwards.
 *
 * NOT a track in the content graph, despite what its own title calls it. It
 * has no Track, no modules, no lessons, no progress and no place in
 * curriculum.ts: it is the material a facilitator reads before running a
 * cohort, and turning it into a course would give a facilitator a completion
 * bar for five sessions they attend in a room with other people.
 *
 * Human-authored copy, reproduced as supplied, links included. Nothing here is
 * paraphrased and nothing is invented — a reading with no supplied link would
 * print as a bare title rather than being pointed somewhere plausible.
 *
 * The URLs are verbatim, tracking parameters and all: they are how the author
 * handed them over, and quietly rewriting somebody's link is not this file's
 * business.
 *
 * Trap: every session's work is a live group — analysing failure modes with
 * other people, facilitating a simulation with actors briefed to derail it.
 * There is nothing here for a lone reader to click, so the sessions carry a
 * sign-up rather than an exercise. Building a widget for any of them would be
 * inventing an activity the track does not have.
 */

export const FT_HEADER = {
  title: "Facilitator Training Track",
  lede:
    "This track prepares facilitators to effectively lead discussions, workshops, and research group sessions. The focus is on learning retention.",
} as const;

/** The two things a facilitator is handed, described in the track's own words. */
export const FT_TOOLS: { name: string; desc: string }[] = [
  {
    name: "A course doc",
    desc: "shared meeting document that participants fill out collaboratively during discussions.",
  },
  {
    name: "A question map",
    desc: "a structured list of discussion prompts categorized by theme and function. Facilitators use it as a dynamic script, selecting questions based on group context and flow.",
  },
];

export const FT_TOOLS_NOTE =
  "The track trains facilitators to use these tools effectively.";

/**
 * A reading or handout a session sends you to.
 *
 * `href` is present only where the track supplied one. A material without one
 * prints as a plain title — named, but not linked to a guess.
 */
export interface TrainingMaterial {
  title: string;
  href?: string;
}

export interface TrainingSession {
  n: number;
  title: string;
  /** The track's own "Focus:" paragraph, split into its lines. */
  focus: string[];
  materials: TrainingMaterial[];
}

export const FT_SESSIONS: TrainingSession[] = [
  {
    n: 1,
    title: "Why Structure Helps (and Why It Breaks)",
    focus: [
      "Why well-designed agendas and meeting structures improve outcomes for everyone : and why they often collapse under social dynamics.",
      "Participants analyze typical failure modes of discussions and learn strategies to restore structure without stifling engagement.",
    ],
    materials: [
      {
        title: "AG_CS facilitators handbook",
        href: "https://drive.google.com/file/d/1BmRWqSIP0mDLPjxoafnLNOvJAUmC-Fxg/view",
      },
    ],
  },
  {
    n: 2,
    title: "Realistic Outcomes of a Productive Meeting",
    focus: [
      "What “success” looks like in a facilitated setting: remembered knowledge, internalized models, and genuine belief updates.",
      "Participants define measurable goals for each type of session and learn to align facilitation techniques with cognitive outcomes.",
    ],
    materials: [
      {
        title: "The Science of Learning: Mechanisms and Principles",
        href: "https://drive.google.com/file/d/1tAIMLUpw1S0LlNLdBhldmtPe6csgq4M5/view",
      },
    ],
  },
  {
    n: 3,
    title: "Written Reflection and Un-Evadable Structures",
    focus: [
      "How written thinking changes participation dynamics and improves depth of reasoning.",
      "Participants practice structuring sessions around the provided course document.",
    ],
    materials: [
      {
        title: "Blended learning & flipped classroom",
        href: "https://www.youtube.com/watch?v=paQCE58334M&utm_source=bluedot-impact",
      },
    ],
  },
  {
    n: 4,
    title: "Asking Questions Effectively",
    focus: [
      "The Pose-Pause-Pounce-Bounce technique and other methods for equitable engagement.",
      "Participants learn to use a question map and rephrase open questions to fit the context of discussion, use silence strategically, and sustain balanced participation in groups of varying dynamics.",
    ],
    materials: [
      {
        title:
          "My TOP 5 Questioning Techniques for Teachers [Generate More Discussion & Debate in Your Lessons]",
        href: "https://youtu.be/CaE_4NlNM74?si=HsrEvgrddSd9iVmh",
      },
      {
        title: "12 top takeaways from The Coaching Habit",
        href: "https://medium.com/@hannahpixels/12-top-takeaways-from-the-coaching-habit-e2ea3028ec34",
      },
    ],
  },
  {
    n: 5,
    title: "Crash Test Simulation",
    focus: [
      "Live stress-testing under pressure.",
      "Participants facilitate a simulated session with actors intentionally disrupting or derailing discussion, applying all learned techniques to maintain structure, flow, and respect",
    ],
    materials: [],
  },
];
