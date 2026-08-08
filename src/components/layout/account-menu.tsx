"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * The signed-in account menu — avatar, email, Account, My classrooms, Sign
 * out. One component for both headers: the app's and Verification's. A
 * learner who signs in should not lose their way out of the session by
 * walking into a track.
 *
 * Signed out it renders nothing, because the two headers dress that state
 * differently — the app uses a shadcn Button, Verification uses `.btn small`
 * from theme.css — and neither wants the other's.
 *
 * `loading` also renders nothing: a "Sign in" that flips to an avatar a
 * moment later is worse than a control that arrives late.
 *
 * Note the static pages under public/verification/ cannot have this; they
 * swap a single button by probing the state route in sync.js. So the menu is
 * on every app-served route and the button remains on the no-build pages.
 */
/**
 * A course with its own cabinet, and the routes it owns.
 *
 * One sign-in and one identity, but a cabinet per course: what a learner has
 * done lives in the course, not in the account. The cabinet page also carries
 * the name form and the email block — the same component and action as
 * /account's — so on course routes it is the menu's only account entry;
 * "My account" means the whole thing, not a second place beside it. Control
 * gets a row here the day it has a cabinet of its own — that is the whole
 * extension point, and `href` is the only thing a new one needs.
 */
const CABINETS: { label: string; href: string; owns: (p: string) => boolean }[] =
  [
    {
      label: "My account",
      href: "/verification/account",
      owns: (p) =>
        p === "/tracks/verification" ||
        p.startsWith("/tracks/verification/") ||
        p.startsWith("/verification/"),
    },
  ];

export function AccountMenu() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname() ?? "";
  const cabinet = CABINETS.find((c) => c.owns(pathname));
  if (loading || !user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="ring-offset-background focus-visible:ring-ring rounded-full select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="Account menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={user.profilePictureUrl ?? undefined} alt="" />
            <AvatarFallback className="text-xs">
              {initials(user.email, user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {cabinet ? (
            <Link href={cabinet.href}>{cabinet.label}</Link>
          ) : (
            <Link href="/account">Account</Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/classrooms">My classrooms</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 size-4" aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function initials(email: string, firstName?: string | null, lastName?: string | null) {
  const fromName = [firstName, lastName]
    .filter(Boolean)
    .map((s) => s![0]!.toUpperCase())
    .join("");
  return fromName || email[0]?.toUpperCase() || "?";
}
