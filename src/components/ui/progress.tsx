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
      {/* The fill is --primary, not --destructive: on a track that re-points
          the palette (Verification loads its own theme.css into the app
          subtree) the destructive red stays the base app's red and lands
          beside a maroon button. --primary follows whatever palette the
          subtree is wearing. */}
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary size-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
