import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale proxy (Next.js 16 name for middleware).
 * - Redirects "/" to the best matching locale (cookie → Accept-Language → ru).
 * - Persists the selected locale in the NEXT_LOCALE cookie.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, Vercel internals and files with extensions.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
