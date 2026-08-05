"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "./account-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/tracks", label: "Tracks" },
  // Exercises and Demos are hidden from the header for now — the routes stay
  // live (deep links, lesson embeds), they're just not surfaced in the nav.
  // { href: "/exercises", label: "Exercises" },
  { href: "/review", label: "Review" },
  { href: "/resources", label: "Resources" },
  // { href: "/demos", label: "Demos" },
];


export function SiteHeader() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Keep embed routes chrome-less for external <iframe> use.
  if (pathname?.endsWith("/embed")) return null;

  return (
    <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-4 lg:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          XLab<span className="text-destructive"> · </span>Tracks
        </Link>
        <nav className="text-muted-foreground hidden items-center gap-1 text-sm sm:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-1.5 transition-colors",
                  active
                    ? "text-foreground after:bg-destructive after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full"
                    : "hover:text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ring-offset-background focus-visible:ring-ring rounded-md p-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:hidden"
                aria-label="Menu"
              >
                <Menu className="size-5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {NAV.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    aria-current={
                      pathname === item.href ||
                      pathname?.startsWith(item.href + "/")
                        ? "page"
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AccountMenu />
          {loading || user ? null : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
