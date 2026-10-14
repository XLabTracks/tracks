"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, CircleAlert, CircleDot, RotateCcw } from "lucide-react";
import { shuffleAnswerOptions } from "@/lib/shuffle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  SortBoardDef,
  SortItem,
  SortPlacements,
  SortZone,
} from "@/lib/verification/data/sort-board";
import {
  allPlaced,
  gradeBoard,
  isSolved,
  prunePlacements,
  scoreBoard,
  scoreText,
  type SortNote,
} from "@/lib/verification/engines/sort-board";
import type { VerificationWidgetProps } from "./types";
import { DragProvider, Draggable, DropZone } from "./drag";
import { SegMeter } from "./seg-meter";
import { readStored, writeStored } from "./stored";

const TRAY = "__tray";

const VERDICT = {
  right: {
    text: "text-comply",
    glyph: Check,
    word: "Where the sources file it",
  },
  defensible: { text: "text-exaggerate", glyph: CircleDot, word: "Defensible" },
  miss: { text: "text-defect", glyph: CircleAlert, word: "Look again" },
} as const;

export function SortBoardView({
  board,
  onComplete,
}: VerificationWidgetProps & { board: SortBoardDef }) {
  const headingId = useId();
  const [placements, setPlacements] = useState<SortPlacements>({});
  const [notes, setNotes] = useState<Record<string, SortNote>>({});
  const [checked, setChecked] = useState(false);
  const [keyShown, setKeyShown] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    let restored: SortPlacements = {};
    try {
      const raw = readStored(board.storageKey);
      if (raw) restored = prunePlacements(JSON.parse(raw), board);
    } catch {}
    queueMicrotask(() => setPlacements(restored));
  }, [board]);

  const persist = useCallback(
    (next: SortPlacements) => {
      setPlacements(next);
      writeStored(board.storageKey, JSON.stringify(next));
    },
    [board.storageKey],
  );

  const say = useCallback((msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  }, []);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onComplete();
  }, [onComplete]);

  const tray = useMemo(
    () =>
      shuffleAnswerOptions(board.id, board.items, (item) => item.label).filter(
        ({ item }) => !placements[item.id],
      ),
    [board, placements],
  );

  const placed = board.items.length - tray.length;
  const ready = allPlaced(board, placements);
  const score = useMemo(() => scoreBoard(board, notes), [board, notes]);

  function move(itemId: string, zoneId: string) {
    const next = { ...placements };
    if (zoneId === TRAY) delete next[itemId];
    else next[itemId] = zoneId;
    persist(next);
    setNotes((prev) => {
      if (!prev[itemId]) return prev;
      const rest = { ...prev };
      delete rest[itemId];
      return rest;
    });
  }

  function check() {
    const graded = gradeBoard(board, placements);
    setNotes(graded);
    setChecked(true);
    const result = scoreBoard(board, graded);
    say(`Checked. ${scoreText(result)}.`);
    if (isSolved(board, placements)) finish();
  }

  function showKey() {
    const next: SortPlacements = {};
    for (const item of board.items) next[item.id] = item.zone;
    persist(next);
    setNotes(gradeBoard(board, next));
    setChecked(true);
    setKeyShown(true);
    say("Key shown. Every card is now in the column its source puts it in.");
    finish();
  }

  function reset() {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    setResetArmed(false);
    persist({});
    setNotes({});
    setChecked(false);
    setKeyShown(false);
    say("Board cleared.");
  }

  return (
    <div className="not-prose my-6" aria-labelledby={headingId}>
      <p id={headingId} className="text-muted-foreground mb-3 text-sm">
        {board.lead}
      </p>
      <p className="text-muted-foreground border-border bg-muted/40 mb-4 rounded-lg border px-3 py-2 text-xs">
        Drag a card into a column, or select a card and then select the column.
        Selecting a placed card and then the tray sends it back.
      </p>

      <DragProvider onDrop={move} className="space-y-3">
        <DropZone
          id={TRAY}
          label={board.trayLabel}
          className="border-border bg-card rounded-xl border p-3"
        >
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h4 className="text-sm font-semibold">{board.trayLabel}</h4>
            <span className="text-muted-foreground text-xs">
              {placed} of {board.items.length} placed
            </span>
          </div>
          <SegMeter
            total={board.items.length}
            filled={(i) => i < placed}
            label={`${placed} of ${board.items.length} cards placed`}
            className="mb-3"
          />
          {tray.length === 0 ? (
            <p className="text-muted-foreground py-2 text-xs">
              Every card is placed. Check the board, or move a card back here.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tray.map(({ item }) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </DropZone>

        {board.zones.map((zone) => (
          <ZoneBand
            key={zone.id}
            zone={zone}
            items={board.items.filter(
              (item) => placements[item.id] === zone.id
            )}
            notes={notes}
          />
        ))}
      </DragProvider>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={check} disabled={!ready || keyShown}>
          Check the board
        </Button>
        {checked && !keyShown && (
          <Button size="sm" variant="outline" onClick={showKey}>
            Show the key
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={reset}
          disabled={placed === 0 && !checked}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          {resetArmed ? "Press again to clear" : "Clear"}
        </Button>
        {!ready && !keyShown && (
          <span className="text-muted-foreground text-xs">
            Place every card to check.
          </span>
        )}
      </div>

      {checked && (
        <p className="mt-3 text-sm font-medium">{scoreText(score)}</p>
      )}
      {keyShown && (
        <p className="text-muted-foreground border-border mt-3 border-t pt-3 text-sm">
          {board.reveal}
        </p>
      )}
      <div ref={liveRef} aria-live="polite" className="sr-only" />
    </div>
  );
}

function ItemCard({ item, note }: { item: SortItem; note?: SortNote }) {
  const verdict = note ? VERDICT[note.verdict] : null;
  const Glyph = verdict?.glyph;
  return (
    <Draggable
      id={item.id}
      label={item.label}
      className="border-border bg-card flex-[1_1_15rem] rounded-lg border p-2.5"
    >
      <p className="text-sm leading-snug font-medium">{item.label}</p>
      <p className="text-muted-foreground mt-1 text-xs leading-snug">
        {item.detail}
      </p>
      {note && verdict && Glyph && (
        <div className="border-border mt-2 border-t pt-2">
          <p
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold",
              verdict.text
            )}
          >
            <Glyph className="size-3.5 shrink-0" aria-hidden />
            {verdict.word}
          </p>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {note.msg}
          </p>
        </div>
      )}
    </Draggable>
  );
}

function ZoneBand({
  zone,
  items,
  notes,
}: {
  zone: SortZone;
  items: SortItem[];
  notes: Record<string, SortNote>;
}) {
  return (
    <DropZone
      id={zone.id}
      label={zone.name}
      className="border-border bg-card rounded-xl border p-3"
    >
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          aria-hidden
          className="size-2 shrink-0 self-center rounded-full"
          style={{ background: zone.color }}
        />
        <h4 className="text-sm font-semibold" style={{ color: zone.color }}>
          {zone.name}
        </h4>
        <span className="text-muted-foreground text-xs">{zone.blurb}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-lg border border-dashed px-3 py-3 text-xs">
          Nothing filed here yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} note={notes[item.id]} />
          ))}
        </div>
      )}
    </DropZone>
  );
}
