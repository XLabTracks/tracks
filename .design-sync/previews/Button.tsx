import { Button } from "tracks";
import { ArrowRight, BookOpen, Check, Trash2 } from "lucide-react";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Continue lesson</Button>
    <Button variant="secondary">Save draft</Button>
    <Button variant="outline">Preview</Button>
    <Button variant="ghost">Dismiss</Button>
    <Button variant="destructive">
      <Trash2 /> Delete
    </Button>
    <Button variant="link">View all tracks</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Mark complete">
      <Check />
    </Button>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>
      <BookOpen data-icon="inline-start" /> Start module
    </Button>
    <Button variant="outline">
      Next lesson <ArrowRight data-icon="inline-end" />
    </Button>
  </div>
);

export const Disabled = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button disabled>Continue lesson</Button>
    <Button variant="outline" disabled>
      Preview
    </Button>
    <Button variant="destructive" disabled>
      Delete
    </Button>
  </div>
);
