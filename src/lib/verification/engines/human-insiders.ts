import {
  CONNECTION_KINDS,
  CREDIBILITY_QUESTIONS,
  sourceActor,
  type ConnectionKind,
  type SourceActorId,
} from "@/lib/verification/data/human-insiders";

export type SourceConnection = Partial<Record<ConnectionKind, string>>;

export interface ConnectionCheck {
  complete: boolean;
  correct: Record<ConnectionKind, boolean>;
  messages: Partial<Record<ConnectionKind, string>>;
}

/**
 * Check a source map without collapsing the result into a credibility score.
 * Each dimension stays visible so the learner can repair the overclaim itself.
 */
export function checkConnection(
  actorId: SourceActorId,
  selection: SourceConnection
): ConnectionCheck {
  const actor = sourceActor(actorId);
  const correct = {
    observation: selection.observation === actor.correct.observation,
    boundary: selection.boundary === actor.correct.boundary,
    corroboration: selection.corroboration === actor.correct.corroboration,
  };
  const messages: ConnectionCheck["messages"] = {};
  for (const kind of CONNECTION_KINDS) {
    if (!selection[kind]) messages[kind] = "Choose a card for this link.";
    else if (!correct[kind]) messages[kind] = actor.mismatch[kind];
  }
  return {
    complete: CONNECTION_KINDS.every((kind) => correct[kind]),
    correct,
    messages,
  };
}

export function checkCredibilityAnswer(
  questionId: (typeof CREDIBILITY_QUESTIONS)[number]["id"],
  answerId: string
): boolean {
  const question = CREDIBILITY_QUESTIONS.find((item) => item.id === questionId);
  return question?.answerId === answerId;
}
