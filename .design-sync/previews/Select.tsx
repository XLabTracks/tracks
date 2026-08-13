import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "tracks";

export const Open = () => (
  <div className="flex flex-col items-start gap-2 p-8">
    <Label htmlFor="track">Track</Label>
    <Select defaultOpen defaultValue="control">
      <SelectTrigger id="track" className="w-56">
        <SelectValue placeholder="Choose a track" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tracks</SelectLabel>
          <SelectItem value="control">Control (technical)</SelectItem>
          <SelectItem value="verification">Verification</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectItem value="all">All tracks</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export const KeyPicker = () => (
  <div className="flex flex-col items-start gap-2 p-8">
    <Label>Grading key</Label>
    <Select defaultValue="server">
      <SelectTrigger size="sm" className="text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="server">Site default (free model)</SelectItem>
        <SelectItem value="user">Your key (…4821)</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
