import type { Metadata } from "next";

import { ProfileNameForm } from "./profile-name-form";
import { redirect } from "next/navigation";

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

/**
 * The signed-in learner's own settings.
 *
 * Email is read-only on purpose: WorkOS owns it, and it is the identity the
 * session is issued against — changing it is an AuthKit flow, not a field on
 * this form. The page says so rather than showing a control that cannot work.
 */
export default async function AccountPage() {
  // getCurrentUser, not requireUser: requireUser refreshes the session inside
  // the render, and a page render may not write cookies — signed out, that
  // surfaces as a 500 rather than a sign-in prompt. Redirect explicitly.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Account</h1>

      <div className="mt-8 space-y-8">
        <ProfileNameForm initialName={user.name ?? ""} />

        <div className="border-border/80 space-y-1 border-t pt-8">
          <h2 className="text-sm font-medium">Email</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-muted-foreground text-sm">
            This is how you sign in, and it is managed by your identity
            provider rather than here. To change it, sign in with the address
            you want to use — progress follows the account, not the browser.
          </p>
        </div>

        {/* The way back into a course's own cabinet. Whichever door somebody
            opens — the avatar menu here, or the one in the course header —
            they can reach the page that knows what they have actually done.
            Without it this page is a dead end wearing the app's chrome, which
            reads as the course cabinet having gone missing. */}
        <div className="border-border/80 space-y-1 border-t pt-8">
          <h2 className="text-sm font-medium">Your courses</h2>
          <p className="text-muted-foreground text-sm">
            This page is your name and email, which are the same everywhere.
            What you have done lives in the course:
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                className="text-sm underline underline-offset-4"
                href="/verification/account"
              >
                Verification
              </Link>{" "}
              <span className="text-muted-foreground text-sm">
                — your progress, cohort and written tasks.
              </span>
            </li>
          </ul>
        </div>

        <div className="border-border/80 space-y-1 border-t pt-8">
          <h2 className="text-sm font-medium">Your work</h2>
          <p className="text-muted-foreground text-sm">
            Progress, written submissions, review cards and Verification
            notebook are stored against this account, so they follow you to any
            browser you sign in on.
          </p>
        </div>
      </div>
    </main>
  );
}
