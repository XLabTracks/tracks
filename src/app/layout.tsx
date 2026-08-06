import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { devUser } from "@/lib/auth";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { AppFooter, AppHeader } from "@/components/layout/app-chrome";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// Inter, self-hosted (not via next/font/google). The variable woff2 covers the
// full 100–900 weight axis; we serve it from src/app/fonts/.
const inter = localFont({
  src: [
    { path: "./fonts/InterVariable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/InterVariable-Italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tracks — AI safety learning",
    // "@", not a middot: a page is somewhere rather than beside something, and
    // a tab strip full of "· Tracks" reads as one repeated ornament.
    template: "%s @ Tracks",
  },
  description:
    "A calm, structured path into AI safety — technical and governance tracks, interactive demos, real writing practice, and a curated resource hub.",
};

// Seed the client provider with the session from the initial document request
// (where the AuthKit proxy header is present) so the header shows the signed-in
// user on first paint, instead of relying on a post-mount server-action fetch
// that doesn't reliably carry the proxy header on Netlify. withAuth() throws on
// routes the proxy excludes (e.g. /embed), so fall back to a signed-out state.
async function getInitialAuth() {
  // The DEV_USER bypass has to reach the client provider too, or local dev
  // renders every page with a signed-out header while the server treats the
  // request as signed in — the header is then the one thing the bypass does
  // not cover. Same double gate as devUser() itself.
  const dev = devUser();
  if (dev) {
    return {
      user: {
        object: "user" as const,
        id: dev.id,
        email: dev.email,
        firstName: dev.firstName ?? null,
        lastName: dev.lastName ?? null,
        emailVerified: true,
        name: [dev.firstName, dev.lastName].filter(Boolean).join(" ") || dev.email,
        locale: null,
        profilePictureUrl: null,
        lastSignInAt: null,
        externalId: null,
        metadata: {},
        createdAt: "",
        updatedAt: "",
      },
    };
  }
  try {
    const { accessToken: _accessToken, ...auth } = await withAuth();
    return auth;
  } catch {
    return { user: null };
  }
}

/*
 * The theme read step, inline and before first paint.
 *
 * Verification's three themes are `data-theme` on <html>, and theme.css paints
 * the day ground when the attribute is absent. theme.js sets it — but it runs
 * after hydration, so a learner on the night theme watched the page paint
 * light and then go dark. This is the same read, running before the document
 * body does.
 *
 * It is harmless on every other route: nothing outside Verification reads
 * `data-theme`, and theme.css is only linked on those pages.
 *
 * Trap: keep it in step with theme.js — same storage key, same attribute,
 * same three values, and high contrast never inferred from the system.
 */
const THEME_BOOT = `(function(){try{var v=localStorage.getItem('xlab-verification-theme');\
if(v!=='light'&&v!=='dark'&&v!=='contrast'){v=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}\
document.documentElement.setAttribute('data-theme',v);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuth = await getInitialAuth();
  return (
    <html
      lang="en"
      // THEME_BOOT writes data-theme before React hydrates. That is the whole
      // point of it, and it is also precisely the mismatch React warns about,
      // so the warning is suppressed on this element only.
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-background text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:border focus:px-4 focus:py-2 focus:ring-2 focus:outline-none select-none"
        >
          Skip to content
        </a>
        <AuthKitProvider initialAuth={initialAuth}>
          <TooltipProvider delayDuration={200}>
            <AppHeader />
            <div id="main-content" className="flex flex-1 flex-col">
              {children}
            </div>
            <AppFooter />
          </TooltipProvider>
          <Toaster />
        </AuthKitProvider>
      </body>
    </html>
  );
}
