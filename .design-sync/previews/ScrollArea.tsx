import { ScrollArea, ScrollBar, Separator } from "tracks";

const lessons = Array.from({ length: 14 }, (_, i) => `Lesson ${i + 1}`);

export const LessonList = () => (
  <ScrollArea type="always" className="h-48 w-64 rounded-lg border border-border bg-card">
    <div className="p-3">
      <p className="pb-2 text-xs font-medium text-muted-foreground uppercase">
        Module contents
      </p>
      {lessons.map((title, i) => (
        <div key={title}>
          {i > 0 && <Separator className="my-1.5" />}
          <div className="flex items-center justify-between py-1 text-sm">
            <span>{title}</span>
            <span className="text-xs text-muted-foreground">5 min</span>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
);

export const Horizontal = () => (
  <ScrollArea type="always" className="w-80 rounded-lg border border-border bg-card">
    <div className="flex w-max gap-3 p-3">
      {["Module 1", "Module 2", "Module 3", "Module 4", "Module 5", "Module 6"].map(
        (name) => (
          <div
            key={name}
            className="flex h-20 w-32 shrink-0 flex-col justify-between rounded-md border border-border bg-background p-2"
          >
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">4 lessons</span>
          </div>
        )
      )}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);
