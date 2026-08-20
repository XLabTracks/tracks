
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
