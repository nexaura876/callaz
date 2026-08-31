import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import type { StaticPathname } from "@/i18n/routing";
import { jobs } from "@/content/jobs";
import { absoluteUrl } from "@/lib/site";

type Entry = {
  href: StaticPathname;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

const pages: Entry[] = [
  { href: "/", priority: 1, changeFrequency: "weekly" },
  { href: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { href: "/solutions/appointment-setting", priority: 0.9, changeFrequency: "monthly" },
  { href: "/solutions/outbound-sales", priority: 0.9, changeFrequency: "monthly" },
  { href: "/solutions/customer-service", priority: 0.9, changeFrequency: "monthly" },
  { href: "/quote", priority: 0.9, changeFrequency: "monthly" },
  { href: "/how-we-work", priority: 0.8, changeFrequency: "monthly" },
  { href: "/about", priority: 0.7, changeFrequency: "monthly" },
  { href: "/careers", priority: 0.8, changeFrequency: "weekly" },
  { href: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { href: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

/** Every URL carries its language variants, so Google pairs them up correctly. */
function languagesFor(href: StaticPathname) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, absoluteUrl(locale, href)]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, page.href),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: languagesFor(page.href) },
    })),
  );

  const jobEntries = jobs.flatMap((job) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, {
        pathname: "/careers/[slug]" as const,
        params: { slug: job.slug },
      }),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  );

  return [...staticEntries, ...jobEntries];
}
