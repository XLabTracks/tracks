import { Toggle } from "tracks";
import { Bold, Italic, PanelRight, Underline } from "lucide-react";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Toggle aria-label="Bold">
      <Bold />
    </Toggle>
    <Toggle defaultPressed aria-label="Italic">
      <Italic />
    </Toggle>
    <Toggle variant="outline" aria-label="Bold">
      <Bold />
    </Toggle>
    <Toggle variant="outline" defaultPressed aria-label="Underline">
      <Underline />
    </Toggle>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Toggle variant="outline" size="sm" defaultPressed>
      <Bold /> Small
    </Toggle>
    <Toggle variant="outline" size="default" defaultPressed>
      <Bold /> Default
    </Toggle>
    <Toggle variant="outline" size="lg" defaultPressed>
      <Bold /> Large
    </Toggle>
  </div>
);

export const WithText = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Toggle variant="outline" defaultPressed>
      <PanelRight data-icon="inline-start" /> Show sidenotes
    </Toggle>
    <Toggle variant="outline">
      <PanelRight data-icon="inline-start" /> Show sidenotes
    </Toggle>
  </div>
);

export const Disabled = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Toggle disabled aria-label="Bold">
      <Bold />
    </Toggle>
    <Toggle variant="outline" disabled defaultPressed>
      <Italic /> Italic
    </Toggle>
  </div>
);
