import { Badge } from "tracks";
import { BookOpen, Check, Clock } from "lucide-react";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge>New</Badge>
    <Badge variant="secondary">Draft</Badge>
    <Badge variant="destructive">Overdue</Badge>
    <Badge variant="outline">Optional</Badge>
    <Badge variant="ghost">Archived</Badge>
    <Badge variant="link">View track</Badge>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge>
      <Check /> Completed
    </Badge>
    <Badge variant="secondary">
      <Clock /> In progress
    </Badge>
    <Badge variant="outline">
      <BookOpen /> 5 lessons
    </Badge>
  </div>
);

export const InContext = () => (
  <div className="flex w-80 items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium">Module 2 assessment</span>
      <span className="text-xs text-muted-foreground">Written response</span>
    </div>
    <Badge variant="secondary">Submitted</Badge>
  </div>
);
