import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { company, offices } from "@/content/company";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { Team } from "@/components/sections/Team";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/about"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/about",
    }),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const nav = await getTranslations("nav");
  const countryName = await getTranslations("countries");
  const headquarters = offices.find((office) => office.headquarters) ?? offices[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid bg-grid-fade absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/14 animate-drift pointer-events-none absolute -top-40 right-[-8%] size-[30rem] rounded-full blur-3xl"
        />

        <div className="container-page relative py-14 lg:py-20">
          <Breadcrumb trail={[{ label: nav("about") }]} />

          <div className="mt-10 flex max-w-3xl flex-col items-start gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.035em] text-heading sm:text-[3.1rem] lg:text-[3.6rem]">
              {t("title")}
            </h1>
            {(t.raw("lead") as string[]).map((paragraph) => (
              <p key={paragraph} className="text-muted text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- story */}
      <section className="container-page py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionHeading title={t("story.title")} />
            {(t.raw("story.paragraphs") as string[]).map((paragraph) => (
              <p key={paragraph} className="text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <Reveal>
            <dl className="hairline flex flex-col gap-0 rounded-[var(--radius-panel)] bg-panel p-8 lg:p-10">
              {[
                { label: t("facts.legalName"), value: company.legalName },
                { label: t("facts.cvr"), value: company.cvr },
                { label: t("facts.founded"), value: String(company.founded) },
                {
                  label: t("facts.headquarters"),
                  value: headquarters
                    ? `${headquarters.city}, ${countryName(headquarters.countryCode)}`
                    : "-",
                },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-4 last:border-0"
                >
                  <dt className="text-muted font-mono text-[0.7rem] tracking-[0.16em] uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-right font-medium text-heading">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <Team />

      {/* --------------------------------------------------------------- values */}
      <section className="border-y border-line bg-panel/60">
        <div className="container-page py-24 lg:py-32">
          <SectionHeading
            eyebrow={t("values.eyebrow")}
            title={t("values.title")}
            lead={t("values.lead")}
          />

          <ul className="mt-16 grid gap-5 md:grid-cols-3">
            {(t.raw("values.items") as { title: string; body: string }[]).map(
              (value, index) => (
                <li key={value.title}>
                  <Reveal delay={index * 70} className="h-full">
                    <div className="hairline flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-panel p-8">
                      <span className="text-accent font-display numeric text-sm font-medium">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-heading">
                        {value.title}
                      </h3>
                      <p className="text-muted leading-relaxed">{value.body}</p>
                    </div>
                  </Reveal>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav("home"), href: "/" },
          { name: nav("about"), href: "/about" },
        ])}
      />
    </>
  );
}
