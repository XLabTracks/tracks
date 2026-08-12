"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AccountMenu } from "./account-menu";
import { SignInLink } from "./sign-in-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV = [
  // Tracks, Exercises and Demos are hidden from the header for now — the
  // routes stay live (deep links, lesson embeds), they're just not surfaced
  // in the nav. The home page's two CTAs are the way into the tracks.
  // { href: "/tracks", label: "Tracks" },
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
        {/* One wordmark across the site: the same "<name> @ XLab-logotype"
            shape the Verification header wears, so the two chromes read as one
            place. The `@` is a connector and not a brand mark, so it takes the
            muted ink rather than an accent — the logotype beside it carries the
            brand on its own.

            The alt text is what makes the link say "Tracks @ XLab"; there is no
            aria-label, so the visible mark and the announced name cannot drift.

            The artwork is 3300x1050 but the ink only fills the middle
            ~55% of that box, so `height` buys about half of what it says: 28px
            puts roughly 15px of ink beside 18px type — matching theme.css's
            .brand-mark. The two cuts follow the platform's dark class. */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight select-none"
        >
          Tracks <span className="text-muted-foreground font-normal">@</span>
          <img
            src="/verification/assets/xLab_Logotype.png"
            alt="XLab"
            width={3300}
            height={1050}
            draggable={false}
            className="h-7 w-auto dark:hidden"
          />
          <img
            src="/verification/assets/xLab_Logotype_white.png"
            alt=""
            aria-hidden
            width={3300}
            height={1050}
            draggable={false}
            className="hidden h-7 w-auto dark:block"
          />
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
                  "relative rounded-md px-3 py-1.5 transition-colors select-none",
                  active
                    ? "text-foreground after:bg-destructive dark:after:bg-primary after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full"
                    : "hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
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
            <SignInLink className={buttonVariants({ size: "sm" })}>
              Sign in
            </SignInLink>
          )}
        </div>
      </div>
    </header>
  );
}
