"use client";

import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DOCUMENT_UPLOAD_ACCEPT,
  DocumentReadError,
  extractDocumentText,
} from "@/lib/uploads/document-text";

function countWords(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export interface DocumentImportProps {
  /** Receives the extracted text. The caller decides where it lands. */
  onText: (text: string) => void;
  disabled?: boolean;
  /** Said in the toast so the learner knows what happened to their draft. */
  appending?: boolean;
}

/**
 * Reads a .docx or .pdf the learner already wrote and hands back its text.
 *
 * The file is parsed here, in their browser — it is never uploaded. Only the
 * text it yields travels, and it travels through the editor's own autosave, so
 * an imported draft is saved exactly like a typed one.
 */
export function DocumentImport({
  onText,
  disabled,
  appending,
}: DocumentImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const read = async (file: File) => {
    setBusy(true);
    try {
      const { text, truncated } = await extractDocumentText(file);
      onText(text);
      const words = countWords(text);
      toast.success(
        `${words} ${words === 1 ? "word" : "words"} read from ${file.name}` +
          (appending ? ", added at the end of your draft." : "."),
        truncated
          ? {
              description:
                "The file was longer than one answer can hold, so the end was left out.",
            }
          : undefined,
      );
    } catch (error) {
      toast.error(
        error instanceof DocumentReadError
          ? error.message
          : "That file could not be read. Paste the text in instead.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className="text-muted-foreground hover:text-foreground -my-1 gap-1.5 px-2 text-xs font-medium"
      >
        <FileUp className="size-3.5" aria-hidden />
        {busy ? "Reading…" : "Import .docx or .pdf"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={DOCUMENT_UPLOAD_ACCEPT}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Clear it first: picking the same file twice must fire again, and a
          // failed read should leave nothing staged.
          event.target.value = "";
          if (file) void read(file);
        }}
      />
    </>
  );
}
