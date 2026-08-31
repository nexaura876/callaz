import { company, languages, markets, offices, type Office } from "@/content/company";
import type { Locale } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { absoluteUrl, siteUrl } from "./site";

const organizationId = `${siteUrl}/#organization`;

/** ISO 3166-1 alpha-2 is what schema.org expects for addressCountry. */
function postalAddress(office: Office) {
  return {
    "@type": "PostalAddress",
    streetAddress: office.street,
    addressLocality: office.city,
    postalCode: office.postalCode,
    addressCountry: office.countryCode,
  };
}

export function organizationSchema() {
  const headquarters = offices.find((office) => office.headquarters) ?? offices[0];

  const sameAs = Object.values(company.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: company.name,
    legalName: company.legalName,
    url: siteUrl,
    foundingDate: String(company.founded),
    vatID: `DK${company.cvr}`,
    taxID: company.cvr,
    email: company.email,
    telephone: company.phone,
    address: headquarters ? postalAddress(headquarters) : undefined,
    location: offices.map((office) => ({
      "@type": "Place",
      name: `${company.name} ${office.city}`,
      address: postalAddress(office),
    })),
    knowsLanguage: [...languages],
    areaServed: markets.map((market) => ({
      "@type": "Country",
      identifier: market.countryCode,
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: company.phone,
        email: company.salesEmail,
        availableLanguage: [...languages],
        areaServed: markets.map((market) => market.countryCode),
      },
      {
        "@type": "ContactPoint",
        contactType: "human resources",
        email: company.careersEmail,
        availableLanguage: ["da"],
      },
    ],
    // Only emitted when a profile actually exists, so the property never ships empty.
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: company.name,
    inLanguage: locale === "da" ? "da-DK" : "en",
    publisher: { "@id": organizationId },
  };
}

export function serviceSchema(input: {
  locale: Locale;
  href: AppPathname;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.locale, input.href),
    provider: { "@id": organizationId },
    serviceType: input.name,
    areaServed: markets.map((market) => ({
      "@type": "Country",
      identifier: market.countryCode,
    })),
    availableLanguage: [...languages],
  };
}

export function faqSchema(entries: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; href: AppPathname }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absoluteUrl(locale, step.href),
    })),
  };
}

export function jobPostingSchema(input: {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  employmentType: string;
  offices: Office[];
  remote?: boolean;
  datePosted: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    employmentType: input.employmentType,
    datePosted: input.datePosted,
    hiringOrganization: { "@id": organizationId },
    url: absoluteUrl(input.locale, {
      pathname: "/careers/[slug]",
      params: { slug: input.slug },
    }),
    directApply: false,
    ...(input.remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: markets.map((market) => ({
            "@type": "Country",
            identifier: market.countryCode,
          })),
        }
      : {}),
    jobLocation:
      input.offices.length > 0
        ? input.offices.map((office) => ({
            "@type": "Place",
            address: postalAddress(office),
          }))
        : [
            {
              "@type": "Place",
              address: { "@type": "PostalAddress", addressCountry: "DK" },
            },
          ],
  };
}
