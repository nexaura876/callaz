import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { SolutionPage } from "@/components/pages/SolutionPage";

const href = "/solutions/lead-generation" as const;
const id = "leadGeneration" as const;

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.leadGeneration" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, href),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href,
    }),
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SolutionPage id={id} href={href} locale={locale} icon="layers" />;
}
