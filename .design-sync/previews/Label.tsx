import { Checkbox, Input, Label } from "tracks";

export const Canonical = () => <Label>Display name</Label>;

export const WithInput = () => (
  <div className="w-80 space-y-2">
    <Label htmlFor="lb-name">Display name</Label>
    <Input id="lb-name" placeholder="Ada Lovelace" />
  </div>
);

export const Required = () => (
  <div className="w-80 space-y-2">
    <Label htmlFor="lb-code">
      Classroom code <span className="text-destructive">*</span>
    </Label>
    <Input id="lb-code" placeholder="e.g. XR7-24Q" />
    <p className="text-muted-foreground text-sm">
      Ask your instructor for the code.
    </p>
  </div>
);

export const WithCheckbox = () => (
  <div className="flex items-center gap-3">
    <Checkbox id="lb-remember" defaultChecked />
    <Label htmlFor="lb-remember">Keep me signed in</Label>
  </div>
);

export const DisabledPeer = () => (
  <div className="flex items-center gap-3">
    <Checkbox id="lb-locked" disabled />
    <Label htmlFor="lb-locked">Hard-locked module (peer-disabled)</Label>
  </div>
);
