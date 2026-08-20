
export const FT_HEADER = {
  title: "Facilitator Training Track",
  lede:
    "This track prepares facilitators to effectively lead discussions, workshops, and research group sessions. The focus is on learning retention.",
} as const;

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

export interface TrainingMaterial {
  title: string;
  href?: string;
}

export interface TrainingSession {
  n: number;
  title: string;
  focus: string[];
  materials: TrainingMaterial[];
  signUp?: string;
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
    signUp: "Sign up for the crash test simulation",
  },
];
