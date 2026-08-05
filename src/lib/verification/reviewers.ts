/* Who may read Verification applications.
 *
 * There is no global admin role in this app — `ClassroomRole` is scoped to one
 * classroom and means nothing here — so the reviewer list is configuration:
 * VERIFICATION_REVIEWERS, a comma-separated list of email addresses, set as a
 * Worker secret (`wrangler secret put VERIFICATION_REVIEWERS`).
 *
 * It fails closed. Unset or empty means nobody is a reviewer and the reviewer
 * page 404s for everyone, including the person who deployed it — an
 * application queue that opens itself when a variable goes missing is worse
 * than one that has to be switched on.
 *
 * Emails come from WorkOS, which owns the identity, so matching on them is
 * matching on a verified address rather than on anything a user can set.
 */

export function reviewerEmails(): Set<string> {
  const raw = process.env.VERIFICATION_REVIEWERS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isReviewer(email: string | null | undefined): boolean {
  if (!email) return false;
  return reviewerEmails().has(email.trim().toLowerCase());
}
