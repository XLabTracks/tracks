import { join } from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// No initOpenNextCloudflareForDev() here on purpose: with a hyperdrive binding
// it demands a local connection string even during `next build` (including
// remote Workers Builds). Local dev doesn't need emulated bindings — the DB
// client falls back to DATABASE_URL (src/lib/db.ts).
const nextConfig: NextConfig = {
  // Allow .md / .mdx files to be treated as pages and imports.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // The Prisma packages must stay external so @opennextjs/cloudflare can patch
  // the generated client for workerd at build time.
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    // pg's conditional require of pg-cloudflare (the workerd socket shim) only
    // resolves under the workerd exports condition — keep both external so the
    // require happens at runtime in workerd instead of at bundle time.
    "pg",
    "pg-cloudflare",
  ],
  async redirects() {
    // The course's own pages were hand-written .html under public/verification/
    // until they became app routes. Those URLs are in the wild — in the
    // outline, in chat, in bookmarks — so each one keeps working. 308: the
    // move is permanent, and the pages are GET-only.
    const verificationPages = [
      "about",
      "team",
      "landing",
      "track",
      "map",
      "guide",
      "memo-desk",
      "capstone-bank",
      "capstone",
      "module",
    ].map((page) => ({
      source: `/verification/${page}.html`,
      destination: `/verification/${page}`,
      permanent: true,
    }));

    return [
      ...verificationPages,
      {
        // The mod-6 walkthrough lesson (c-plm-walkthrough) was replaced by
        // the guided paper item — keep old bookmarks and syllabus links
        // working. 307 (not permanent) so browsers don't cache it forever if
        // the destination slug ever changes again.
        source: "/tracks/control/low-stakes-control/password-locked-models-walkthrough",
        destination: "/tracks/control/low-stakes-control/capability-elicitation-guided",
        permanent: false,
      },
      {
        // The paper item next to that walkthrough got the same rename
        // (c-paper-password-locked kept its id; only the slug changed).
        source: "/tracks/control/low-stakes-control/password-locked-models-paper",
        destination: "/tracks/control/low-stakes-control/capability-elicitation-paper",
        permanent: false,
      },
      {
        // The no-sandbagging lesson (c-lowstakes-l4) was cut from the module,
        // but the same Carlsmith post is readable in the standalone viewer —
        // send old bookmarks there instead of a 404.
        source: "/tracks/control/low-stakes-control/no-sandbagging-on-checkable-tasks",
        destination: "/readings/alignmentforum__h7QETH7GMk9HcMnHH",
        permanent: false,
      },
      {
        // These two papers were removed outright with no in-app successor —
        // land old bookmarks on the module page rather than a 404.
        source:
          "/tracks/control/low-stakes-control/:slug(adaptive-deployment-paper|sabotage-evaluations-paper)",
        destination: "/tracks/control/low-stakes-control",
        permanent: false,
      },
      // The Control modules were renumbered when the placeholder module 4
      // was removed (020807f): High-stakes control moved module-5 → module-4
      // and Beyond scheming moved module-6 → module-5. Because module-5 is
      // live again for a different module, the old high-stakes item URLs
      // must be matched item-by-item — the two modules' item slugs are
      // disjoint, so none of these shadows a current module-5 page. A bare
      // /tracks/control/module-5 bookmark is ambiguous (it was High-stakes
      // control, it now serves Beyond scheming) and deliberately gets no
      // redirect.
      {
        source:
          "/tracks/control/module-5/:slug(high-stakes-control-talk|what-is-high-stakes|win-continue-lose|rogue-deployments|rogue-internal-deployments-via-external-apis|systems-architecture|monitoring-and-mitigation|control-monitoring-in-deployments|synchronous-monitors|ctrl-z-resampling|environment-construction|settings-for-high-stakes-control|untrusted-advice-guided|legibility-guided)",
        destination: "/tracks/control/module-4/:slug",
        permanent: false,
      },
      {
        // Must precede the module-6 catch-all below: this reading was
        // consolidated into the deals paper (60a56e6), so its old URL has a
        // different destination than a straight module rename.
        source: "/tracks/control/module-6/cooperating-with-unaligned-ais",
        destination: "/tracks/control/module-5/making-deals-with-early-schemers",
        permanent: false,
      },
      {
        // Everything else under the retired module-6 slug moved wholesale to
        // module-5 (item slugs unchanged), including the bare module page.
        source: "/tracks/control/module-6/:path*",
        destination: "/tracks/control/module-5/:path*",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // Clickjacking hardening: only same-origin pages may frame the app.
        // Carve-out: /demos/*/embed exists to be iframed by external sites.
        source: "/((?!demos/.*/embed$).*)",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
};

// String-form plugins are required for Turbopack (Next 16 default), which
// cannot pass JS functions to its Rust pipeline. The local plugin needs an
// absolute path: the loader resolves plugin strings relative to each MDX
// file's directory, so a relative "./src/…" would not resolve.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: [
      "rehype-slug",
      // Must come after rehype-slug: it reads the heading ids slug assigns.
      join(process.cwd(), "src/lib/mdx/rehype-lesson-sections.mjs"),
      // Before auto-gloss, so a section-spec line is still one text node when
      // it wraps the "Runtime:/Status:/Hard idea:" labels in <strong>.
      join(process.cwd(), "src/lib/mdx/rehype-lesson-meta.mjs"),
      // Order-insensitive itself (it only reads links), but before auto-gloss
      // keeps the walk over the body the author wrote, not over injected Terms.
      join(process.cwd(), "src/lib/mdx/rehype-lesson-citations.mjs"),
      // Before rehype-katex: it skips inline math while math is still a
      // `code` element, and never touches headings/links/inline JSX.
      join(process.cwd(), "src/lib/mdx/rehype-auto-gloss.mjs"),
      "rehype-katex",
    ],
  },
});

export default withMDX(nextConfig);
