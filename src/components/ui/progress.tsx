"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-2.5 w-full items-center overflow-x-hidden rounded-full bg-foreground/15 ring-1 ring-inset ring-border/60",
        className
      )}
      {...props}
    >
      {/* `primary`, never `destructive`: a meter is not an error, and it sits
          beside the primary Continue button it belongs to — the two have to be
          the same colour. It also has to follow a re-pointed palette:
          public/verification/theme.css re-points --primary per theme, so a bar
          painted `destructive` was the one element left wearing the app's
          red-600 next to a maroon button. */}
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
