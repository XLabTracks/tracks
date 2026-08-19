import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "tracks";
import { CalendarClock } from "lucide-react";

export const Open = () => (
  <div className="flex h-[320px] w-full items-start justify-center pt-6">
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarClock /> Weekly goal
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Weekly reading goal</PopoverTitle>
          <PopoverDescription>
            How many lessons you aim to finish each week.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-1.5">
          <Label htmlFor="goal">Lessons per week</Label>
          <Input id="goal" type="number" defaultValue={3} min={1} max={14} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save goal</Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);
