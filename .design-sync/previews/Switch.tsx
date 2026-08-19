import { Label, Switch } from "tracks";

export const Canonical = () => (
  <div className="flex items-center gap-3">
    <Switch id="sw-sidenotes" defaultChecked />
    <Label htmlFor="sw-sidenotes">Margin sidenotes</Label>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Switch id="sw-default" defaultChecked />
      <Label htmlFor="sw-default">Default size</Label>
    </div>
    <div className="flex items-center gap-3">
      <Switch id="sw-sm" size="sm" defaultChecked />
      <Label htmlFor="sw-sm">Small size</Label>
    </div>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Switch id="sw-off" />
      <Label htmlFor="sw-off">Off</Label>
    </div>
    <div className="flex items-center gap-3">
      <Switch id="sw-on" defaultChecked />
      <Label htmlFor="sw-on">On</Label>
    </div>
    <div className="flex items-center gap-3">
      <Switch id="sw-dis-off" disabled />
      <Label htmlFor="sw-dis-off">Disabled, off</Label>
    </div>
    <div className="flex items-center gap-3">
      <Switch id="sw-dis-on" disabled defaultChecked />
      <Label htmlFor="sw-dis-on">Disabled, on</Label>
    </div>
  </div>
);

export const SettingsPanel = () => (
  <div className="w-96 space-y-1 rounded-lg border border-input p-2">
    <div className="flex items-center justify-between gap-4 rounded-md p-2">
      <div className="space-y-0.5">
        <Label htmlFor="sw-reminders">Review reminders</Label>
        <p className="text-muted-foreground text-sm">
          Notify me when cards are due.
        </p>
      </div>
      <Switch id="sw-reminders" defaultChecked />
    </div>
    <div className="flex items-center justify-between gap-4 rounded-md p-2">
      <div className="space-y-0.5">
        <Label htmlFor="sw-autoplay">Autoplay videos</Label>
        <p className="text-muted-foreground text-sm">
          Start lesson videos when scrolled into view.
        </p>
      </div>
      <Switch id="sw-autoplay" />
    </div>
    <div className="flex items-center justify-between gap-4 rounded-md p-2">
      <div className="space-y-0.5">
        <Label htmlFor="sw-glossary">Glossary hints</Label>
        <p className="text-muted-foreground text-sm">
          Underline glossary terms inside lessons.
        </p>
      </div>
      <Switch id="sw-glossary" defaultChecked />
    </div>
  </div>
);
