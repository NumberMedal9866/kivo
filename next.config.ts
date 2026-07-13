import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Content Security Policy.
 *
 * Notes:
 * - `script-src 'unsafe-inline'` is required because the site is statically
 *   generated (nonces would force dynamic rendering) and because GA4 /
 *   Yandex Metrica bootstrap via inline snippets. All other directives are
 *   kept strict.
 * - Analytics hosts are only ever contacted when the corresponding
 *   NEXT_PUBLIC_* environment variable is configured (the scripts are not
 *   rendered otherwise), but the CSP always allows them so that enabling
 *   analytics does not require a config change.
 */
// React requires eval() for dev-mode debugging only; never allowed in production.
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://mc.yandex.ru https://mc.yandex.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://mc.yandex.ru https://mc.yandex.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.analytics.google.com https://mc.yandex.ru https://mc.yandex.com https://*.mc.yandex.ru https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src 'self' https://mc.yandex.ru https://mc.yandex.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
