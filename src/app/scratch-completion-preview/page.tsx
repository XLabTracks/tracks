import { CompletionHeader } from "@/components/learn/completion-header";
import { getTrackById } from "@/lib/content";

// TEMPORARY visual harness — deleted in the same session it was added.
export default function Page() {
  const track = getTrackById("verification")!;
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <CompletionHeader track={track} progress={{ completed: 20, total: 20 }} />
      <CompletionHeader track={track} progress={{ completed: 18, total: 20 }} />
      <CompletionHeader track={track} progress={null} />
    </div>
  );
}
