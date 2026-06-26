import type { Assessment } from "@/lib/content/types";

// One example end-of-module assessment for the Example track. Uses a real
// deliverable format + section scaffold; copy is lorem ipsum.
export const assessments: Assessment[] = [
  {
    id: "ex-assessment",
    moduleId: "ex-assess",
    title: "Example essay",
    format: "essay",
    prompt:
      "Example end-of-module assessment: write a short essay across the sections below. Replace this with a real prompt when authoring.",
    minWords: 200,
    maxWords: 600,
    sections: [
      { id: "thesis", label: "Thesis", placeholder: "State your claim…" },
      { id: "analysis", label: "Analysis", placeholder: "Make your case…" },
      { id: "conclusion", label: "Conclusion", placeholder: "Wrap up…" },
    ],
    rubric: [
      { id: "clarity", label: "Clarity", description: "Lorem ipsum dolor sit amet." },
      { id: "structure", label: "Structure", description: "Consectetur adipiscing elit." },
      { id: "evidence", label: "Use of evidence", description: "Sed do eiusmod tempor." },
    ],
  },
];
