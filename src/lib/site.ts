import { getPathname, type Locale } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { AppPathname } from "@/i18n/routing";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://callaz.dk"
).replace(/\/$/, "");

type Href = AppPathname | { pathname: AppPathname; params: Record<string, string> };

export function absoluteUrl(locale: Locale, href: Href) {
  // getPathname is typed against the pathnames object; the cast keeps call sites readable.
  const path = getPathname({ locale, href: href as never });
  // The front page keeps its trailing slash, or the canonical points somewhere else.
  return path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
}

/**
 * Canonical plus hreflang for every locale. x-default points at English, which is
 * the default locale and the version meant to be found from outside Denmark.
 */
export function alternatesFor(locale: Locale, href: Href) {
  const languages = Object.fromEntries(
    routing.locales.map((entry) => [entry, absoluteUrl(entry, href)]),
  );

  return {
    canonical: absoluteUrl(locale, href),
    languages: { ...languages, "x-default": absoluteUrl(routing.defaultLocale, href) },
  };
}

const ogLocale: Record<Locale, string> = { en: "en_DK", da: "da_DK" };

/**
 * A page openGraph object replaces the one from the layout rather than merging
 * into it, and the opengraph-image file only covers its own segment. Without this
 * every page except the front page would be shared without an image.
 */
export function openGraphFor(
  locale: Locale,
  page: { title: string; description: string; href: Href },
) {
  /*
    Always prefixed, including for the default locale. The middleware matcher
    skips opengraph-image on purpose, so nothing rewrites /opengraph-image to
    /en/opengraph-image and the unprefixed URL is a 404. Crawlers do not retry.
  */
  const imageUrl = `${siteUrl}/${locale}/opengraph-image`;

  return {
    type: "website" as const,
    title: page.title,
    description: page.description,
    url: absoluteUrl(locale, page.href),
    locale: ogLocale[locale],
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Callaz",
      },
    ],
  };
}
