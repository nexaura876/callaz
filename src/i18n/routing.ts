import { defineRouting } from "next-intl/routing";

/**
 * Danish is the default locale and owns the bare paths, because the customers and
 * the candidates are Danish. English is a full, equal translation under /en for
 * everyone the company sells to outside Denmark.
 *
 * Danish is also first in the array, which makes it the reference locale for the
 * parity check in scripts/check-messages.mjs.
 */
export const locales = ["da", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "da",
  localePrefix: "as-needed",
  // A visitor who sends an English page to a colleague abroad should have it stay
  // English. The switcher in the header is the way to change language.
  localeDetection: false,
  /*
    next-intl otherwise writes a NEXT_LOCALE cookie on every single request. With
    detection off it is never read, so it would be a cookie set before consent that
    buys the visitor nothing, and the site can honestly claim to set none until a
    choice is made. The locale lives in the URL, which is where it belongs anyway.
  */
  localeCookie: false,
  pathnames: {
    "/": "/",

    "/solutions": {
      en: "/solutions",
      da: "/loesninger",
    },
    "/solutions/appointment-setting": {
      en: "/solutions/appointment-setting",
      da: "/loesninger/moedebooking",
    },
    "/solutions/outbound-sales": {
      en: "/solutions/outbound-sales",
      da: "/loesninger/salg",
    },
    "/solutions/customer-service": {
      en: "/solutions/customer-service",
      da: "/loesninger/kundeservice",
    },

    "/about": {
      en: "/about",
      da: "/om-callaz",
    },
    "/careers": {
      en: "/careers",
      da: "/karriere",
    },
    "/careers/[slug]": {
      en: "/careers/[slug]",
      da: "/karriere/[slug]",
    },
    "/contact": {
      en: "/contact",
      da: "/kontakt",
    },
    "/quote": {
      en: "/get-a-quote",
      da: "/faa-et-tilbud",
    },
    "/privacy": {
      en: "/privacy-policy",
      da: "/privatlivspolitik",
    },
    "/thank-you": {
      en: "/thank-you",
      da: "/tak-for-din-henvendelse",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;

/** Routes without parameters — <Link> accepts these directly, with no params object. */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
