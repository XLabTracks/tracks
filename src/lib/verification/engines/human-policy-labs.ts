import {
  HUMAN_POLICY_LABS,
  type HumanPolicyLabId,
} from "@/lib/verification/data/human-policy-labs";

export function checkHumanPolicyDecision(
  labId: HumanPolicyLabId,
  stepId: string,
  answerId: string
): boolean {
  const lab = HUMAN_POLICY_LABS.find((candidate) => candidate.id === labId);
  const step = lab?.phases
    .flatMap((phase) => phase.steps)
    .find((candidate) => candidate.id === stepId);
  return step?.answerId === answerId;
}
