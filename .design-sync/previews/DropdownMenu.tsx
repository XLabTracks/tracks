import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "tracks";
import { BookOpen, Check, MoreHorizontal, RotateCcw } from "lucide-react";

export const Open = () => (
  <div className="flex h-[380px] w-full items-start justify-center pt-6">
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal /> Lesson options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Lesson options</DropdownMenuLabel>
        <DropdownMenuItem>
          <BookOpen /> Open lesson
          <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Check /> Mark complete
          <DropdownMenuShortcut>⌘⏎</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>
          Show sidenotes
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Compact sidebar</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <RotateCcw /> Reset progress
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
