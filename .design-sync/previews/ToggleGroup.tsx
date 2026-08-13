import { ToggleGroup, ToggleGroupItem } from "tracks";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";

export const Single = () => (
  <ToggleGroup type="single" defaultValue="center" aria-label="Text alignment">
    <ToggleGroupItem value="left" aria-label="Align left">
      <AlignLeft />
    </ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center">
      <AlignCenter />
    </ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right">
      <AlignRight />
    </ToggleGroupItem>
  </ToggleGroup>
);

export const Multiple = () => (
  <ToggleGroup
    type="multiple"
    variant="outline"
    defaultValue={["bold", "italic"]}
    aria-label="Text formatting"
  >
    <ToggleGroupItem value="bold" aria-label="Bold">
      <Bold />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Italic">
      <Italic />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Underline">
      <Underline />
    </ToggleGroupItem>
  </ToggleGroup>
);

export const Segmented = () => (
  <ToggleGroup
    type="single"
    variant="outline"
    spacing={0}
    defaultValue="due"
    aria-label="Review filter"
  >
    <ToggleGroupItem value="all">All cards</ToggleGroupItem>
    <ToggleGroupItem value="due">Due</ToggleGroupItem>
    <ToggleGroupItem value="new">New</ToggleGroupItem>
  </ToggleGroup>
);
