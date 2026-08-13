import { Separator } from "tracks";

export const Horizontal = () => (
  <div className="w-80">
    <div className="space-y-1">
      <h4 className="text-sm font-medium">Control track</h4>
      <p className="text-sm text-muted-foreground">
        Technical module sequence with readings and demos.
      </p>
    </div>
    <Separator className="my-4" />
    <div className="space-y-1">
      <h4 className="text-sm font-medium">Verification track</h4>
      <p className="text-sm text-muted-foreground">
        Seventeen interactive exercises across four modules.
      </p>
    </div>
  </div>
);

export const Vertical = () => (
  <div className="flex h-5 items-center gap-4 text-sm">
    <span>Lessons</span>
    <Separator orientation="vertical" />
    <span>Exercises</span>
    <Separator orientation="vertical" />
    <span>Review</span>
    <Separator orientation="vertical" />
    <span className="text-muted-foreground">Resources</span>
  </div>
);

export const Stats = () => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
    <div className="flex flex-col">
      <span className="font-medium">12</span>
      <span className="text-xs text-muted-foreground">Lessons</span>
    </div>
    <Separator orientation="vertical" className="h-8 self-center" />
    <div className="flex flex-col">
      <span className="font-medium">3</span>
      <span className="text-xs text-muted-foreground">Papers</span>
    </div>
    <Separator orientation="vertical" className="h-8 self-center" />
    <div className="flex flex-col">
      <span className="font-medium">7</span>
      <span className="text-xs text-muted-foreground">Cards due</span>
    </div>
  </div>
);
