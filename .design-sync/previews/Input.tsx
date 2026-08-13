import { Button, Input, Label } from "tracks";
import { Search } from "lucide-react";

export const Canonical = () => (
  <Input className="w-80" placeholder="Search lessons and papers…" />
);

export const Types = () => (
  <div className="w-80 space-y-3">
    <Input type="email" placeholder="you@university.edu" />
    <Input type="password" defaultValue="correct-horse" />
    <Input type="number" defaultValue={20} min={0} max={60} />
    <Input type="file" />
  </div>
);

export const States = () => (
  <div className="w-80 space-y-3">
    <Input placeholder="Default" />
    <Input disabled defaultValue="Managed by your classroom" />
    <div className="space-y-1.5">
      <Input aria-invalid defaultValue="sk-or-…w2" />
      <p className="text-destructive text-sm">
        This key was rejected by the provider.
      </p>
    </div>
  </div>
);

export const WithLabel = () => (
  <div className="w-80 space-y-2">
    <Label htmlFor="in-display">Display name</Label>
    <Input id="in-display" defaultValue="A. Learner" />
    <p className="text-muted-foreground text-sm">
      Shown to your classroom instructor.
    </p>
  </div>
);

export const JoinClassroom = () => (
  <div className="w-96 space-y-2">
    <Label htmlFor="in-join">Join a classroom</Label>
    <div className="flex gap-2">
      <Input id="in-join" placeholder="Classroom code" />
      <Button>Join</Button>
    </div>
  </div>
);

export const SearchRow = () => (
  <div className="relative w-80">
    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
    <Input className="pl-8" placeholder="Search the glossary…" />
  </div>
);
