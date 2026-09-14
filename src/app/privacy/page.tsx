import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PROSE_CLASS } from "@/components/mdx/prose-class";

/**
 * The privacy policy, reproduced as supplied by the course owner. Both footers
 * link here — the app's and the Verification course's — so this is the one
 * copy. Edits to the wording are the owner's to make, not a code change; the
 * only code here is the topic list, which is built from the sections so it can
 * never name one that is not on the page.
 */

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What personal data Tracks collects, how it is used and stored, your data protection rights, and how the site uses cookies.",
};

const CONTACT = "xlabtracks@gmail.com";

const SECTIONS: { id: string; heading: string; body: ReactNode }[] = [
  {
    id: "what-data-do-we-collect",
    heading: "What data do we collect?",
    body: (
      <>
        <p>Tracks collects the following data:</p>
        <ul>
          <li>Personal identification information (Name, email address, etc.)</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-do-we-collect-your-data",
    heading: "How do we collect your data?",
    body: (
      <>
        <p>
          You directly provide Tracks with most of the data we collect. We
          collect data and process data when you:
        </p>
        <ul>
          <li>Log in with your account information.</li>
          <li>
            Take any of the courses that we offer or use any of the course
            teaching software we provide.
          </li>
          <li>Use or view our website via your browser’s cookies.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-will-we-use-your-data",
    heading: "How will we use your data?",
    body: (
      <>
        <p>Tracks collects your data so that we can:</p>
        <ul>
          <li>Manage your account &amp; handle assignments.</li>
        </ul>
      </>
    ),
  },
  {
    id: "what-are-your-data-protection-rights",
    heading: "What are your data protection rights?",
    body: (
      <>
        <p>
          Tracks would like to make sure you are fully aware of all of your data
          protection rights. Every user is entitled to the following:
        </p>
        <ul>
          <li>
            <strong>The right to access</strong> – You have the right to request
            Tracks for copies of your personal data.
          </li>
          <li>
            <strong>The right to rectification</strong> – You have the right to
            request that Tracks correct any information you believe is
            inaccurate. You also have the right to request Tracks to complete
            the information you believe is incomplete.
          </li>
          <li>
            <strong>The right to erasure</strong> – You have the right to request
            that Tracks erase your personal data, under certain conditions.
          </li>
          <li>
            <strong>The right to restrict processing</strong> – You have the
            right to request that Tracks restrict the processing of your
            personal data, under certain conditions.
          </li>
          <li>
            <strong>The right to object to processing</strong> – You have the
            right to object to Tracks’s processing of your personal data, under
            certain conditions.
          </li>
          <li>
            <strong>The right to data portability</strong> – You have the right
            to request that Tracks transfer the data that we have collected to
            another organization, or directly to you, under certain conditions.
          </li>
        </ul>
        <p>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us at our
          email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: (
      <>
        <p>
          Cookies are text files placed on your computer to collect standard
          Internet log information and visitor behavior information. When you
          visit our websites, we may collect information from you automatically
          through cookies or similar technology.
        </p>
        <p>
          For further information, visit{" "}
          <a
            href="https://www.allaboutcookies.org"
            target="_blank"
            rel="noopener"
          >
            allaboutcookies.org
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "how-do-we-use-cookies",
    heading: "How do we use cookies?",
    body: (
      <>
        <p>
          Tracks uses cookies in a range of ways to improve your experience on
          our website, including:
        </p>
        <ul>
          <li>Keeping you signed in</li>
          <li>Understanding how you use our website</li>
        </ul>
      </>
    ),
  },
  {
    id: "what-types-of-cookies-do-we-use",
    heading: "What types of cookies do we use?",
    body: (
      <>
        <p>
          There are a number of different types of cookies, however, our website
          uses:
        </p>
        <ul>
          <li>
            <strong>Functionality</strong> – Tracks uses these cookies so that we
            recognize you on our website and remember your previously selected
            preferences. These could include what language you prefer and
            location you are in. A mix of first-party and third-party cookies
            are used.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-to-manage-cookies",
    heading: "How to manage cookies",
    body: (
      <p>
        You can set your browser not to accept cookies, and the above website
        tells you how to remove cookies from your browser. However, in a few
        cases, some of our website features may not function as a result.
      </p>
    ),
  },
  {
    id: "privacy-policies-of-other-websites",
    heading: "Privacy policies of other websites",
    body: (
      <p>
        The Tracks website contains links to other websites. Our privacy policy
        applies only to our website, so if you click on a link to another
        website, you should read their privacy policy.
      </p>
    ),
  },
  {
    id: "changes-to-our-privacy-policy",
    heading: "Changes to our privacy policy",
    body: (
      <p>
        Tracks keeps its privacy policy under regular review and places any
        updates on this web page. This privacy policy was last updated on
        September 14, 2026.
      </p>
    ),
  },
  {
    id: "how-to-contact-us",
    heading: "How to contact us",
    body: (
      <>
        <p>
          If you have any questions about Tracks’s privacy policy, the data we
          hold on you, or you would like to exercise one of your data protection
          rights, please do not hesitate to contact us.
        </p>
        <p>
          Email us at: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <h1 className="text-3xl font-semibold tracking-tight">Privacy policy</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        XLab Tracks is an independent group funded by the University of
        Chicago’s Existential Risk Laboratory. This privacy policy will explain
        how our organization uses the personal data we collect from you when you
        use our website.
      </p>

      <nav aria-label="Topics" className="mt-8">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Topics
        </p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a className="underline-offset-4 hover:underline" href={`#${s.id}`}>
                {s.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <article className={`mt-10 ${PROSE_CLASS}`}>
        {SECTIONS.map((s) => (
          <section key={s.id}>
            <h2 id={s.id} className="scroll-mt-20">
              {s.heading}
            </h2>
            {s.body}
          </section>
        ))}
      </article>
    </main>
  );
}
