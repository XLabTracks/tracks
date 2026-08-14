import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { devUser } from "@/lib/auth";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { SiteHeader } from "@/components/layout/site-header";
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
    template: "%s · Tracks",
  },
  description:
    "Tracks is a structured program for learning AI safety, offering a technical track on AI control and a governance track on verifying international AI agreements, with primary literature rendered in full, interactive demos, and writing practice.",
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
 * The theme is classes on <html>: `dark` alone for the dark theme, `dark`
 * plus `contrast` for high contrast (contrast is dark-plus — every `dark:`
 * utility applies and globals.css's .contrast block re-points the tokens).
 * The switch sets them — but React only runs after hydration, so a returning
 * dark-theme reader would watch the page paint light and then go dark. This
 * is the same read, running before the document body does.
 *
 * No stored choice follows the system preference, so first-time visitors on
 * a dark OS never see a light flash either. The sample is taken once, at
 * load: an OS that flips mid-session (auto-dark at sunset) moves the page on
 * its next navigation, not live — deliberate, to keep this a boot script and
 * not a subscription. High contrast is never inferred from the system —
 * prefers-color-scheme picks between light and dark only; contrast is always
 * an explicit choice.
 *
 * The chrome-less /embed iframes are the exception: they render inside other
 * people's pages, which are usually hard-coded one way — following the
 * visitor's OS there hands the host a mismatched card it cannot control
 * (cross-origin storage partitioning means our stored choice never reaches
 * the iframe either). Embeds therefore stay light unless the host pins
 * ?theme=dark or ?theme=contrast, restoring the pre-dark-mode contract.
 *
 * The storage read gets its own try: browsers that block third-party storage
 * throw on the localStorage *accessor*, and one shared try would take the
 * matchMedia fallback down with it — a dark-OS visitor would get light only
 * in those browsers.
 *
 * Trap: keep it in step with ThemeToggle (`theme-toggle.tsx`) — same storage
 * key, same class, same system fallback.
 */
const THEME_BOOT = `(function(){try{var v=null;\
if(location.pathname.slice(-6)==='/embed'){\
var q=new URLSearchParams(location.search).get('theme');\
v=q==='dark'||q==='contrast'?q:'light';\
}else{\
try{v=localStorage.getItem('tracks-theme');}catch(e){}\
if(v!=='light'&&v!=='dark'&&v!=='contrast'){\
v=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}\
}\
var c=document.documentElement.classList;\
if(v==='contrast')c.add('dark','contrast');\
else if(v==='dark')c.add('dark');}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuth = await getInitialAuth();
  return (
    <html
      lang="en"
      // THEME_BOOT adds the `dark` class before React hydrates. That is the
      // whole point of it, and it is also precisely the mismatch React warns
      // about, so the warning is suppressed on this element only.
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main-content"
          className="bg-background text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:border focus:px-4 focus:py-2 focus:ring-2 focus:outline-none"
        >
          Skip to content
        </a>
        <AuthKitProvider initialAuth={initialAuth}>
          <TooltipProvider delayDuration={200}>
            <SiteHeader />
            <div id="main-content" className="flex flex-1 flex-col">
              {children}
            </div>
          </TooltipProvider>
          <Toaster />
        </AuthKitProvider>
      </body>
    </html>
  );
}
