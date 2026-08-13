import { Label, Slider } from "tracks";

export const Canonical = () => (
  <div className="w-80 py-2">
    <Slider defaultValue={[60]} max={100} step={1} />
  </div>
);

export const WithLabel = () => (
  <div className="w-80 space-y-3">
    <div className="flex items-center justify-between">
      <Label htmlFor="sl-daily">Daily review limit</Label>
      <span className="text-muted-foreground text-sm">30 cards</span>
    </div>
    <Slider id="sl-daily" defaultValue={[30]} max={60} step={5} />
  </div>
);

export const Range = () => (
  <div className="w-80 space-y-3">
    <div className="flex items-center justify-between">
      <Label>Session length</Label>
      <span className="text-muted-foreground text-sm">10–25 min</span>
    </div>
    <Slider defaultValue={[10, 25]} max={45} step={5} />
  </div>
);

export const Disabled = () => (
  <div className="w-80 space-y-3">
    <div className="flex items-center justify-between">
      <Label>Playback speed</Label>
      <span className="text-muted-foreground text-sm">Locked by classroom</span>
    </div>
    <Slider defaultValue={[40]} max={100} disabled />
  </div>
);

export const Vertical = () => (
  <div className="flex h-48 items-stretch gap-10 py-2">
    <div className="flex flex-col items-center gap-2">
      <Slider orientation="vertical" defaultValue={[70]} max={100} />
      <span className="text-muted-foreground text-xs">Audio</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Slider orientation="vertical" defaultValue={[35]} max={100} />
      <span className="text-muted-foreground text-xs">Captions</span>
    </div>
  </div>
);
