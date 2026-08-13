import { Label, RadioGroup, RadioGroupItem } from "tracks";

export const Canonical = () => (
  <RadioGroup defaultValue="soft" className="w-72">
    <div className="flex items-center gap-3">
      <RadioGroupItem value="soft" id="rg-soft" />
      <Label htmlFor="rg-soft">Warn about missing prerequisites</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="hard" id="rg-hard" />
      <Label htmlFor="rg-hard">Lock until prerequisites are done</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="off" id="rg-off" />
      <Label htmlFor="rg-off">No prerequisite checks</Label>
    </div>
  </RadioGroup>
);

export const GraderKeyChoice = () => (
  <RadioGroup defaultValue="own" className="w-96 gap-4">
    <div className="flex items-start gap-3">
      <RadioGroupItem value="server" id="rg-server" className="mt-0.5" />
      <div className="space-y-1">
        <Label htmlFor="rg-server">Course key</Label>
        <p className="text-muted-foreground text-sm">
          Grading is billed to the platform.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <RadioGroupItem value="own" id="rg-own" className="mt-0.5" />
      <div className="space-y-1">
        <Label htmlFor="rg-own">My own key</Label>
        <p className="text-muted-foreground text-sm">
          Uses the API key ending in 4c1f stored on your account.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <RadioGroupItem value="classroom" id="rg-class" className="mt-0.5" />
      <div className="space-y-1">
        <Label htmlFor="rg-class">Classroom key</Label>
        <p className="text-muted-foreground text-sm">
          Shared by your instructor with every member.
        </p>
      </div>
    </div>
  </RadioGroup>
);

export const Horizontal = () => (
  <div className="space-y-2">
    <Label>Review session length</Label>
    <RadioGroup defaultValue="20" className="flex w-auto gap-6">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="10" id="rg-10" />
        <Label htmlFor="rg-10">10 cards</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="20" id="rg-20" />
        <Label htmlFor="rg-20">20 cards</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="all" id="rg-all" />
        <Label htmlFor="rg-all">All due</Label>
      </div>
    </RadioGroup>
  </div>
);

export const States = () => (
  <RadioGroup defaultValue="b" className="w-72">
    <div className="flex items-center gap-3">
      <RadioGroupItem value="a" id="rg-a" />
      <Label htmlFor="rg-a">Unselected</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="b" id="rg-b" />
      <Label htmlFor="rg-b">Selected</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="c" id="rg-c" disabled />
      <Label htmlFor="rg-c">Disabled option</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="d" id="rg-d" aria-invalid />
      <Label htmlFor="rg-d">Invalid option</Label>
    </div>
  </RadioGroup>
);
