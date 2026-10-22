import { ArrowUpRight, PenLine } from "lucide-react";
import { memoCardSlotsForLesson, type MemoSlot } from "@/content/verification/memos";
import { MemoDeskHost } from "@/components/verification/memo-desk-host";

export function MemoDesk({ lesson }: { lesson: string }) {
  const slots = memoCardSlotsForLesson(lesson);
  if (!slots.length) {
    return (
      <div className="not-prose border-destructive/40 bg-destructive/5 text-destructive my-6 rounded-xl border p-4 text-sm">
        No written output is registered for lesson <code>{lesson}</code>.
      </div>
    );
  }
  const elsewhere = slots.filter((slot) => slot.href);
  const here = slots.filter((slot) => !slot.href);

  return (
    <div className="not-prose my-6 space-y-3" data-widget>
      {elsewhere.map((slot) => (
        <PageSlot key={slot.id} slot={slot} href={slot.href!} />
      ))}
      {here.length > 0 && <MemoDeskHost slots={here.map((slot) => slot.id)} />}
    </div>
  );
}

function PageSlot({ slot, href }: { slot: MemoSlot; href: string }) {
  return (
    <section className="panel text-sm">
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 eyebrow">
        <PenLine className="size-3.5" aria-hidden />
        Written output · <span className="normal-case">{slot.unit}</span>
      </p>
      <h3 className="mt-1.5 text-lg font-semibold">{slot.title}</h3>
      <p className="mt-2 leading-relaxed">
        The workspace holds your draft as you go and exports it as Markdown.
        Coming from the bank, open a brief there and it arrives with you.
      </p>
      <a
        href={href}
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold no-underline! transition-colors select-none"
      >
        Open the capstone workspace
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
    </section>
  );
}
