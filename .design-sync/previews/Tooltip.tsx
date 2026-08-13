import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "tracks";
import { RotateCcw } from "lucide-react";

export const Open = () => (
  <TooltipProvider>
    <div className="flex h-52 items-center justify-center">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Mark complete</Button>
        </TooltipTrigger>
        <TooltipContent>Saves your progress for this lesson</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);

export const IconTrigger = () => (
  <TooltipProvider>
    <div className="flex h-52 items-center justify-center">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Reset demo">
            <RotateCcw />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Reset demo</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
