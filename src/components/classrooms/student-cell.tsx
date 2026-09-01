import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * The classroom tables' member identity cell: avatar, name, muted email,
 * linking to the student's detail page. One component so the roster and the
 * assignment tables cannot drift apart.
 */
export function StudentCell({
  href,
  name,
  email,
  imageUrl,
}: {
  href: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
}) {
  return (
    <Link href={href} className="group flex items-center gap-2">
      <Avatar className="size-7">
        <AvatarImage src={imageUrl ?? undefined} alt="" />
        <AvatarFallback className="text-xs">
          {(name ?? email)[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0">
        <span className="block truncate font-medium group-hover:underline">
          {name ?? email}
        </span>
        {name && (
          <span className="text-muted-foreground block truncate text-xs">
            {email}
          </span>
        )}
      </span>
    </Link>
  );
}
