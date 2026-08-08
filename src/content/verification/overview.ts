/**
 * The course overview the landing page opens as toggle sections: who it is
 * for, what it covers, what you leave able to do, and how to work it async or
 * sync.
 *
 * Author's copy, transcribed verbatim. Two placeholders in the source were
 * resolved rather than printed: the notebook one became a real control (the
 * notebook is a tool mounted on the page, so it has no URL to link to), and
 * "a facilitation resources module here" points at /verification/facilitator.
 *
 * Trap: the six outcomes below are the long form of the six short labels in
 * `public/verification/data/skills.js`, which the skill map uses as chips and
 * indexes by position (`lo: [3]` is the fourth). They must stay in the same
 * order and mean the same things; the short ones are not a second copy to
 * edit independently, they are that map's labels for these.
 */

export interface OverviewSection {
  id: string;
  /** The disclosure's own heading — the author's lead-in line. */
  title: string;
  /** One line under the title, closed and open. */
  summary: string;
}

export interface ListSection extends OverviewSection {
  kind: "bullets" | "numbered";
  /**
   * Groups of items. The author's copy separates the coverage questions into
   * blocks with blank lines; the blocks are kept as groups rather than
   * flattened, because that grouping is how the course is shaped.
   */
  groups: string[][];
}

export interface ProseSection extends OverviewSection {
  kind: "prose";
  /** Each entry is one labelled paragraph. `body` may name one placeholder. */
  paragraphs: {
    label: string;
    body: string;
    slot?: "notebook" | "facilitator";
  }[];
}

export type CourseOverviewSection = ListSection | ProseSection;

export const courseOverview: CourseOverviewSection[] = [
  {
    id: "who",
    kind: "bullets",
    title: "You should take this course if you are",
    summary: "Two audiences, one shared problem.",
    groups: [
      [
        "A technical AI safety researcher aiming to translate technical knowledge into politically feasible and effective policy",
        "A law/policy student or professional motivated to write and advocate for technically grounded policy to regulate the development of dangerous AI capabilities",
      ],
    ],
  },
  {
    id: "learn",
    kind: "bullets",
    title: "Throughout the course, you will learn",
    summary: "The questions each part of the course is built to answer.",
    groups: [
      [
        "Why is verification important? What would happen without verification?",
        "How have historical verification efforts with dangerous technologies succeeded and failed?",
      ],
      [
        "Who are the relevant actors to a verification agreement, and how could each be incentivized to act?",
        "What are the realistic possibilities of what a verifiable international treaty could look like?",
      ],
      [
        "What types of verification mechanisms are there for AI verification? What are the strengths and weaknesses for each?",
        "How do you balance confidentiality with verifiability between adversarial states?",
      ],
      [
        "How could motivated adversarial actors circumvent a verification regime? How could you protect against such failure modes?",
      ],
      [
        "How do you assess the relative feasibility of different verification mechanisms when designing a coherent regime? How do you layer imperfect mechanisms to maximize overall reliability?",
      ],
    ],
  },
  {
    id: "outcomes",
    kind: "numbered",
    title: "By the end of this course, you will be able to",
    summary: "The six things the whole course is scored against.",
    groups: [
      [
        "Translate a proposed international AI commitment into verifiable claims by specifying the covered actors, activities, thresholds, declarations, evidence requirements, and conditions that would constitute compliance or non-compliance.",
        "Map relevant actors and verification opportunities across the AI compute supply chain, from semiconductor equipment and fabrication to cloud infrastructure, model training, and deployment.",
        "Evaluate hardware, cloud, intelligence and human verification mechanisms according to the claims they can test, the evidence they produce, their implementation requirements, and their principal failure modes.",
        "Distinguish load-bearing verification mechanisms from less effective or feasible ones.",
        "Analyze plausible evasion strategies and evaluate which combinations of monitoring, corroboration, inspection, and enforcement could detect, deter, or mitigate them.",
        "Produce clear, actor-aware policy analysis for a specified audience.",
      ],
    ],
  },
  {
    id: "how",
    kind: "prose",
    title: "How to use this course",
    summary: "Working it on your own, or running it with a group.",
    paragraphs: [
      {
        label: "If you are async",
        slot: "notebook",
        body: "You will get out of this course what you put into it. We’ve tailored our materials based on research in the literature, mechanisms, posts, and available readings and videos in the field, as well as interviews with experts, to produce what we think is the most efficient exploration of this quickly developing field for both technical and non technical people, priming you to effectively understand the mechanisms of verification and their feasibility relevant to their effectiveness, within the geopolitical environment we are currently in at this turning point in advanced AI development. You will also have a persistent notebook to record thoughts, critiques, ambiguities, surprises, connections, fun tidbits and anything else you want to retain throughout the course—click ",
      },
      {
        label: "If you are sync",
        slot: "facilitator",
        body: "Our exercises are designed to be adaptable for a synchronous group setting; relevant asynchronous activities have recommendations on adaptation. Each module also has a section on synchronous interpersonal activities to run and a discussion prompt bank, including but not limited to wargames and circumvention simulations. For live facilitators: ",
      },
    ],
  },
];
