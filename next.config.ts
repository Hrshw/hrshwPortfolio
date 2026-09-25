import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// Applied only to production builds — dev-mode HMR needs looser script rules.
// `'unsafe-inline'` is required for Next's inline bootstrap scripts; tightening
// to a nonce-based CSP is a good follow-up hardening step.
//
// Vercel Analytics is deliberately compatible with this policy: its script and
// its event endpoint are both served same-origin from /_vercel/*, so no
// third-party origins have to be added to script-src or connect-src.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  // globals.css imports JetBrains Mono + Outfit from Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    // GitHub avatar used in the LinkedIn card
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    return [
      {
        // Renamed to drop the "hire me" framing from the URL. The old URL is
        // indexed, so a permanent redirect preserves whatever equity it has.
        source: "/insights/hire-fullstack-developer-india-saas",
        destination: "/insights/fullstack-vs-team-mvp-tradeoffs",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers:
          process.env.NODE_ENV === "production"
            ? [...securityHeaders, { key: "Content-Security-Policy", value: csp }]
            : securityHeaders,
      },
    ];
  },
};

export default nextConfig;
