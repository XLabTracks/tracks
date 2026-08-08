/* GENERATED FILE - do not edit by hand.
   Source: src/content/verification/curriculum.ts
   Regenerate: npm run verification:course

   The course exists once, in the content graph. This is the copy the
   no-build static site reads to draw its track page, skill map and guide.
   It carries structure only - no prose. Each unit's href points at the
   app, which owns the reading. */
window.COURSE = {
  "id": "verification",
  "modules": [
    {
      "n": 0,
      "slug": "foundations",
      "title": "Foundations",
      "glyph": "✧",
      "week": "week 1",
      "status": "drafted",
      "goal": "Why are we teaching this?",
      "summary": "The oldest problem in arms control, applied to AI: when you sign a mutual agreement, how do you know the other party will uphold it? Opens with the welcome and the course's own framing, then the case that ASI risk warrants an agreement at all, why successful prevention is invisible, the intuitions a verification regime runs on, seven decades of arms-control precedent, and the securitization critique met head on.",
      "units": [
        {
          "id": "0.0",
          "title": "Welcome",
          "kind": "explainer",
          "mins": "5–10 min",
          "href": "/tracks/verification/why-verification/welcome",
          "lessons": [
            "welcome"
          ]
        },
        {
          "id": "0.1",
          "title": "How the risk looks like?",
          "kind": "explainer",
          "mins": "15–20 min",
          "href": "/tracks/verification/why-verification/introduction",
          "lessons": [
            "introduction",
            "prevention-is-invisible"
          ]
        },
        {
          "id": "0.2",
          "title": "Building Verification Intuitions",
          "kind": "interactive",
          "mins": "15–20 min",
          "href": "/tracks/verification/why-verification/building-intuitions",
          "lessons": [
            "building-intuitions"
          ]
        },
        {
          "id": "0.3",
          "title": "History, Precedents, Parallels",
          "kind": "interactive",
          "mins": "20–25 min",
          "href": "/tracks/verification/why-verification/precedents",
          "lessons": [
            "precedents",
            "securitization"
          ]
        },
        {
          "id": "0.4",
          "title": "Strategic Foundations",
          "kind": "reading",
          "mins": "self-paced",
          "optional": true,
          "href": "/tracks/verification/why-verification/strategic-foundations",
          "lessons": [
            "strategic-foundations"
          ]
        }
      ]
    },
    {
      "n": 1,
      "slug": "policy-and-actors",
      "title": "Policy and actors",
      "glyph": "❖",
      "week": "weeks 2–3",
      "status": "drafted",
      "goal": "Policy scoping & actors",
      "summary": "What kind of policy are we trying to verify, and who does a treaty rely upon, apply to, and constrain? Compute versus capability thresholds, the effectiveness/feasibility pair, the anatomy of a pause agreement, and the actor map across the compute supply chain.",
      "units": [
        {
          "id": "1.0",
          "title": "Introduction: what kind of policy are we trying to verify?",
          "kind": "explainer",
          "mins": "15–20 min",
          "href": "/tracks/verification/policy-scoping/scoping-intro",
          "lessons": [
            "scoping-intro",
            "scoping-thresholds",
            "scoping-effective-feasible",
            "policy-scoping"
          ]
        },
        {
          "id": "1.1",
          "title": "Anatomy of a pause agreement",
          "kind": "interactive",
          "mins": "20–25 min",
          "href": "/tracks/verification/policy-scoping/scoping-anatomy",
          "lessons": [
            "scoping-anatomy"
          ]
        },
        {
          "id": "1.2",
          "title": "Actors",
          "kind": "interactive",
          "mins": "25–30 min",
          "href": "/tracks/verification/policy-scoping/scoping-actors",
          "lessons": [
            "scoping-actors",
            "interactive-map",
            "protocol-actors",
            "report-constructor"
          ]
        },
        {
          "id": "1.3",
          "title": "Upstream and downstream",
          "kind": "explainer",
          "mins": "10–15 min",
          "href": "/tracks/verification/policy-scoping/scoping-upstream-downstream",
          "lessons": [
            "scoping-upstream-downstream",
            "context-distiller"
          ]
        }
      ]
    },
    {
      "n": 2,
      "slug": "evidence-streams",
      "title": "Evidence streams",
      "glyph": "⚙",
      "week": "weeks 4–8",
      "status": "notes complete",
      "goal": "Verification infrastructure and evidence streams",
      "summary": "The four buckets of mechanism — hardware, cloud, intelligence, and the human layer — each judged by the claims it can test, the evidence it produces, what it costs to implement, and how it fails.",
      "units": [
        {
          "id": "2.0",
          "title": "Confidentiality vs. verifiability",
          "kind": "explainer",
          "mins": "15–20 min",
          "href": "/tracks/verification/verification-infrastructure/mechanism-effective",
          "lessons": [
            "mechanism-effective"
          ]
        },
        {
          "id": "2.1",
          "title": "Hardware",
          "kind": "explainer",
          "mins": "165–180 min",
          "href": "/tracks/verification/verification-infrastructure/hardware-attestation",
          "lessons": [
            "hardware-attestation",
            "hardware-claim",
            "hardware-trusted-statement",
            "hardware-accounting",
            "hardware-measuring-use",
            "hardware-authorization",
            "hardware-where-trust-lives",
            "hardware-reconstructing-run",
            "hardware-policy-studio"
          ]
        },
        {
          "id": "2.2",
          "title": "Cloud",
          "kind": "explainer",
          "mins": "20–25 min",
          "href": "/tracks/verification/verification-infrastructure/cloud-intro",
          "lessons": [
            "cloud-intro",
            "cloud-what-providers-see",
            "cloud-reporting-control",
            "cloud-limits"
          ]
        },
        {
          "id": "2.3",
          "title": "Intelligence",
          "kind": "explainer",
          "mins": "35–45 min",
          "href": "/tracks/verification/verification-infrastructure/intelligence-intro",
          "lessons": [
            "intelligence-intro",
            "intelligence-signatures",
            "intelligence-anchor",
            "intelligence-assessment",
            "intelligence-institutions",
            "intelligence-action"
          ]
        },
        {
          "id": "2.4",
          "title": "Human",
          "kind": "explainer",
          "mins": "20–25 min",
          "href": "/tracks/verification/verification-infrastructure/human-intro",
          "lessons": [
            "human-intro",
            "human-insiders",
            "human-reporting-protection",
            "human-audits-inspections",
            "human-institutions"
          ]
        }
      ]
    },
    {
      "n": 3,
      "slug": "covert-development",
      "title": "Covert development",
      "glyph": "⚠",
      "week": "week 9",
      "status": "taxonomy complete",
      "goal": "Covert development",
      "summary": "Every mechanism in module 3 can fail. How a determined actor cheats, what evidence the evasion leaves across layers, and the red-team/blue-team exercise that makes you argue both sides.",
      "units": [
        {
          "id": "3.0",
          "title": "What is covert development?",
          "kind": "explainer",
          "mins": "10–15 min",
          "href": "/tracks/verification/covert-development/covert-what-is-it",
          "lessons": [
            "covert-what-is-it"
          ]
        },
        {
          "id": "3.1",
          "title": "How could a determined actor cheat?",
          "kind": "interactive",
          "mins": "30–40 min",
          "href": "/tracks/verification/covert-development/covert-how-to-cheat",
          "lessons": [
            "covert-how-to-cheat",
            "covert-taxonomy"
          ]
        },
        {
          "id": "3.2",
          "title": "Red team / blue team",
          "kind": "exercise",
          "mins": "45–60 min",
          "href": "/tracks/verification/covert-development/covert-red-blue",
          "lessons": [
            "covert-red-blue"
          ]
        }
      ]
    },
    {
      "n": 4,
      "slug": "capstone",
      "title": "Trust without trust",
      "glyph": "✦",
      "week": "week 10",
      "status": "framing complete",
      "goal": "Capstone: what would be enough for a three-month emergency pause?",
      "summary": "Feasibility, prioritization and sequencing — including how to do the research the capstone asks for, from a practising AI governance researcher — then the capstone itself: layer the imperfect mechanisms into a regime you can defend, and say where to go from here.",
      "units": [
        {
          "id": "4.0",
          "title": "Feasibility, prioritization, sequencing",
          "kind": "explainer",
          "mins": "20–30 min",
          "href": "/tracks/verification/capstone/capstone-feasibility",
          "lessons": [
            "capstone-feasibility"
          ]
        },
        {
          "id": "4.1",
          "title": "How to do AI governance research well",
          "kind": "explainer",
          "mins": "25 min",
          "href": "/tracks/verification/capstone/how-to-do-research-well",
          "lessons": [
            "how-to-do-research-well"
          ]
        },
        {
          "id": "4.2",
          "title": "Capstone",
          "kind": "capstone",
          "mins": "4–8 hrs",
          "href": "/tracks/verification/capstone/capstone-project",
          "lessons": [
            "capstone-project"
          ]
        },
        {
          "id": "4.3",
          "title": "Where to go from here",
          "kind": "explainer",
          "mins": "15–20 min",
          "href": "/tracks/verification/capstone/capstone-next-steps",
          "lessons": [
            "capstone-next-steps"
          ]
        }
      ]
    }
  ]
};
