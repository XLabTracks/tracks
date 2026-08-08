/**
 * The "types of AI" optional material — a nested-containment picture of the
 * field, AI ⊃ Narrow AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Generative AI ⊃
 * Large Language Model ⊃ Transformer LLMs. Each level names real systems that
 * sit at that level but NOT the next one in, so the boundaries mean something:
 * a Roomba is narrow AI but not machine learning; Mamba is a language model
 * but not a transformer.
 *
 * The widget reads this file and nothing else — every label, blurb and the
 * why-it-sits-here line is data here, not markup in the component. Blurbs are
 * short factual descriptions of well-known systems and the definitional line
 * that places each one; they are not course claims, so they carry no citation.
 */

export interface AiExample {
  /** Display name on the diagram. */
  name: string;
  /** One line: what the system is. */
  what: string;
  /** One line: why it sits at this level and not the next ring in. */
  why: string;
}

export interface AiLevel {
  key: string;
  /** Ring label. */
  name: string;
  /** What this category is. */
  blurb: string;
  /** Systems at this level but not the level nested inside it. */
  examples: AiExample[];
}

/** Outermost first. Index 0 is the whole field; the last is the innermost ring. */
export const AI_LEVELS: AiLevel[] = [
  {
    key: "ai",
    name: "AI",
    blurb:
      "The whole field: any system built to do things we would call intelligent.",
    examples: [],
  },
  {
    key: "narrow",
    name: "Narrow AI",
    blurb:
      "Built for one task or a narrow set of them. Everything that actually exists today lives here.",
    examples: [
      {
        name: "Roomba",
        what: "iRobot's robot vacuum.",
        why: "Navigates with sensors and fixed rules — it does not learn from data, so it is narrow AI but not machine learning.",
      },
      {
        name: "Boeing autopilot",
        what: "Flight-control automation.",
        why: "Follows engineered control laws for one job; nothing about it is learned from data.",
      },
      {
        name: "IBM Deep Blue",
        what: "The chess computer that beat Kasparov in 1997.",
        why: "Brute-force search plus a hand-crafted evaluation function — formidable, but narrow and not machine learning.",
      },
      {
        name: "Word spell checker",
        what: "Dictionary-and-rules spelling correction.",
        why: "Looks words up against a list and applies rules; narrow and rule-based.",
      },
    ],
  },
  {
    key: "ml",
    name: "Machine Learning",
    blurb:
      "Systems that learn patterns from data instead of being programmed rule by rule.",
    examples: [
      {
        name: "Amazon spam filter",
        what: "Amazon's early email spam classification.",
        why: "Learns spam-vs-not from labelled examples — machine learning, but not a deep neural network.",
      },
      {
        name: "Chase credit",
        what: "Chase's automated credit-scoring decisions.",
        why: "Statistical models fit to historical data; machine learning without deep learning.",
      },
      {
        name: "JPMorgan fraud",
        what: "JP Morgan's transaction-fraud flagging.",
        why: "Learns fraud patterns from past transactions; classical machine learning.",
      },
    ],
  },
  {
    key: "dl",
    name: "Deep Learning",
    blurb:
      "Machine learning with many-layered neural networks that learn their own features.",
    examples: [
      {
        name: "Apple Photos",
        what: "On-device photo recognition (image classifiers).",
        why: "Convolutional neural networks — deep learning, but it labels images rather than generating them.",
      },
      {
        name: "Azure Speech to Text",
        what: "Microsoft's speech-recognition service.",
        why: "Deep neural nets map audio to text; recognition, not generation.",
      },
      {
        name: "FaceID",
        what: "Apple's face unlock.",
        why: "A deep neural net recognises your face — discriminative, not generative.",
      },
    ],
  },
  {
    key: "gen",
    name: "Generative AI",
    blurb:
      "Deep-learning systems that create new content — images, audio, video, text.",
    examples: [
      {
        name: "Midjourney",
        what: "Text-to-image generator.",
        why: "Generates images (diffusion) — generative, but not a language model.",
      },
      {
        name: "Sora",
        what: "OpenAI's text-to-video model.",
        why: "Generates video; generative, but not language.",
      },
      {
        name: "Suno",
        what: "AI music generator.",
        why: "Generates audio; generative, non-language.",
      },
      {
        name: "Adobe Firefly",
        what: "Adobe's image-generation model.",
        why: "Generative imagery; not a language model.",
      },
    ],
  },
  {
    key: "llm",
    name: "Large Language Model",
    blurb: "Generative models that specialise in language.",
    examples: [
      {
        name: "Mamba",
        what: "A state-space-model language model.",
        why: "A large language model that is NOT a transformer — it uses a state-space architecture instead of attention.",
      },
      {
        name: "RWKV",
        what: "An RNN-style language model.",
        why: "A language model built on a recurrent architecture rather than transformers.",
      },
    ],
  },
  {
    key: "transformer",
    name: "Transformer LLMs",
    blurb:
      "Language models built on the transformer (attention) architecture — today's mainstream.",
    examples: [
      {
        name: "Claude",
        what: "Anthropic's assistant.",
        why: "A transformer-based large language model.",
      },
      {
        name: "ChatGPT",
        what: "OpenAI's assistant.",
        why: "Built on GPT transformers.",
      },
      {
        name: "Gemini",
        what: "Google DeepMind's assistant.",
        why: "Transformer-based.",
      },
      {
        name: "LLaMA",
        what: "Meta's open-weight model family.",
        why: "Transformer architecture.",
      },
    ],
  },
];

/** The two regions outside real, narrow AI — each a note, not a system. */
export const AI_REGIONS = {
  theoretical: {
    label: "Theoretical only",
    body: "Right now is theoretical-only. There are no real non-narrow AI models known right now.",
  },
  absurd: {
    label: "Possible but absurd",
    body: "Theoretically possible but would require an absurd quantity of resources. Less likely to occur.",
  },
} as const;

export const TYPES_OF_AI_COPY = {
  prompt:
    "Tap any system to see what it is and why it sits there — not one ring deeper.",
  legend:
    "Each ring contains the next; a system sits at the deepest ring it belongs to. Tap a system to open it; drag or use +/− for a closer look.",
} as const;
