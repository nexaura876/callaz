import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

/**
 * Nothing on the site is loaded from a third party — fonts are self-hosted by
 * next/font, the icons are inline SVG and there is no analytics tag. That lets the
 * policy stay at 'self' everywhere.
 *
 * 'unsafe-inline' on script-src covers Next's own bootstrap script. A per-request
 * nonce would be stricter, but it forces every page out of static rendering.
 * 'unsafe-eval' is dev-only, where react-refresh cannot work without it.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: http://localhost:*" : ""}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

/** Host only, no scheme and no trailing slash, which is the shape Next expects. */
const productionOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://callaz.dk")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  /*
   * Server actions are accepted only from the site itself. Next already compares
   * Origin against Host, but behind a proxy Host is the proxy, so the real origin
   * is listed explicitly. Without it, a form post forged from another site would
   * be hard to tell from a genuine one.
   */
  experimental: {
    serverActions: {
      allowedOrigins: [productionOrigin, `www.${productionOrigin}`],
      // The enquiry form is small. Anything much larger is not a real submission.
      bodySizeLimit: "64kb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  // callaz.dk is the real address; the Vercel-assigned one stays live underneath
  // it, so anyone who still has it bookmarked or linked gets sent to the domain
  // that is actually promoted, instead of two URLs serving the same content.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "callaz.vercel.app" }],
        destination: "https://callaz.dk/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
