import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { company } from "@/content/company";
import { siteUrl } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { JsonLd } from "@/components/JsonLd";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  // One entry per scheme, so the browser chrome matches whichever theme is showing
  // rather than staying navy behind a white page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060e19" },
  ],
  colorScheme: "light dark",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("home.title"),
      template: `%s — ${t("siteName")}`,
    },
    description: t("home.description"),
    applicationName: t("siteName"),
    authors: [{ name: company.legalName, url: siteUrl }],
    creator: company.legalName,
    publisher: company.legalName,
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: locale === "da" ? "da_DK" : "en_DK",
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations("nav");
  const consent = await getTranslations("consent");

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        {/*
          Applies a stored theme before the first paint. Anything later, including
          a useEffect, repaints the page in front of the visitor.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/*
          Belt and braces for the reveal effect. globals.css handles it with
          @media (scripting: none); this covers browsers that do not support that
          query yet. Without either, a visitor with JavaScript off would land on a
          page where most sections are fully transparent.
        */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col [--header-height:4.75rem]">
        <NextIntlClientProvider locale={locale}>
          <a
            href="#content"
            className="bg-accent text-on-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:px-5 focus:py-3 focus:font-semibold"
          >
            {t("skipToContent")}
          </a>

          <SiteHeader />

          {/* The header is fixed, so the flow starts underneath it. */}
          <main id="content" className="flex-1 pt-[var(--header-height)]">
            {children}
          </main>

          <SiteFooter />

          <CookieConsent
            labels={{
              title: consent("title"),
              body: consent("body"),
              accept: consent("accept"),
              reject: consent("reject"),
              details: consent("details"),
              necessaryTitle: consent("necessaryTitle"),
              necessaryBody: consent("necessaryBody"),
              analyticsTitle: consent("analyticsTitle"),
              analyticsBody: consent("analyticsBody"),
              privacyLink: consent("privacyLink"),
              privacyHref: getPathname({ locale, href: "/privacy" }),
              regionLabel: consent("regionLabel"),
            }}
          />
        </NextIntlClientProvider>

        <JsonLd data={[organizationSchema(), websiteSchema(locale)]} />
      </body>
    </html>
  );
}
