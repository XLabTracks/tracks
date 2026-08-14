import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "tracks";
import { Check } from "lucide-react";

const portrait =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
  "<rect width='64' height='64' fill='%232f4a6b'/>" +
  "<circle cx='32' cy='24' r='11' fill='%23e9e5db'/>" +
  "<path d='M10 58c3-13 11-19 22-19s19 6 22 19z' fill='%23e9e5db'/>" +
  "</svg>";

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <Avatar size="sm">
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
    <Avatar size="lg">
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  </div>
);

export const WithImage = () => (
  <div className="flex items-center gap-3">
    <Avatar size="lg">
      <AvatarImage src={portrait} alt="Learner avatar" />
      <AvatarFallback>LN</AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <span className="text-sm font-medium">Learner name</span>
      <span className="text-xs text-muted-foreground">Control track</span>
    </div>
  </div>
);

export const WithBadge = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge aria-label="Online" />
    </Avatar>
    <Avatar size="lg">
      <AvatarImage src={portrait} alt="Instructor avatar" />
      <AvatarFallback>IN</AvatarFallback>
      <AvatarBadge aria-label="Verified">
        <Check />
      </AvatarBadge>
    </Avatar>
  </div>
);

export const Group = () => (
  <AvatarGroup>
    <Avatar>
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage src={portrait} alt="Member avatar" />
      <AvatarFallback>MB</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <AvatarGroupCount>+4</AvatarGroupCount>
  </AvatarGroup>
);
