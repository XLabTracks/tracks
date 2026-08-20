import type { Metadata } from "next";
import Link from "next/link";

import bank from "@/content/verification/capstone-bank.json";
import { CapstoneSignup } from "@/components/verification/capstone-signup";

export const metadata: Metadata = { title: "Capstone — Verification" };

/*
 * The capstone sign-up sheet, standalone. Lesson 4.2 embeds the same
 * <CapstoneSignup /> in its prose; this page is the address the bank links
 * to, so the sheet is reachable without walking the course.
 *
 * Trap: this route lives beside the course's static assets under
 * public/verification/. Nothing exists at this path there, so the app route
 * serves it — putting a file there would silently take the URL.
 */
export default function CapstoneSignupPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Capstone</h1>

      <p className="mt-6 leading-relaxed">You are almost done.</p>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        The only thing left is the capstone project — one piece of work that
        shows what you have learned, applied to a problem you chose. There is
        no assigned task. Two ways to pick one:
      </p>

      <ul className="text-muted-foreground mt-4 space-y-3 leading-relaxed">
        <li>
          <b className="text-foreground font-medium">Choose from the capstone bank.</b>{" "}
          <Link
            className="underline underline-offset-4"
            href="/verification/capstone-bank"
          >
            Browse the bank
          </Link>{" "}
          — {bank.entries.length} briefs with the numbers that decide whether
          you can take one on — then come back and put your name against it.
        </li>
        <li>
          <b className="text-foreground font-medium">Or suggest your own idea.</b>{" "}
          It has to be relevant to technical AI governance and aimed at an
          AI-safety-related theme.
        </li>
      </ul>

      <CapstoneSignup />

      <p className="text-muted-foreground mt-10 text-sm">
        <Link className="underline underline-offset-4" href="/verification/landing">
          Back to the course
        </Link>
      </p>
    </main>
  );
}
