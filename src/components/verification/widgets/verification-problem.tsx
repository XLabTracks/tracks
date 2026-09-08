"use client";

import { useState } from "react";
import { SquareCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VERIFICATION_PROBLEM } from "@/lib/verification/data/verification-problem";
import type { VerificationWidgetProps } from "../kit/types";

export function VerificationProblem(_: VerificationWidgetProps) {
  void _;
  const [open, setOpen] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);

  const onValueChange = (value: string[]) => {
    setOpen(value);
    setVisited((current) => [
      ...current,
      ...value.filter((id) => !current.includes(id)),
    ]);
  };

  return (
    <Accordion
      type="multiple"
      value={open}
      onValueChange={onValueChange}
      className="not-prose border-border bg-card my-6 rounded-xl border px-4 sm:px-5"
    >
      {VERIFICATION_PROBLEM.map((option, index) => {
        const seen = visited.includes(option.id);
        return (
          <AccordionItem key={option.id} value={option.id}>
            <AccordionTrigger className="py-4 text-base font-semibold">
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground font-normal">
                  {index + 1}.
                </span>
                {seen &&
                  (option.holds ? (
                    <SquareCheck className="text-comply size-5 shrink-0" aria-hidden />
                  ) : (
                    <X className="text-defect size-5 shrink-0" aria-hidden />
                  ))}
                <span className={cn(seen && !option.holds && "line-through")}>
                  {option.question}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground max-w-3xl pb-4 leading-relaxed">
              {option.detail}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
