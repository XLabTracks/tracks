import type { CourseOverviewSection } from "@/content/verification/overview";

// Drawn from the Control modules' summaries and the platform's features;
// keep it in step with curriculum.data.ts when modules change.
export const controlOverview: CourseOverviewSection[] = [
  {
    id: "who",
    kind: "numbered",
    title: "You should take this course if you are",
    groups: [
      [
        "Someone who has finished an intro-level AI safety course and wants to go deep on one technical agenda",
        "A researcher or engineer weighing whether to work on AI control, who wants the field's primary literature read closely rather than summarized",
        "An instructor or reading group looking for structured material on keeping AI systems safe even if they are trying to subvert oversight",
      ],
    ],
  },
  {
    id: "learn",
    kind: "numbered",
    title: "Throughout the course, you will learn",
    groups: [
      [
        "Why would we want safety measures that hold up even if a model is deliberately trying to get around them?",
        "How does a control evaluation pit a red team against a blue team's protocol, and what do trusted monitoring and deferring to a trusted model buy?",
        "How could a scheming AI cause a catastrophe, and what would it take to catch one red-handed?",
      ],
      [
        "What are the strongest arguments against AI control, and how well do they hold up?",
        "When is control worth paying for, and where does it sit among Plans A through D?",
      ],
      [
        "How are control protocols evaluated, and what do detection, prevention, and response each contribute?",
      ],
      [
        "What makes a failure high-stakes, and how do monitoring, resampling, and rogue-deployment threat models shape the protocols built for it?",
      ],
      [
        "How do you handle low-stakes failures like research sabotage, sandbagging, and exploration hacking, where no single action is incriminating?",
      ],
      [
        "What threat models exist beyond scheming, such as reward seekers, and could we make deals with AIs?",
      ],
    ],
  },
  {
    id: "outcomes",
    kind: "numbered",
    title: "By the end of this course, you will be able to",
    groups: [
      [
        "Explain the control framing: designing and evaluating safety measures that hold up against a model that is deliberately trying to subvert them.",
        "Read a control evaluation and say what its red team, blue team, and safety and usefulness numbers actually show.",
        "Weigh the case for and against control, and judge when it is worth its cost.",
        "Place a proposed protocol in the mitigation stack of detection, prevention, and response.",
        "Tell high-stakes failures from low-stakes ones, and match each to the protocols and research built for it.",
        "Find your way into control research through the research programs, organizations, and opportunity boards the track closes with.",
      ],
    ],
  },
  {
    id: "how",
    kind: "prose",
    title: "How to use this course",
    paragraphs: [
      {
        label: "If you are async",
        body: "Everything is open and there is no enrollment. The readings reproduce the field's papers and posts in full, with exercises placed where the argument turns, and the modules build on each other in order. Sign in to save your progress: every tap-to-reveal question you rate then joins a spaced-repetition deck on the Review tab, and written responses can get automated feedback on how clearly they show their reasoning.",
      },
      {
        label: "If you are sync",
        body: "Instructors can open a classroom, have learners join it, assign lessons and readings from any module, and see who has completed them. A classroom can also carry its own grading key, so every member's written responses get feedback without each person bringing their own.",
      },
    ],
  },
];
