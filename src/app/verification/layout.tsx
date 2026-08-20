/* Marks every /verification/* page as a Verification surface. The course's
 * scrollbar-hiding is its own design decision and stops at its own borders:
 * globals.css keys the rule on html:has([data-verification-surface]), so the
 * app's other pages keep stock browser scrollbars. `display: contents` keeps
 * this wrapper out of layout entirely. */
export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-verification-surface="" className="contents">
      {children}
    </div>
  );
}
