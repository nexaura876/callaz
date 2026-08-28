import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { siteUrl } from "@/lib/site";

/**
 * The confirmation page is the only thing kept out of the index. It is generated
 * per locale, so the paths are resolved rather than written out by hand.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = routing.locales.map((locale) =>
    getPathname({ locale, href: "/thank-you" }),
  );

  return {
    rules: { userAgent: "*", allow: "/", disallow },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
