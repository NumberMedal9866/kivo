import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { brand } from "./config/brand";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const canonical = new URL(brand.seo.siteUrl);
const canonicalHost = canonical.hostname;
// The bare-domain twin of a www canonical host (www.kiyo.uz → kiyo.uz).
const bareHost = canonicalHost.startsWith("www.") ? canonicalHost.slice(4) : null;
// Off for http://localhost development.
const enforceHttps = canonical.protocol === "https:";

/**
 * Locale proxy (Next.js 16 name for middleware).
 * - Sends plain-http visits and the bare domain to https on the canonical
 *   www host with a 308, so one URL per page gets indexed. Vercel did this
 *   at the edge; on ahost's cPanel the Force-HTTPS feature isn't available.
 * - Redirects "/" to the best matching locale (cookie → Accept-Language → ru).
 * - Persists the selected locale in the NEXT_LOCALE cookie.
 */
export default function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];
  // ahost's nginx and Apache each append a value ("https, https"); the
  // first one is the visitor's own connection.
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const ownHost = host === canonicalHost || (bareHost !== null && host === bareHost);
  const insecure = enforceHttps && proto === "http";

  if (ownHost && (insecure || host === bareHost)) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`https://${canonicalHost}${pathname}${search}`, 308);
  }
  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes, Next internals, Vercel internals and files with extensions.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
