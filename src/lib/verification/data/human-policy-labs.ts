
export type HumanPolicyLabId = "audits-inspections" | "institutions-judgment";

export interface HumanPolicyChoice {
  id: string;
  text: string;
}

export interface HumanPolicyStep {
  id: string;
  label: string;
  prompt: string;
  context?: string;
  choices: readonly HumanPolicyChoice[];
  answerId: string;
  retry: string;
  explanation: string;
  sourceLabel: string;
  sourceHref: string;
  findingLine: string;
}

export interface HumanPolicyPhase {
  id: string;
  label: string;
  steps: readonly HumanPolicyStep[];
}

export interface HumanPolicyLab {
  id: HumanPolicyLabId;
  eyebrow: string;
  title: string;
  instruction: string;
  caseTitle: string;
  caseBody: string;
  artifactTitle: string;
  artifactIntro: string;
  phases: readonly HumanPolicyPhase[];
}

const WASIL_INSPECTIONS = "https://arxiv.org/html/2408.16074v2#S6.SS2";
const WASIL_FUTURE = "https://arxiv.org/html/2408.16074v2#S1.SS2";
const BRUNDAGE_ASSURANCE = "https://arxiv.org/html/2601.11699v4#S5.SS3";
const BRUNDAGE_PRINCIPLES = "https://arxiv.org/html/2601.11699v4";
const OPCW_CHALLENGE =
  "https://www.opcw.org/chemical-weapons-convention/annexes/verification-annex/part-x-challenge-inspections-pursuant";
const BAKER_PERSONNEL = "https://arxiv.org/html/2507.15916#S4.SS3";

export const AUDITS_INSPECTIONS_LAB: HumanPolicyLab = {
  id: "audits-inspections",
  eyebrow: "Audits and inspections · 2.3.9",
  title: "Build the inspection order",
  instruction:
    "A power anomaly has raised a specific concern about Project Lattice. Choose the right mechanism, state what conclusions the available level of access allows, and write an inspection order that holds up against both evasion and a legitimate confidentiality objection.",
  caseTitle: "Project Lattice",
  caseBody:
    "A declared data center reports no training run above the treaty threshold. Independently obtained power-allocation and procurement records show a six-week expansion under the same project code. The records identify a facility and time period but not the workload. The agreement permits periodic inspections and a short-notice inspection when a specific concern cannot be resolved through consultation.",
  artifactTitle: "Inspection order and bounded finding",
  artifactIntro:
    "The completed file separates the purpose of each mechanism, the maximum conclusion supported by each access condition, and the terms that make managed access an evidentiary accommodation rather than a veto.",
  phases: [
    {
      id: "purpose",
      label: "Purpose",
      steps: [
        {
          id: "independent-audit",
          label: "Independent audit",
          prompt: "Which job belongs to an independent audit?",
          context:
            "A developer is preparing a deployment and asks a qualified third party to test specified safety claims and assess company practices against an agreed standard.",
          choices: [
            {
              id: "audit-standard",
              text: "Evaluate specified systems and organizational practices against a standard and verify the claims within the engagement's stated scope.",
            },
            {
              id: "audit-inventory",
              text: "Repeat a treaty inventory count at every declared facility on the ordinary inspection calendar.",
            },
            {
              id: "audit-allegation",
              text: "Compel short-notice access to any site named in a state allegation, whether or not the audit contract permits it.",
            },
            {
              id: "audit-adjudicate",
              text: "Issue the legally binding compliance judgment and impose the treaty response at the end of the engagement.",
            },
          ],
          answerId: "audit-standard",
          retry:
            "Keep assessment separate from recurring treaty verification, challenge access, and legal adjudication.",
          explanation:
            "Brundage et al. define an audit as systematic third-party evaluation and verification against claims and standards. Its authority and conclusion remain bounded by the engagement.",
          sourceLabel: "Brundage et al., §§2 and 5",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Independent audit: tests defined claims and practices against a standard within a stated engagement scope.",
        },
        {
          id: "routine-inspection",
          label: "Routine inspection",
          prompt: "Which job belongs to a routine inspection?",
          context:
            "No anomaly has been reported. The agreement requires recurring confirmation of declared chip inventories, seals, records, and facility controls.",
          choices: [
            {
              id: "routine-declarations",
              text: "Confirm declarations and recurring obligations on a schedule that applies without a new allegation.",
            },
            {
              id: "routine-fraud",
              text: "Rule out undeclared activity everywhere because all declared sites passed their scheduled checks.",
            },
            {
              id: "routine-emergency",
              text: "Resolve a new, site-specific noncompliance concern before evidence can be altered by replacing the ordinary schedule with no-notice access.",
            },
            {
              id: "routine-certify-company",
              text: "Certify the organization's entire risk profile after confirming the inventory at one declared facility.",
            },
          ],
          answerId: "routine-declarations",
          retry:
            "Routine access checks declared objects and recurring duties. Passing it does not establish completeness beyond its route.",
          explanation:
            "Wasil et al. describe periodic on-site inspections as a way to examine declared facilities, identifiers, logs, inventories, and controls. Predictable checks are not a substitute for a route triggered by a specific concern.",
          sourceLabel: "Wasil et al., On-site inspections of data centers",
          sourceHref: WASIL_INSPECTIONS,
          findingLine:
            "Routine inspection: checks declarations and recurring obligations on an agreed calendar; it does not rule out undeclared activity elsewhere.",
        },
        {
          id: "challenge-inspection",
          label: "Challenge inspection",
          prompt: "What is the proper inspection route for Project Lattice?",
          choices: [
            {
              id: "challenge-specific-concern",
              text: "Use the short-notice challenge route to clarify the specific facility, period, project code, and possible threshold violation identified by the anomaly.",
            },
            {
              id: "challenge-punishment",
              text: "Treat the challenge inspection as punishment: its initiation itself establishes that the facility violated the threshold.",
            },
            {
              id: "routine-only",
              text: "Wait for the next routine visit because a challenge inspection is appropriate only after the underlying violation has already been proved.",
            },
            {
              id: "audit-contract",
              text: "Commission a voluntary corporate audit and allow the developer to define which project records are relevant to the anomaly.",
            },
          ],
          answerId: "challenge-specific-concern",
          retry:
            "A challenge inspection tests a concrete concern. It is neither a sanction nor something that waits for proof of the fact it is meant to investigate.",
          explanation:
            "Wasil et al. identify short-notice challenge inspections as a response to suspected noncompliance. The OPCW precedent limits the mandate to clarifying the concern stated in the request.",
          sourceLabel: "Wasil et al.; OPCW Verification Annex, Part X",
          sourceHref: OPCW_CHALLENGE,
          findingLine:
            "Challenge inspection: Project Lattice supplies a specific concern and evidentiary target for short-notice access, not a pre-judged violation.",
        },
      ],
    },
    {
      id: "access",
      label: "Access ceiling",
      steps: [
        {
          id: "black-box",
          label: "Black-box",
          prompt: "What may an auditor conclude from black-box access?",
          context:
            "The auditor can send inputs to the candidate model through an API and observe outputs under the tested settings. No training, compute, deployment, or governance records are available.",
          choices: [
            {
              id: "tested-behavior",
              text: "Describe model behavior under the tested inputs and settings, while leaving training history, internal deployment, compute use, and management decisions unresolved.",
            },
            {
              id: "general-company",
              text: "Conclude that the developer's safety program is effective because the public model behaved safely in the test.",
            },
            {
              id: "no-hidden-model",
              text: "Rule out a less restricted internal model because the tested endpoint showed no prohibited behavior.",
            },
            {
              id: "compute-from-output",
              text: "Verify the training-compute declaration from the observed outputs without records from the training process.",
            },
          ],
          answerId: "tested-behavior",
          retry:
            "Tie the conclusion to the system, settings, inputs, and period actually observed.",
          explanation:
            "Brundage et al. warn against abstraction errors: behavior of one exposed system does not establish organization-level facts or the properties of systems the auditor could not see.",
          sourceLabel: "Brundage et al., §§5.2–5.3",
          sourceHref: BRUNDAGE_ASSURANCE,
          findingLine:
            "Black-box ceiling: supports a behavioral statement about the tested system and conditions, not a claim about training history or the organization as a whole.",
        },
        {
          id: "gray-box",
          label: "Gray-box",
          prompt: "What changes when selected non-public evidence is added?",
          context:
            "The auditor receives an unredacted safety case, selected scheduler extracts, privileged interfaces, and interviews with several functions, but the company determines the initial record set and the auditor cannot pursue new areas without consent.",
          choices: [
            {
              id: "selected-claims",
              text: "Test more technical and organizational claims, while stating that omitted systems, records, and deliberate selection remain outside the assurance provided.",
            },
            {
              id: "selection-neutral",
              text: "Treat the evidence as independent because it is non-public, even though the company chose what the auditor could inspect.",
            },
            {
              id: "fraud-ruled-out",
              text: "Rule out deliberate deception once at least one unredacted internal document and one staff interview have been obtained.",
            },
            {
              id: "treaty-grade",
              text: "Issue treaty-grade confirmation of the company's full risk profile because gray-box access goes beyond public testing.",
            },
          ],
          answerId: "selected-claims",
          retry:
            "More evidence widens the supported claim, but selection and follow-up rights still determine what can be ruled out.",
          explanation:
            "Brundage et al. associate gray-box access, extensive documentation, monitoring, and cross-functional interviews with greater assurance, while reserving deception-resistant claims for substantially higher access levels.",
          sourceLabel: "Brundage et al., §5.3.3",
          sourceHref: BRUNDAGE_ASSURANCE,
          findingLine:
            "Gray-box ceiling: supports selected system and practice claims, but cannot rule out omitted evidence or active deception when the auditee controls selection and follow-up.",
        },
        {
          id: "deep-access",
          label: "Deep access",
          prompt: "What can deep access add—and what limit remains?",
          context:
            "The team may inspect relevant model internals, training processes, compute allocation, incident and governance records, and conduct private cross-functional interviews. It may follow emerging concerns within the mandate.",
          choices: [
            {
              id: "organization-bounded",
              text: "Support organization-level and historical conclusions within the defined entities, systems, claims, and period, while stating residual limits and validity conditions.",
            },
            {
              id: "universal-certification",
              text: "Certify all future systems and affiliates because deep access removes the need for scope and expiry conditions.",
            },
            {
              id: "access-equals-truth",
              text: "Accept management's account once broad access is offered, because willingness to cooperate is evidence that the records are complete.",
            },
            {
              id: "no-technical-evidence",
              text: "Replace technical and physical evidence with interviews because deep access makes human evidence sufficient for every operational fact.",
            },
          ],
          answerId: "organization-bounded",
          retry:
            "Deep access raises the ceiling; it does not erase the engagement's entities, period, assumptions, or changing systems.",
          explanation:
            "Higher assurance requires wider access and fewer assumptions, but Brundage et al. still require explicit scope, reasoning, validity conditions, and renewed assessment when systems change.",
          sourceLabel: "Brundage et al., Executive Summary and §5.3",
          sourceHref: BRUNDAGE_ASSURANCE,
          findingLine:
            "Deep-access ceiling: can support scoped organization-level and historical findings, subject to completeness, stated assumptions, and expiry conditions.",
        },
      ],
    },
    {
      id: "mandate",
      label: "Mandate",
      steps: [
        {
          id: "scope-rights",
          label: "Scope and rights",
          prompt:
            "Which clause gives the team a usable scope and access right?",
          choices: [
            {
              id: "defined-scope-rights",
              text: "Cover the named models, facility, affiliates and contractor-held systems for the relevant period; authorize record review, system access, sampling, copying or log export, and private staff interviews as necessary to test the concern.",
            },
            {
              id: "main-site-tour",
              text: "Permit a tour of the main facility and review of any materials management considers relevant to the concern.",
            },
            {
              id: "unbounded-search",
              text: "Authorize collection of any information at any affiliated entity, whether or not it bears on the stated concern.",
            },
            {
              id: "documents-only",
              text: "Limit access to written policies because system access and private interviews would make the inspection more intrusive.",
            },
          ],
          answerId: "defined-scope-rights",
          retry:
            "The mandate needs both a bounded object and concrete powers to obtain evidence from every actor holding material records.",
          explanation:
            "The OPCW precedent ties intrusive powers to a specified concern and necessary methods. Wasil's AI inspections require access to hardware, logs, records, code, safeguards, and personnel depending on the claim.",
          sourceLabel: "OPCW Part X, paras. 4, 33–45; Wasil et al.",
          sourceHref: OPCW_CHALLENGE,
          findingLine:
            "Scope and rights: reach the named systems, entities, records, sites, and period, with powers matched to the evidentiary question.",
        },
        {
          id: "preservation-confidentiality",
          label: "Preservation and protection",
          prompt:
            "Which clause preserves evidence without treating confidentiality as an afterthought?",
          choices: [
            {
              id: "binding-preservation",
              text: "From notice, prohibit alteration or deletion of relevant records held by the developer, affiliates, and contractors; use vetted personnel, secure on-site review, purpose limits, restricted copying, and recorded handling for sensitive material.",
            },
            {
              id: "best-efforts",
              text: "Ask the developer to use best efforts not to delete records and promise generally that inspectors will respect trade secrets.",
            },
            {
              id: "copy-everything",
              text: "Copy all systems and records into the verifier's ordinary files so that no evidence can be lost, including unrelated national-security and customer data.",
            },
            {
              id: "destroy-sensitive",
              text: "Allow the developer to delete sensitive records before the visit as long as it provides a written summary of their subject matter.",
            },
          ],
          answerId: "binding-preservation",
          retry:
            "Preservation must bind every relevant holder; sensitive-information controls must be specific enough to operate during collection and review.",
          explanation:
            "A workable mandate prevents loss of evidence while controlling who sees sensitive material, where review occurs, what may be copied, and how it may be used. Brundage et al. call for deep but secure access; OPCW limits collection and retention to relevant facts.",
          sourceLabel: "Brundage et al., Access; OPCW Part X, paras. 44–48",
          sourceHref: OPCW_CHALLENGE,
          findingLine:
            "Preservation and protection: bind relevant record holders at notice and pair collection with vetted access, secure handling, purpose limits, and restricted retention.",
        },
        {
          id: "refusal",
          label: "Delay or refusal",
          prompt:
            "Which clause gives refusal a defined consequence without inventing proof?",
          choices: [
            {
              id: "document-escalate",
              text: "Set access deadlines and an alternative-access process; document unresolved refusal; permit a finding on the access duty and the escalation authorized by the agreement, without automatically treating refusal as proof of the concealed workload.",
            },
            {
              id: "automatic-substance",
              text: "Any delayed response conclusively proves that the prohibited training run occurred and triggers the maximum sanction.",
            },
            {
              id: "negotiate-forever",
              text: "Continue negotiating alternatives without a deadline because any consequence for refusal would compromise managed access.",
            },
            {
              id: "omit-consequence",
              text: "Leave refusal to be handled as appropriate by the inspection team so that the parties retain maximum flexibility.",
            },
          ],
          answerId: "document-escalate",
          retry:
            "Separate breach of an access obligation from proof of the underlying activity, then identify the authorized route for each.",
          explanation:
            "OPCW managed access requires alternative means to clarify the concern when full access is withheld. A mandate should record and escalate failure to meet the access duty, but the substantive inference depends on the governing agreement.",
          sourceLabel: "OPCW Part X, paras. 38–50",
          sourceHref: OPCW_CHALLENGE,
          findingLine:
            "Refusal: apply deadlines, alternative access, documentation, and authorized escalation; distinguish an access breach from proof of the suspected run.",
        },
      ],
    },
    {
      id: "managed-access",
      label: "Managed access",
      steps: [
        {
          id: "same-question",
          label: "Alternative access",
          prompt:
            "Which arrangement protects model and customer secrets while preserving the verification question?",
          context:
            "The inspection must determine whether Project Lattice used more than the permitted compute. The developer refuses to export raw scheduler logs because they contain customer names and workload details.",
          choices: [
            {
              id: "vetted-query",
              text: "Let a vetted subset inspect the raw logs on site through a read-only query that exposes chip allocation, timestamps, and integrity data for the relevant period while masking unrelated customer fields; preserve the query and audit trail.",
            },
            {
              id: "company-summary",
              text: "Accept a company-produced summary stating that no job exceeded the threshold because it avoids disclosure of all proprietary information.",
            },
            {
              id: "no-access",
              text: "Withdraw the request whenever records contain mixed sensitive and relevant data because confidentiality takes precedence over verification.",
            },
            {
              id: "public-dump",
              text: "Require publication of the full raw logs so outside observers can independently check every workload and customer record.",
            },
          ],
          answerId: "vetted-query",
          retry:
            "A managed alternative is adequate only if it answers the same compute-allocation question with evidence the inspected party does not control alone.",
          explanation:
            "Wasil et al. allow limited access sufficient to test the prohibited activity without revealing the underlying task. Brundage et al. propose on-site access by a restricted team. OPCW managed access protects unrelated information while requiring alternative means to clarify the concern.",
          sourceLabel: "Wasil et al.; Brundage et al.; OPCW Part X",
          sourceHref: OPCW_CHALLENGE,
          findingLine:
            "Managed access: mask unrelated fields and restrict personnel, location, copying, and use—but preserve independent access to the allocation evidence needed to answer the same question.",
        },
      ],
    },
  ],
};

export const INSTITUTIONS_JUDGMENT_LAB: HumanPolicyLab = {
  id: "institutions-judgment",
  eyebrow: "Institutions and policy judgment · 2.3.10",
  title: "Audit the verifier",
  instruction:
    "Assess the institution before relying on its finding. Then separate what the human record establishes from what still requires technical or physical evidence, and match each decision to its legal and evidentiary threshold.",
  caseTitle: "The International AI Verification Office",
  caseBody:
    "The Office is examining Project Lattice. Two engineers independently report that management approved a concealed run after receiving a safety warning. Authenticated messages show the warning reached the relevant executives. Power and procurement records corroborate the project code and dates. The developer refuses raw scheduler logs and chip inventory, although the treaty mandate expressly requires both. A council—not the Office—has authority to impose sanctions.",
  artifactTitle: "Institutional assessment and response record",
  artifactIntro:
    "The record identifies institutional weaknesses, names the mechanism of capture, preserves the boundary between organizational and operational facts, and assigns separate decisions to investigation, compliance, and enforcement.",
  phases: [
    {
      id: "institution",
      label: "Institution",
      steps: [
        {
          id: "independence",
          label: "Independence",
          prompt: "What makes this audit arrangement insufficiently independent?",
          context:
            "The developer selects the audit provider from an unrestricted list, negotiates the scope, pays a renewable annual fee, and may block publication by ending the engagement.",
          choices: [
            {
              id: "commercial-dependence",
              text: "The provider's future income, scope, and ability to publish depend on the auditee whose claims it must test.",
            },
            {
              id: "formal-third-party",
              text: "Independence is adequate because the provider is legally incorporated separately from the developer.",
            },
            {
              id: "expertise-cures",
              text: "Technical expertise cures the financial and publication conflict because a capable auditor will recognize manipulation.",
            },
            {
              id: "disclose-after",
              text: "The conflict is immaterial if the provider discloses the payment relationship after publishing a favorable report.",
            },
          ],
          answerId: "commercial-dependence",
          retry:
            "Ask what happens to fees, access, scope, and publication when the auditor reaches an unwelcome conclusion.",
          explanation:
            "Brundage et al. call for disclosed financial relationships, standardized terms that prevent auditor shopping, cooling-off periods, and payment models that reduce dependence on auditees.",
          sourceLabel: "Brundage et al., Independent experts",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Independence: deficient when the auditee controls selection, renewal, scope, or publication and an unfavorable finding threatens future income.",
        },
        {
          id: "competence",
          label: "Competence",
          prompt: "What competence does the Project Lattice inquiry require?",
          context:
            "The assigned team consists entirely of model evaluators. It has no compute-accounting, data-center, forensic interviewing, evidence-handling, or treaty-law expertise.",
          choices: [
            {
              id: "multidisciplinary-gap",
              text: "The team cannot credibly resolve the inquiry without adding the disciplines needed to interpret infrastructure, records, interviews, evidence integrity, and the governing obligation.",
            },
            {
              id: "model-eval-enough",
              text: "Model-evaluation expertise is sufficient because every frontier-AI compliance question ultimately concerns model behavior.",
            },
            {
              id: "lawyers-only",
              text: "Treaty lawyers can resolve the factual dispute from the text of the access obligation without technical or investigative specialists.",
            },
            {
              id: "hire-after",
              text: "Specialist competence matters only after the Office has already issued its factual finding and needs to defend it on appeal.",
            },
          ],
          answerId: "multidisciplinary-gap",
          retry:
            "List the factual and legal questions in the case, then ask whether one discipline can answer all of them.",
          explanation:
            "Brundage et al. recommend multidisciplinary teams, subcontracting, or consortia when one audit organization lacks the required breadth.",
          sourceLabel: "Brundage et al., Independent experts",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Competence: must match the claim across AI evaluation, compute and facility operations, investigation, evidence handling, security, and law.",
        },
        {
          id: "accountability",
          label: "Accountability",
          prompt:
            "Which arrangement makes the Office accountable without giving the auditee a veto?",
          choices: [
            {
              id: "review-without-veto",
              text: "Disclose methods and conflicts where possible, keep a traceable case file, use independent quality review, and allow correction of factual errors without permitting suppression of conclusions.",
            },
            {
              id: "secret-no-review",
              text: "Keep methods, conflicts, and quality controls secret because any external review would compromise sensitive information.",
            },
            {
              id: "auditee-approval",
              text: "Require the developer to approve the final wording so procedural fairness prevents reputational harm.",
            },
            {
              id: "public-raw",
              text: "Publish every raw record and source identity so the public can reproduce the investigation without relying on institutional review.",
            },
          ],
          answerId: "review-without-veto",
          retry:
            "Accountability needs traceability, quality control, and correction of error; it does not require either total secrecy or auditee control.",
          explanation:
            "Brundage et al. pair rigorous, traceable methods with procedural fairness: companies may correct factual errors but should not exert undue influence over conclusions.",
          sourceLabel: "Brundage et al., Rigor and Clarity",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Accountability: requires traceable methods, conflict disclosure, independent quality review, and a factual-correction process that does not become a publication veto.",
        },
        {
          id: "authority",
          label: "Authority",
          prompt: "What does the Office's authority permit it to do?",
          context:
            "The treaty authorizes the Office to compel records, conduct inspections, and issue compliance findings. Only the council may impose sanctions.",
          choices: [
            {
              id: "split-authority",
              text: "The Office may investigate and make the authorized compliance finding; enforcement requires a separate council decision under the treaty.",
            },
            {
              id: "office-sanctions",
              text: "Any institution able to obtain evidence has inherent authority to impose proportionate sanctions without a council decision.",
            },
            {
              id: "no-finding",
              text: "Because it cannot sanction, the Office may collect evidence but cannot issue a compliance finding.",
            },
            {
              id: "council-investigates",
              text: "The council's enforcement authority makes the Office's investigative mandate unnecessary; the council should determine the facts itself.",
            },
          ],
          answerId: "split-authority",
          retry:
            "Separate collection and assessment, the compliance judgment, and the institution authorized to order a response.",
          explanation:
            "Wasil et al. identify institutional powers and handling noncompliance as separate design questions. Evidence access does not create enforcement authority by implication.",
          sourceLabel: "Wasil et al., Future directions",
          sourceHref: WASIL_FUTURE,
          findingLine:
            "Authority: the Office may compel, investigate, and find compliance only as the treaty provides; sanctions remain with the council.",
        },
        {
          id: "access",
          label: "Access",
          prompt:
            "What does the current access condition do to the Office's finding?",
          context:
            "Management supplies summaries and selected interviewees but withholds raw scheduler logs, chip inventory, and private staff contact.",
          choices: [
            {
              id: "access-caps-finding",
              text: "It caps the substantive finding because the auditee controls the evidentiary frame and the operational facts cannot be checked directly.",
            },
            {
              id: "summaries-sufficient",
              text: "It provides deep access because the summaries cover every category named in the mandate.",
            },
            {
              id: "cooperation-signal",
              text: "It supports a favorable finding because supplying any non-public information demonstrates good-faith cooperation.",
            },
            {
              id: "human-replaces-logs",
              text: "It has no effect because interviews can substitute for scheduler logs and inventory in proving the workload and compute threshold.",
            },
          ],
          answerId: "access-caps-finding",
          retry:
            "Formal authority is not actual access. Ask who selected the evidence and whether the disputed operational fact can be checked from it.",
          explanation:
            "Brundage et al. distinguish independent status from access adequate to support the claim. Company-selected summaries and interviewees leave an informational dependency intact.",
          sourceLabel: "Brundage et al., §§2 and 5.3",
          sourceHref: BRUNDAGE_ASSURANCE,
          findingLine:
            "Access: management-selected summaries and interviewees do not support a deep finding when raw operational evidence and private contact are withheld.",
        },
      ],
    },
    {
      id: "capture",
      label: "Capture",
      steps: [
        {
          id: "financial-capture",
          label: "Financial",
          prompt: "Which fact is financial capture?",
          choices: [
            {
              id: "renewal-fee",
              text: "A favorable result protects a renewable auditee-paid fee and future engagements.",
            },
            {
              id: "curated-records",
              text: "Management chooses the records and interviewees that define the inquiry.",
            },
            {
              id: "normal-assumptions",
              text: "Staff adopt the developer's view of which safety problems are normal and not worth escalating.",
            },
            {
              id: "minister-delay",
              text: "A minister delays publication to protect a diplomatic agreement.",
            },
          ],
          answerId: "renewal-fee",
          retry:
            "Identify the pressure operating through money and future work.",
          explanation:
            "Financial capture changes the verifier's incentives through fees, renewal, funding, appointment, or future employment.",
          sourceLabel: "Brundage et al., Independent experts",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Financial capture: revenue or future work depends on avoiding a finding that displeases the auditee or funder.",
        },
        {
          id: "informational-capture",
          label: "Informational",
          prompt: "Which fact is informational capture?",
          choices: [
            {
              id: "curated-records",
              text: "Management chooses the records, systems, interviewees, and initial questions that define what the verifier can see.",
            },
            {
              id: "renewal-fee",
              text: "The provider relies on a renewable fee from the audited company.",
            },
            {
              id: "shared-culture",
              text: "Inspectors come to regard the developer's risk tolerance as the natural professional baseline.",
            },
            {
              id: "foreign-policy",
              text: "The government suppresses a finding that could damage its strategic relationship with another state.",
            },
          ],
          answerId: "curated-records",
          retry:
            "Look for control over the facts, questions, and people entering the evidentiary frame.",
          explanation:
            "Informational capture persists even when the verifier is formally outside the company: the regulated party can still determine what becomes knowable.",
          sourceLabel: "Brundage et al., Access and Independence",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Informational capture: the auditee controls the evidentiary frame by selecting records, systems, interviewees, and questions.",
        },
        {
          id: "cultural-capture",
          label: "Cultural",
          prompt: "Which fact is cultural capture?",
          choices: [
            {
              id: "adopted-baseline",
              text: "Through repeated staffing exchanges and socialization, the verifier adopts the developer's assumptions about what counts as normal, serious, or worth investigating.",
            },
            {
              id: "record-selection",
              text: "The developer withholds raw logs and offers a summary instead.",
            },
            {
              id: "budget-cut",
              text: "The auditee threatens to move its paid engagement to another provider.",
            },
            {
              id: "cabinet-order",
              text: "The cabinet orders the Office to avoid a finding during treaty negotiations.",
            },
          ],
          answerId: "adopted-baseline",
          retry:
            "Cultural capture changes the verifier's professional frame, not only its access, funding, or formal instructions.",
          explanation:
            "A verifier can remain formally independent while internalizing the regulated organization's categories, urgency, and tolerance for weak evidence.",
          sourceLabel: "Brundage et al., §§4.1 and 5",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Cultural capture: the institution internalizes the auditee's assumptions about normal practice and the seriousness of possible failure.",
        },
        {
          id: "political-capture",
          label: "Political",
          prompt: "Which fact is political capture?",
          choices: [
            {
              id: "minister-suppression",
              text: "A minister narrows or delays the finding to protect a government, company, or diplomatic relationship.",
            },
            {
              id: "staff-norms",
              text: "Inspectors absorb the developer's professional norms through repeated collaboration.",
            },
            {
              id: "fee-pressure",
              text: "A provider fears losing an annual audit fee after an adverse conclusion.",
            },
            {
              id: "evidence-menu",
              text: "Management chooses which documents the investigators may inspect.",
            },
          ],
          answerId: "minister-suppression",
          retry:
            "Identify direct pressure serving governmental or diplomatic interests.",
          explanation:
            "Political capture operates through appointment, direction, delay, scope restriction, or suppression for political rather than evidentiary reasons.",
          sourceLabel: "Brundage et al., Independent experts",
          sourceHref: BRUNDAGE_PRINCIPLES,
          findingLine:
            "Political capture: officials alter scope, timing, or conclusions to protect governmental, corporate, or diplomatic interests.",
        },
      ],
    },
    {
      id: "evidence",
      label: "Evidence boundary",
      steps: [
        {
          id: "human-establishes",
          label: "Human record",
          prompt: "What can the human and documentary record establish here?",
          context:
            "The engineers had access to the decision process, gave independent accounts, and produced authenticated contemporaneous messages showing the warning reached the executives.",
          choices: [
            {
              id: "knowledge-authorization",
              text: "That the warning reached the named executives and that management discussed or authorized the project as the messages record, subject to the defined people and period.",
            },
            {
              id: "exact-compute",
              text: "The exact compute used by the workload, because the engineers participated in the decision process.",
            },
            {
              id: "all-implementation",
              text: "That every operational instruction was carried out exactly as authorized, because the approval record is authenticated.",
            },
            {
              id: "no-hidden-activity",
              text: "That no other concealed project existed, because two sources independently described Project Lattice.",
            },
          ],
          answerId: "knowledge-authorization",
          retry:
            "Human evidence is strongest on organizational knowledge, decision, warning, staging, and intent—not automatic proof of machine activity.",
          explanation:
            "Baker et al. map personnel to the violations they can observe while emphasizing compartmentalization and collusion. Authentication and independent accounts support the organizational fact, not facts outside those sources' access.",
          sourceLabel: "Baker et al., §4.3",
          sourceHref: BAKER_PERSONNEL,
          findingLine:
            "Human-mechanism finding: authenticated messages and independent sources can establish who received the warning and what management decided within the observed process.",
        },
        {
          id: "technical-required",
          label: "Operational fact",
          prompt: "What still requires technical or physical evidence?",
          choices: [
            {
              id: "workload-threshold",
              text: "Whether the run occurred as described, which workload executed, which chips participated, and whether total compute crossed the treaty threshold.",
            },
            {
              id: "executive-received",
              text: "Whether the executives received the warning shown in their authenticated message thread.",
            },
            {
              id: "source-role",
              text: "Whether the engineers held the roles confirmed by personnel and access records.",
            },
            {
              id: "retaliation-threat",
              text: "Whether a manager threatened a reporter in a recorded meeting corroborated by an independent witness.",
            },
          ],
          answerId: "workload-threshold",
          retry:
            "Separate the organizational decision from execution, hardware participation, workload identity, and measured compute.",
          explanation:
            "Wasil et al. require facility access, chip identifiers, activity logs, training records, and related technical measures to test operational AI-development claims. Human evidence can direct that inquiry but not replace it.",
          sourceLabel: "Wasil et al., Access-dependent methods",
          sourceHref: WASIL_INSPECTIONS,
          findingLine:
            "Technical/physical requirement: scheduler and activity logs, chip inventory, and facility evidence must establish execution, workload identity, participating hardware, and compute.",
        },
      ],
    },
    {
      id: "response",
      label: "Response",
      steps: [
        {
          id: "investigation-threshold",
          label: "Investigation",
          prompt:
            "What decision is supported before the withheld logs are obtained?",
          choices: [
            {
              id: "open-investigation",
              text: "Open or continue a focused investigation and preserve evidence: the concern is specific, plausible, partly corroborated, and points to records capable of resolving it.",
            },
            {
              id: "substantive-compliance",
              text: "Find the training prohibition violated because the sources and power record together prove the workload and compute threshold.",
            },
            {
              id: "enforce-now",
              text: "Impose sanctions immediately because delay would reward concealment, even though the council has not acted and the operational fact is unresolved.",
            },
            {
              id: "close-case",
              text: "Close the matter because evidence insufficient for enforcement is necessarily insufficient for investigation.",
            },
          ],
          answerId: "open-investigation",
          retry:
            "The investigation threshold is intentionally lower than the compliance and enforcement thresholds.",
          explanation:
            "A specific corroborated allegation with an identifiable evidence path justifies preservation and investigation before the evidence supports a final substantive judgment.",
          sourceLabel: "Baker et al., personnel layer; Wasil et al.",
          sourceHref: BAKER_PERSONNEL,
          findingLine:
            "Investigation: justified by a specific, plausible, partly corroborated concern and a realistic path to resolving evidence.",
        },
        {
          id: "compliance-threshold",
          label: "Compliance finding",
          prompt:
            "What compliance finding does the documented refusal support?",
          context:
            "The treaty expressly requires scheduler logs and chip inventory. The Office issued a valid demand, offered managed access, and the deadline expired without production.",
          choices: [
            {
              id: "access-breach",
              text: "Find breach of the access and cooperation obligation, while recording that the underlying training-run allegation remains a separate unresolved question.",
            },
            {
              id: "run-proved",
              text: "Find both the access breach and the prohibited run proved because refusal necessarily means the logs are incriminating.",
            },
            {
              id: "no-finding-until-run",
              text: "Issue no compliance finding until the Office proves the underlying run; access duties cannot be breached independently.",
            },
            {
              id: "office-sanction",
              text: "Treat the access finding as the Office's authority to impose whatever enforcement measure it considers proportionate.",
            },
          ],
          answerId: "access-breach",
          retry:
            "Identify the obligation whose facts are already established, and keep it separate from the concealed conduct the records were meant to test.",
          explanation:
            "A valid demand, an express duty, managed alternatives, and documented refusal can establish noncompliance with access. Whether refusal proves the underlying activity depends on a separate inference rule in the agreement.",
          sourceLabel: "OPCW managed-access precedent; Wasil et al.",
          sourceHref: OPCW_CHALLENGE,
          findingLine:
            "Compliance finding: the documented refusal establishes breach of the express access duty; it does not by itself establish the prohibited run.",
        },
        {
          id: "enforcement-threshold",
          label: "Enforcement",
          prompt: "When is enforcement justified?",
          choices: [
            {
              id: "authority-process",
              text: "When an authorized trigger or valid compliance finding exists and the council applies the treaty's authority, required process, proportionality, and urgency rules.",
            },
            {
              id: "strong-suspicion",
              text: "Whenever investigators hold a strong suspicion, even if the treaty assigns sanctions elsewhere and no compliance process has concluded.",
            },
            {
              id: "auditor-recommends",
              text: "Whenever an independent auditor recommends sanctions, because independence supplies enforcement authority.",
            },
            {
              id: "automatic-maximum",
              text: "Automatically at the maximum level after any access delay so that enforcement remains deterrent.",
            },
          ],
          answerId: "authority-process",
          retry:
            "Evidence strength, legal authority, decision process, and proportionality are separate conditions for enforcement.",
          explanation:
            "Wasil et al. identify institutional powers, handling noncompliance, and proportionate enforcement as distinct design questions. A verifier's finding can trigger but does not itself create the authorized response.",
          sourceLabel: "Wasil et al., Future directions",
          sourceHref: WASIL_FUTURE,
          findingLine:
            "Enforcement: requires an authorized trigger or valid finding, the designated decision-maker, required process, and a proportionate response—not suspicion alone.",
        },
      ],
    },
  ],
};

export const HUMAN_POLICY_LABS: readonly HumanPolicyLab[] = [
  AUDITS_INSPECTIONS_LAB,
  INSTITUTIONS_JUDGMENT_LAB,
];
