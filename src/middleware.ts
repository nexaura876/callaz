import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and anything with a file extension.
  //
  // opengraph-image is excluded deliberately: openGraphFor() in src/lib/site.ts always
  // prefixes the image URL with the locale, including Danish, the default locale that
  // is otherwise unprefixed. Left in the matcher, the middleware would treat that as a
  // stray /da/... prefix and 307 it back to the bare path. Several crawlers do not
  // follow that, and the share card comes out blank.
  // The dot must stay escaped as \\. here: in a string literal "\." collapses to
  // ".", which matches any character, and the lookahead then excludes every path.
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*twitter-image|.*\\..*).*)"],
};
