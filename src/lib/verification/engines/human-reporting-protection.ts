import {
  reportingCase,
  type ReportingCaseId,
} from "@/lib/verification/data/human-reporting-protection";

export function checkReportingAnswer(
  caseId: ReportingCaseId,
  stepId: string,
  answerId: string,
): boolean {
  const step = reportingCase(caseId).steps.find((item) => item.id === stepId);
  return step?.answerId === answerId;
}
