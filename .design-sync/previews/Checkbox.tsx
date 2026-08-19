import { Checkbox, Label } from "tracks";

export const Canonical = () => (
  <div className="flex items-center gap-3">
    <Checkbox id="ck-completed" defaultChecked />
    <Label htmlFor="ck-completed">Show completed lessons</Label>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Checkbox id="ck-off" />
      <Label htmlFor="ck-off">Unchecked</Label>
    </div>
    <div className="flex items-center gap-3">
      <Checkbox id="ck-on" defaultChecked />
      <Label htmlFor="ck-on">Checked</Label>
    </div>
    <div className="flex items-center gap-3">
      <Checkbox id="ck-dis" disabled />
      <Label htmlFor="ck-dis">Disabled</Label>
    </div>
    <div className="flex items-center gap-3">
      <Checkbox id="ck-dis-on" disabled defaultChecked />
      <Label htmlFor="ck-dis-on">Disabled, checked</Label>
    </div>
    <div className="flex items-center gap-3">
      <Checkbox id="ck-invalid" aria-invalid />
      <Label htmlFor="ck-invalid">Invalid (required)</Label>
    </div>
  </div>
);

export const NotificationSettings = () => (
  <div className="w-80 space-y-4">
    <div className="flex items-start gap-3">
      <Checkbox id="ck-due" defaultChecked className="mt-0.5" />
      <div className="space-y-1">
        <Label htmlFor="ck-due">Review reminders</Label>
        <p className="text-muted-foreground text-sm">
          Email me when spaced-repetition cards come due.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <Checkbox id="ck-digest" defaultChecked className="mt-0.5" />
      <div className="space-y-1">
        <Label htmlFor="ck-digest">Weekly progress digest</Label>
        <p className="text-muted-foreground text-sm">
          A summary of lessons completed across your tracks.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <Checkbox id="ck-classroom" className="mt-0.5" />
      <div className="space-y-1">
        <Label htmlFor="ck-classroom">Classroom announcements</Label>
        <p className="text-muted-foreground text-sm">
          Messages from your instructor about assigned modules.
        </p>
      </div>
    </div>
  </div>
);

export const AgreementRow = () => (
  <div className="w-96 rounded-lg border border-input p-4">
    <div className="flex items-start gap-3">
      <Checkbox id="ck-honor" className="mt-0.5" />
      <div className="space-y-1">
        <Label htmlFor="ck-honor">Submit as my own work</Label>
        <p className="text-muted-foreground text-sm">
          Written responses are shared with your instructor for feedback.
        </p>
      </div>
    </div>
  </div>
);
