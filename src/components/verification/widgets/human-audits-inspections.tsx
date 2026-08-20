"use client";

import { HumanPolicyDecisionLab } from "./human-policy-decision-lab";
import { AUDITS_INSPECTIONS_LAB } from "@/lib/verification/data/human-policy-labs";
import type { VerificationWidgetProps } from "../kit/types";

export function HumanAuditsInspections(props: VerificationWidgetProps) {
  return <HumanPolicyDecisionLab {...props} lab={AUDITS_INSPECTIONS_LAB} />;
}
