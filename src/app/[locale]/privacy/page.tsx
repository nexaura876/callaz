import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { company, offices } from "@/content/company";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConsentTrigger } from "@/components/layout/ConsentTrigger";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.privacy" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/privacy"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/privacy",
    }),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
  const nav = await getTranslations("nav");
  const consent = await getTranslations("consent");
  const countryName = await getTranslations("countries");
  const headquarters = offices.find((office) => office.headquarters) ?? offices[0];

  const sections = t.raw("sections") as { title: string; paragraphs: string[] }[];

  return (
    <section className="container-page py-14 lg:py-20">
      <Breadcrumb trail={[{ label: nav("privacy") }]} />

      <div className="mt-10 flex max-w-3xl flex-col items-start gap-6">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="font-display text-[2.2rem] leading-[1.06] font-semibold tracking-[-0.035em] text-heading sm:text-[2.8rem]">
          {t("title")}
        </h1>
        <p className="text-muted text-lg leading-relaxed">{t("lead")}</p>
        <p className="text-faint font-mono text-xs">
          {t("updated", { date: t("updatedDate") })}
        </p>
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="hairline flex flex-col gap-3 rounded-[var(--radius-card)] bg-panel p-6">
            <span className="text-muted font-mono text-[0.68rem] tracking-[0.18em] uppercase">
              {t("controllerTitle")}
            </span>
            <p className="text-body text-sm leading-relaxed">
              {company.legalName}
              <br />
              {headquarters ? (
                <>
                  {headquarters.street}
                  <br />
                  {headquarters.postalCode} {headquarters.city}, {countryName(headquarters.countryCode)}
                  <br />
                </>
              ) : null}
              CVR {company.cvr}
            </p>
            <a
              href={`mailto:${company.email}`}
              className="text-accent text-sm font-medium underline-offset-4 hover:underline"
            >
              {company.email}
            </a>
            <div className="mt-2 border-t border-line pt-4">
              <ConsentTrigger label={consent("manage")} />
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-12">
          {sections.map((section, index) => (
            <section key={section.title} className="flex flex-col gap-4">
              <h2 className="font-display flex items-baseline gap-3 text-xl font-semibold text-heading">
                <span className="text-accent numeric font-mono text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
