import type { Metadata } from "next";
import localFont from "next/font/local";
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
    {
      path: "./fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  // Not preloaded. next/font preloads by default, which put a <link rel=preload>
  // for both faces — 723KB of variable font covering every Unicode range the
  // file ships — at the head of every page, at the highest priority the browser
  // has. On a phone that is the whole link for several seconds, and the document
  // itself streams in behind it: the reader watches a lesson arrive a paragraph
  // at a time, cut mid-word wherever the stream has got to, with white below.
  // Measured cold on a 1.6Mbps connection, those two files are 723KB of an
  // 807KB page and the load runs 7.1s.
  //
  // display:swap already paints the text in the fallback face immediately, so
  // what preloading bought was the swap landing sooner, not the words. Dropped,
  // the fonts are fetched from the stylesheet at ordinary priority and stop
  // competing with the markup. Subsetting them would be the bigger win and is
  // not done here: the content uses 206 non-ASCII characters — Greek, maths,
  // arrows, geometric shapes, some CJK — so a naive Latin subset would silently
  // drop glyphs across 959 files.
  preload: false,
});
export const metadata: Metadata = {
  title: {
    default: "Tracks — AI safety learning",
    // "@", not a middot: a page is somewhere rather than beside something, and
    // a tab strip full of "· Tracks" reads as one repeated ornament.
    template: "%s @ Tracks",
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
        name:
          [dev.firstName, dev.lastName].filter(Boolean).join(" ") || dev.email,
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
 * The platform and Verification keep separate stored preferences, but both
 * paint through the same `dark` / `contrast` classes so Tailwind chrome and
 * native widgets cannot disagree. Verification additionally gets data-theme,
 * which its static stylesheet uses.
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
 * Trap: keep this in step with ThemeToggle and verification/theme.js: same
 * route test, storage keys, classes and system fallback.
 */
const THEME_BOOT = `(function(){try{var v=null;\
var p=location.pathname;var x=p==='/tracks/verification'||p.indexOf('/tracks/verification/')===0||p.indexOf('/verification/')===0;\
if(x){try{v=localStorage.getItem('xlab-verification-theme');}catch(e){}\
if(v!=='light'&&v!=='dark'&&v!=='contrast'){v=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}\
document.documentElement.setAttribute('data-theme',v);\
}else if(p.slice(-6)==='/embed'){\
var q=new URLSearchParams(location.search).get('theme');\
v=q==='dark'||q==='contrast'?q:'light';\
}else{\
try{v=localStorage.getItem('tracks-theme');}catch(e){}\
if(v!=='light'&&v!=='dark'&&v!=='contrast'){\
v=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}\
}\
var c=document.documentElement.classList;\
c.toggle('dark',v!=='light');c.toggle('contrast',v==='contrast');\
if(x){var s=null;try{s=localStorage.getItem('xlab-verification-text-scale');}catch(e){}\
if(s==='100'||s==='125'||s==='150'||s==='175'||s==='200'){\
document.documentElement.setAttribute('data-text-scale',s);c.toggle('reader-enlarged',Number(s)>100);c.toggle('reader-large',Number(s)>=150);}}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuth = await getInitialAuth();
  return (
    <html
      lang="en"
      // THEME_BOOT mutates theme attributes before React hydrates. That is
      // precisely the mismatch React would otherwise warn about.
      suppressHydrationWarning
      // No height on <html>. `h-full` pinned it to exactly the viewport while
      // the body inside ran to the length of the document — on a 16,000px
      // lesson the body overflowed its own root element twenty times over.
      // Desktop engines scroll the initial containing block and never show it;
      // iOS Safari treats the constrained root as the paint boundary and stops
      // painting partway down, which is a page that ends mid-word with white
      // under it, on every page, after the load has finished. The footer still
      // sits at the bottom of a short page — that is what min-h-dvh on the
      // body below is for, and it measures the viewport directly instead of
      // asking a parent that no longer has a height.
      className={`${inter.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body
        // Browser extensions (Grammarly's data-gr-* stamps in particular)
        // mutate <body> attributes before React hydrates — noise we cannot
        // control. Suppression is attribute-only and one element deep, so
        // real mismatches inside the app still warn.
        suppressHydrationWarning
        className="bg-background text-foreground flex min-h-dvh flex-col"
      >
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
