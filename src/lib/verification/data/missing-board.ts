
export const BOARD_INTRO =
  "In the nuclear regime, the inspection institution has four major steps: inspectors find, the Director-General reports, the Board of Governors judges, and the Security Council enforces. The AI verification regime has no such established process.";
export const BOARD_TASK_LEAD =
  "In this exercise, you will build a similar pipeline for frontier AI inspections, drawing direct parallels with each step in the nuclear inspection process.";
export const BOARD_LIMIT = "Write two to four sentences for each station.";

export interface BoardStation {
  id: string;
  title: string;
  nuclear: string;
  prompt: string;
}

export const BOARD_STATIONS: BoardStation[] = [
  {
    id: "finder",
    title: "The finder",
    nuclear:
      "IAEA inspectors, and the safeguards analysis behind them, establish the facts and report them up.",
    prompt:
      "Who plays the inspectors’ part for AI — who establishes the facts — and what access would they need for those facts to hold up later?",
  },
  {
    id: "judge",
    title: "The judge",
    nuclear:
      "The Board of Governors decides whether the facts constitute noncompliance — a judgment, Carlson insists, not a checklist.",
    prompt:
      "Who could play the Board of Governors’ part for AI: a body legitimate enough that rivals accept its findings, and independent enough that none of the four forms of capture described in 2.3.10 owns it?",
  },
  {
    id: "enforcer",
    title: "The enforcer",
    nuclear:
      "A noncompliance finding must be reported to the Security Council, where enforcement lives.",
    prompt:
      "What plays the Security Council’s part for AI — and what would enforcement actually deny a violator?",
  },
  {
    id: "standard",
    title: "The standard",
    nuclear:
      "The Board has never defined noncompliance; five cases were decided case by case, and Carlson argues the credibility of the system rides on consistency.",
    prompt:
      "Write the one-sentence standard your AI regime announces before its first case: what separates a breach worth correcting from noncompliance worth judging?",
  },
];

export const BOARD_STRAIN_PROMPT =
  "At which of the four stations does the nuclear analogy fit worst? Name the station and give the reason.";

export const BOARD_COMMENTARY: { title: string; body: string }[] = [
  {
    title: "The finder",
    body: "AI has candidate finders — module 2’s evidence streams: chip attestation and logs, cloud records, national technical means, and the human layer this section closed on. What none of them supplies alone is facts that survive challenge: the finder’s access has to be agreed in advance, or every finding arrives with a provenance fight attached.",
  },
  {
    title: "The judge",
    body: "This is the station with no tenant. The IAEA Board’s standing took a treaty, a statute and decades of cases; nothing with comparable legitimacy exists for AI, and every candidate — a treaty conference, a new agency, a plurilateral council — trades legitimacy against capture along exactly the lines this section mapped: who funds it, who staffs it, who clears its reports.",
  },
  {
    title: "The enforcer",
    body: "There is no Security Council of compute, but AI’s enforcement lever may be more usable than sanctions ever were: the supply chain narrows to a handful of chokepoints, and denial — of chips, of cloud capacity, of interconnect — is enforcement a coalition can actually deliver. The strain is the same as the UNSC’s: the likeliest violators sit inside the coalition that would have to act.",
  },
  {
    title: "The standard",
    body: "Carlson’s closing argument transfers whole: a regime that decides case by case, with no announced standard, spends credibility on every decision. Whatever sentence you wrote, the test it must pass is the one his five cases failed — would two rivals, reading it in advance, predict the same verdict on the same facts?",
  },
];

export const BOARD_FINAL =
  "Carlson argues that the system’s credibility depends on consistency. In no more than 50 words, state one rule you would bind your AI board to before it decides its first case.";
export const BOARD_FINAL_MAX_WORDS = 50;
