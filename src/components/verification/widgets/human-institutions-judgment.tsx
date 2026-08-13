"use client";

import { HumanPolicyDecisionLab } from "./human-policy-decision-lab";
import { INSTITUTIONS_JUDGMENT_LAB } from "@/lib/verification/data/human-policy-labs";
import type { VerificationWidgetProps } from "../kit/types";

export function HumanInstitutionsJudgment(props: VerificationWidgetProps) {
  return <HumanPolicyDecisionLab {...props} lab={INSTITUTIONS_JUDGMENT_LAB} />;
}
