import { Progress } from "tracks";

export const Values = () => (
  <div className="w-72 space-y-4">
    {[33, 66, 100].map((value) => (
      <div key={value}>
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {value === 100 ? "Complete" : "In progress"}
          </span>
          <span className="font-medium tabular-nums">{value}%</span>
        </div>
        <Progress value={value} />
      </div>
    ))}
  </div>
);

export const ModuleProgress = () => (
  <div className="w-80 rounded-xl border border-border bg-card p-4">
    <div className="flex items-baseline justify-between">
      <span className="text-sm font-medium">Module progress</span>
      <span className="text-xs text-muted-foreground">3 of 5 lessons</span>
    </div>
    <Progress value={60} className="mt-2" />
    <p className="mt-2 text-xs text-muted-foreground">
      Assessments don&apos;t count toward completion.
    </p>
  </div>
);
