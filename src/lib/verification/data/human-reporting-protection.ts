/**
 * Two source-grounded cases for 2.4.2. The first applies California Labor
 * Code §§1107–1107.2 and the AIWI/CARMA best-practice guide to a reporting
 * route. The second applies CIGIE's 2025 Quality Standards for Investigations
 * and the corroboration analysis in Baker and Wasil to the resulting evidence.
 */

export type ReportingCaseId = "protected-route" | "evidence-path";

export interface ReportingChoice {
  id: string;
  text: string;
}

export interface ReportingStep {
  id: string;
  label: string;
  prompt: string;
  choices: readonly ReportingChoice[];
  answerId: string;
  retry: string;
  explanation: string;
  sourceLabel: string;
  sourceHref: string;
  findingLine: string;
}

export interface ReportingCase {
  id: ReportingCaseId;
  eyebrow: string;
  title: string;
  body: string;
  steps: readonly ReportingStep[];
  resultTitle: string;
  result: string;
  breakLabel?: string;
}

const CALIFORNIA_LABOR_CODE =
  "https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=5.1.&division=2.&lawCode=LAB&part=3.&title=";
const AIWI_GUIDE = "https://aiwi.org/ai-whistleblowing-law-best-practice/";
const AIWI_SB53 =
  "https://aiwi.org/publication-commentary-whistleblower-protections-in-sb-53/";
const CIGIE_QSI =
  "https://www.ignet.gov/sites/default/files/files/Quality%20Standards%20for%20Investigations%20July-2025.pdf#page=13";
const WASIL = "https://arxiv.org/html/2408.16074";

export const REPORTING_CASES: readonly ReportingCase[] = [
  {
    id: "protected-route",
    eyebrow: "Case 1 · Protection route",
    title: "A safety engineer reports to the Attorney General",
    body:
      "Nadia is employed by a frontier developer. Her assigned work includes assessing and managing risks of critical safety incidents. She has reasonable cause to believe a planned deployment could materially contribute to more than 50 deaths by providing expert assistance for the release of a biological agent. She reports directly to the California Attorney General. Nadia signed a broad NDA. The external intake route states no anonymity or confidentiality guarantee, and no technical AI specialist has yet been assigned.",
    steps: [
      {
        id: "person",
        label: "Person",
        prompt: "Which statement correctly identifies Nadia's status under SB 53?",
        choices: [
          {
            id: "assigned-safety-role",
            text: "Her assigned responsibility for critical-safety-incident risk places her within the chapter's definition of a covered employee.",
          },
          {
            id: "all-frontier-staff",
            text: "Every employee of a frontier developer is a covered employee for every report about model safety.",
          },
          {
            id: "executives-only",
            text: "Only officers and directors can qualify because they control the developer's response to risk.",
          },
          {
            id: "expertise-alone",
            text: "Technical expertise alone is enough, even when assessing or managing critical safety incidents is not part of the person's work.",
          },
          {
            id: "status-after-report",
            text: "A worker becomes covered only after the Attorney General accepts the report for investigation.",
          },
        ],
        answerId: "assigned-safety-role",
        retry:
          "Use the job responsibility in §1107(b), not the person's seniority, employer alone, or the recipient's later decision.",
        explanation:
          "Section 1107(b) ties covered-employee status to responsibility for assessing, managing, or addressing risk of critical safety incidents. Nadia's assigned work meets that definition on the facts given.",
        sourceLabel: "California Labor Code §1107(b)",
        sourceHref: CALIFORNIA_LABOR_CODE,
        findingLine:
          "Person: Nadia is a covered employee because critical-safety-incident risk is part of her assigned work.",
      },
      {
        id: "subject",
        label: "Subject",
        prompt: "Which statement correctly identifies the reportable subject?",
        choices: [
          {
            id: "defined-catastrophic-risk",
            text: "Her reasonable-cause report describes a specific and substantial public danger arising from a catastrophic risk defined by the chapter.",
          },
          {
            id: "incident-only",
            text: "The chapter protects only reports made after deaths, injuries, or property losses have already occurred.",
          },
          {
            id: "all-safety-disputes",
            text: "Any disagreement about a frontier model's safety falls within the chapter, regardless of pathway or scale.",
          },
          {
            id: "violations-only",
            text: "The chapter protects legal violations but never a prospective public danger that is not yet independently unlawful.",
          },
          {
            id: "belief-removes-scope",
            text: "Reasonable belief removes the need for the information to concern one of the subjects identified in §1107.1(a).",
          },
        ],
        answerId: "defined-catastrophic-risk",
        retry:
          "Apply both parts of the rule: reasonable cause and a subject within §1107.1(a). The scenario supplies the chapter's scale and biological-risk pathway.",
        explanation:
          "Section 1107.1(a)(1) covers a reasonable-cause disclosure of a specific and substantial public danger resulting from catastrophic risk. Section 1107(a) supplies the scale and listed pathways.",
        sourceLabel: "California Labor Code §§1107(a), 1107.1(a)(1)",
        sourceHref: CALIFORNIA_LABOR_CODE,
        findingLine:
          "Subject: The reported biological-risk pathway and scale fall within the chapter's catastrophic-risk route.",
      },
      {
        id: "recipient",
        label: "Recipient",
        prompt: "Does Nadia have to report internally before going to the Attorney General?",
        choices: [
          {
            id: "direct-ag-route",
            text: "No. The Attorney General is an expressly named recipient, and §1107.1 does not make internal reporting a prerequisite.",
          },
          {
            id: "internal-first",
            text: "Yes. Protection begins only after the developer has received the report and missed a response deadline.",
          },
          {
            id: "oes-only",
            text: "Yes. All catastrophic-risk reports must first go to the Office of Emergency Services rather than the Attorney General.",
          },
          {
            id: "congress-explicit",
            text: "No, because §1107.1 expressly treats the Attorney General, any legislator, and the press as equivalent recipients.",
          },
          {
            id: "manager-permission",
            text: "Only if a manager with authority over Nadia gives permission for the external disclosure.",
          },
        ],
        answerId: "direct-ag-route",
        retry:
          "Read the recipient list in §1107.1(a). The internal process is an additional route, not a gate in front of the Attorney General.",
        explanation:
          "The Attorney General is named in §1107.1(a). The chapter also names specified internal recipients and a federal authority, but it does not require Nadia to use an internal channel first.",
        sourceLabel: "California Labor Code §1107.1(a), (c), and (e)",
        sourceHref: CALIFORNIA_LABOR_CODE,
        findingLine:
          "Recipient: Nadia may report directly to the Attorney General without first reporting to the developer.",
      },
      {
        id: "identity",
        label: "Identity protection",
        prompt: "What protection for Nadia's identity does this route establish?",
        choices: [
          {
            id: "external-gap",
            text: "SB 53 requires an anonymous internal process for large developers, but the chapter does not itself require the external Attorney General route to be anonymous or confidential.",
          },
          {
            id: "all-routes-anonymous",
            text: "Every recipient named in §1107.1(a) must accept the report anonymously and may never learn the reporter's identity.",
          },
          {
            id: "confidential-equals-anonymous",
            text: "Because the report is confidential, neither the receiving authority nor the developer can know who made it.",
          },
          {
            id: "nda-confidentiality",
            text: "The NDA itself supplies the confidentiality guarantee that is missing from the external reporting route.",
          },
          {
            id: "internal-immunity",
            text: "The anonymous internal process prevents a developer from inferring identity from access, timing, or the small number of people who knew the facts.",
          },
        ],
        answerId: "external-gap",
        retry:
          "Separate the anonymous internal process in §1107.1(e) from the external recipients in §1107.1(a). The AIWI/CARMA guide asks for both anonymity and confidentiality externally because the chapter does not specify them.",
        explanation:
          "The chapter requires an anonymous internal process at a large frontier developer. It does not impose an express anonymity or confidentiality rule on the external Attorney General route. AIWI/CARMA recommend both for receiving authorities.",
        sourceLabel:
          "California Labor Code §1107.1(e); AIWI/CARMA, Disclosure Channels and Agency Requirements",
        sourceHref: AIWI_GUIDE,
        findingLine:
          "Identity protection: The external route is legally available, but SB 53 does not itself supply the anonymity and confidentiality guarantees recommended by AIWI/CARMA.",
      },
      {
        id: "remedy",
        label: "NDA and remedy",
        prompt: "What follows from Nadia's NDA and the chapter's retaliation provisions?",
        choices: [
          {
            id: "scoped-contract-protection",
            text: "The developer may not use the contract to prevent this protected disclosure or retaliate for it; the chapter supplies fees, burden shifting, and possible injunctive relief.",
          },
          {
            id: "nda-void-everywhere",
            text: "The NDA is void in full, including provisions unrelated to protected reporting and disclosures to recipients outside the statute.",
          },
          {
            id: "truth-required",
            text: "Protection applies only if a later investigation proves every material allegation in the report to be true.",
          },
          {
            id: "damages-only",
            text: "Nadia has no route to interim relief and may seek damages only after a final judgment on the underlying catastrophic risk.",
          },
          {
            id: "reward-remedy",
            text: "The principal statutory remedy is a financial award calculated as a share of any penalty imposed on the developer.",
          },
        ],
        answerId: "scoped-contract-protection",
        retry:
          "Keep the contract rule within the protected disclosure defined by the chapter, then read the remedies in §1107.1(f)–(i).",
        explanation:
          "Sections 1107.1(a) and (b) prevent specified contracts from blocking protected disclosures. The chapter also provides attorney's fees, shifts the burden after a contributing-factor showing, and authorizes temporary or preliminary injunctive relief.",
        sourceLabel: "California Labor Code §1107.1(a), (b), and (f)–(i)",
        sourceHref: CALIFORNIA_LABOR_CODE,
        findingLine:
          "NDA and remedy: The contract cannot block this protected report; retaliation can trigger fees, burden shifting, and injunctive relief.",
      },
      {
        id: "investigator",
        label: "Competent investigator",
        prompt: "What does naming the Attorney General as a recipient establish?",
        choices: [
          {
            id: "recipient-not-capacity",
            text: "It establishes a protected destination, not that the office already has the technical expertise or a clear mandate to resolve a catastrophic-risk report without a legal violation.",
          },
          {
            id: "recipient-proves-capacity",
            text: "It establishes that the office has sufficient AI expertise, investigative access, and authority for every report within the chapter.",
          },
          {
            id: "court-investigates-risk",
            text: "It makes the court hearing any retaliation claim responsible for performing the technical catastrophic-risk investigation.",
          },
          {
            id: "monthly-update-external",
            text: "It gives Nadia the same mandatory monthly investigation updates that §1107.1 requires from a large developer's internal process.",
          },
          {
            id: "anonymity-equals-competence",
            text: "It establishes investigative competence as long as the intake system can accept an anonymous submission.",
          },
        ],
        answerId: "recipient-not-capacity",
        retry:
          "A legally permitted recipient, a protected identity, and an institution able to investigate are separate design questions.",
        explanation:
          "AIWI/CARMA recommend that receiving agencies have or can obtain technical AI expertise. Their SB 53 analysis separately identifies uncertainty about the Attorney General's mandate where the report alleges catastrophic risk but no legal violation.",
        sourceLabel:
          "AIWI/CARMA, Agency Requirements; Whistleblower Protections in SB 53, Executive Summary",
        sourceHref: AIWI_SB53,
        findingLine:
          "Competent investigator: The Attorney General is a protected recipient, but expertise and authority to act still require institutional design.",
      },
    ],
    resultTitle: "The legal route exists, but the protection chain is incomplete",
    result:
      "Nadia fits the covered-person definition, the subject falls within the catastrophic-risk route, the Attorney General is an authorized recipient, and the NDA cannot block this protected disclosure. The first unresolved condition is identity protection on the external route. The office's technical competence and authority to act are a second unresolved condition.",
    breakLabel: "First unresolved condition · identity protection",
  },
  {
    id: "evidence-path",
    eyebrow: "Case 2 · Evidence path",
    title: "A contractor supplies a work order",
    body:
      "An independent cooling contractor emails a verifier an original work order showing that Project Lattice added capacity for 1,024 accelerators over six weeks. The attachment bears project code PX-814. A utility allocation record obtained separately contains the same code and dates. The contractor installed cooling equipment but had no access to cluster workloads or model records.",
    steps: [
      {
        id: "preserve",
        label: "Preserve",
        prompt: "What should the receiving office do first with the report and attachment?",
        choices: [
          {
            id: "retain-original",
            text: "Retain the original message, attachment, and available metadata; open a case record; restrict and record access; and seek timely preservation of relevant records.",
          },
          {
            id: "summary-only",
            text: "Copy the allegation into an intake summary and discard the original message so the reporter cannot later be identified from metadata.",
          },
          {
            id: "wait-for-merits",
            text: "Wait until investigators decide the allegation is probably true before preserving records that may otherwise be deleted in ordinary operations.",
          },
          {
            id: "clean-reissue",
            text: "Ask the contractor to recreate the work order without metadata and treat the cleaner copy as the evidentiary original.",
          },
          {
            id: "wide-forwarding",
            text: "Forward the unredacted report to every organization that may hold relevant records before setting handling restrictions or a case identifier.",
          },
        ],
        answerId: "retain-original",
        retry:
          "Preservation comes before a merits decision. Keep the original submission and its context while limiting unnecessary exposure of the source.",
        explanation:
          "CIGIE requires accurate and complete case-file documentation and preservation of chain of custody. Early preservation protects records before routine deletion or deliberate alteration can remove them.",
        sourceLabel:
          "CIGIE Quality Standards for Investigations, Accurate and Complete Documentation; Collecting Evidence",
        sourceHref: CIGIE_QSI,
        findingLine:
          "Preserve: Keep the original submission and metadata, create the case record, log handling, and protect relevant records from loss.",
      },
      {
        id: "authenticate",
        label: "Authenticate",
        prompt: "What would authentication establish at this stage?",
        choices: [
          {
            id: "provenance-not-truth",
            text: "It would test the contractor's claimed access and the work order's origin and integrity; it would not establish that an unauthorized workload ran.",
          },
          {
            id: "reputation-authenticates",
            text: "A strong professional reputation would authenticate both the document and every inference the contractor draws from it.",
          },
          {
            id: "matching-code-proves-all",
            text: "The matching project code would authenticate the work order and prove the alleged workload without further records.",
          },
          {
            id: "signature-required",
            text: "Without a cryptographic signature, the work order cannot be authenticated by any combination of source access, counterpart records, or system metadata.",
          },
          {
            id: "company-certification-first",
            text: "The verifier must obtain management's certification that the work order is genuine before examining any other evidence.",
          },
        ],
        answerId: "provenance-not-truth",
        retry:
          "Separate provenance and integrity from the truth of the allegation. A genuine work order can still be misunderstood or selectively presented.",
        explanation:
          "CIGIE requires investigators to verify the validity of information and evidence. Here that means testing role, access, origin, and integrity. Authentication does not prove what workload used the installed capacity.",
        sourceLabel:
          "CIGIE Quality Standards for Investigations, Collecting Evidence",
        sourceHref: CIGIE_QSI,
        findingLine:
          "Authenticate: Test the contractor's access and the document's provenance and integrity without treating authenticity as proof of the allegation.",
      },
      {
        id: "investigate",
        label: "Investigate",
        prompt: "How should the office frame the investigation?",
        choices: [
          {
            id: "test-both-directions",
            text: "Define the allegation and applicable rule, then lawfully pursue records and accounts that could support, qualify, or contradict it.",
          },
          {
            id: "support-only",
            text: "Collect only material that supports the contractor because exculpatory evidence belongs in a later adversarial response.",
          },
          {
            id: "management-first",
            text: "Begin by sending the full report and source identity to implicated management so it can define the scope and select the records.",
          },
          {
            id: "finding-at-intake",
            text: "Record a compliance finding at intake, then use the investigation to calculate the appropriate response.",
          },
          {
            id: "source-fills-gap",
            text: "Ask the contractor to infer which model ran; an informed inference can replace workload records when the source lacks access to them.",
          },
        ],
        answerId: "test-both-directions",
        retry:
          "The investigation tests an allegation. It is not a search for support for a conclusion already recorded.",
        explanation:
          "CIGIE requires objective collection and analysis of both exculpatory and incriminating evidence. Complaint evaluation also asks whether to investigate, refer, or take no further action under the office's authority and priorities.",
        sourceLabel:
          "CIGIE Quality Standards for Investigations, Complaint Evaluation; Executing Investigations",
        sourceHref: CIGIE_QSI,
        findingLine:
          "Investigate: Define the allegation and rule, then seek both supporting and contradictory evidence through lawful, independent methods.",
      },
      {
        id: "corroborate",
        label: "Corroborate",
        prompt: "What does the utility record add, and what is still missing?",
        choices: [
          {
            id: "expansion-only",
            text: "It independently supports the project code, dates, and capacity expansion; scheduler, lineage, access, and authorization records are still needed to identify the workload and its status.",
          },
          {
            id: "workload-proved",
            text: "It proves that an unauthorized frontier-model training run consumed the added capacity during those dates.",
          },
          {
            id: "second-retelling",
            text: "A second contractor repeating the first contractor's account would add more independent weight than records held by the utility or provider.",
          },
          {
            id: "reward-cancels-record",
            text: "If the contractor may receive a reward, the matching utility record cannot corroborate any part of the account.",
          },
          {
            id: "no-workload-no-value",
            text: "Because the contractor lacked workload access, evidence of infrastructure expansion has no verification value and should be excluded.",
          },
        ],
        answerId: "expansion-only",
        retry:
          "Match the independent record to the fact it can test. A power allocation can support an expansion without identifying the code or model that later used it.",
        explanation:
          "Wasil et al. describe financial records and inspections as ways to test whistleblower claims. Their corroborative value remains claim-specific. Baker's Table 14 likewise separates personnel who know about infrastructure from personnel who know about AI activity and authorization.",
        sourceLabel:
          "Wasil et al., comparison table; Baker et al., Appendix A.8, Table 14",
        sourceHref: WASIL,
        findingLine:
          "Corroborate: The utility record supports the expansion. Workload, model lineage, access, and authorization remain unestablished.",
      },
      {
        id: "package",
        label: "Package",
        prompt: "What belongs in the evidentiary package?",
        choices: [
          {
            id: "scoped-record",
            text: "The allegation, source-access limits, authenticated items, handling record, independent support, contradictions, unresolved questions, applicable rule, and identity restrictions.",
          },
          {
            id: "conclusion-only",
            text: "Only the strongest bottom-line conclusion, because underlying contradictions and limits may confuse the decision-maker.",
          },
          {
            id: "identity-every-copy",
            text: "The reporter's identity in every copy so each recipient can make its own credibility judgment before reading the evidence.",
          },
          {
            id: "remove-exculpatory",
            text: "Supporting records and the allegation, with exculpatory or mitigating information held separately unless enforcement counsel requests it.",
          },
          {
            id: "attachments-only",
            text: "The original attachments without a statement of provenance, handling, scope, or which propositions each item can support.",
          },
        ],
        answerId: "scoped-record",
        retry:
          "A receiving verifier needs the evidence and its limits. CIGIE requires reports to be supported by the case file and to include relevant exculpatory and mitigating information.",
        explanation:
          "CIGIE requires accurate, complete, impartial reporting supported by case-file evidence. The package should preserve the distinction between what the source observed, what investigators established, and what remains unresolved.",
        sourceLabel:
          "CIGIE Quality Standards for Investigations, Reporting",
        sourceHref: CIGIE_QSI,
        findingLine:
          "Package: Send a supported, scoped record that includes provenance, handling, corroboration, contradictions, limits, and identity restrictions.",
      },
      {
        id: "pass",
        label: "Pass on",
        prompt: "What if the receiving office lacks authority over the suspected violation?",
        choices: [
          {
            id: "documented-referral",
            text: "Refer the matter promptly to an appropriate authority, preserve the record and handling restrictions, document the transfer, and retain the scoped case history required by policy.",
          },
          {
            id: "investigate-anyway",
            text: "Keep the matter and investigate it fully; receiving a protected report supplies any jurisdiction or access power the office lacks.",
          },
          {
            id: "return-to-company",
            text: "Return the original report to the developer and ask management to select an authority with the necessary jurisdiction.",
          },
          {
            id: "public-release",
            text: "Publish the evidentiary package so that whichever institution has authority can identify itself and take over.",
          },
          {
            id: "erase-local-record",
            text: "Delete the sending office's case record after transfer so there is only one copy and no competing chain of custody.",
          },
        ],
        answerId: "documented-referral",
        retry:
          "Authority does not arise from intake. Referral must preserve the record, the source restrictions, and accountability for the transfer.",
        explanation:
          "CIGIE's complaint-evaluation standard expressly includes referral to another appropriate authority. Its documentation and information-management requirements continue to govern how the sending office records and protects the transfer.",
        sourceLabel:
          "CIGIE Quality Standards for Investigations, Complaint Evaluation; Managing Investigative Information",
        sourceHref: CIGIE_QSI,
        findingLine:
          "Pass on: Make a documented referral to a competent, authorized body without losing the record, its restrictions, or the history of handling.",
      },
    ],
    resultTitle: "The report has become usable evidence, but only for a bounded claim",
    result:
      "The preserved and authenticated work order, independently matched to the utility record, supports the claim that Project Lattice expanded infrastructure at the stated time. It does not establish which workload ran or whether a rule was breached. The transmitted package must state that limit and identify the technical and governance records still required.",
  },
] as const;

export function reportingCase(id: ReportingCaseId): ReportingCase {
  return REPORTING_CASES.find((item) => item.id === id)!;
}
