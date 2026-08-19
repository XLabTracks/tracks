import { Skeleton } from "tracks";

export const ProfileCard = () => (
  <div className="w-80 rounded-xl border border-border bg-card p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
);

export const LessonList = () => (
  <div className="w-96 space-y-3">
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-9 w-2/3" />
    <div className="space-y-2 pt-2">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  </div>
);
