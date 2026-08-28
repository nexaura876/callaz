import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/navigation";
import { company } from "@/content/company";
import { jobs, officesFor } from "@/content/jobs";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { ExternalButtonLink } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.careers" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/careers"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/careers",
    }),
  };
}

export default async function CareersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("careers");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid bg-grid-fade absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/14 animate-drift pointer-events-none absolute -top-40 left-[-8%] size-[30rem] rounded-full blur-3xl"
        />

        <div className="container-page relative py-14 lg:py-20">
          <Breadcrumb trail={[{ label: nav("careers") }]} />

          <div className="mt-10 flex max-w-3xl flex-col items-start gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.035em] text-heading sm:text-[3.1rem] lg:text-[3.6rem]">
              {t("title")}
            </h1>
            <p className="text-muted text-lg leading-relaxed">{t("lead")}</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- offers */}
      <section className="container-page py-24 lg:py-32">
        <SectionHeading
          eyebrow={t("offer.eyebrow")}
          title={t("offer.title")}
          lead={t("offer.lead")}
        />

        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(t.raw("offer.items") as { title: string; body: string }[]).map(
            (item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 60} className="h-full">
                  <div className="hairline flex h-full flex-col gap-3 rounded-[var(--radius-card)] bg-panel p-7">
                    <h3 className="font-display text-lg font-semibold text-heading">
                      {item.title}
                    </h3>
                    <p className="text-muted leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              </li>
            ),
          )}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- roles */}
      <section id="roles" className="border-y border-line bg-panel/60">
        <div className="container-page scroll-mt-28 py-24 lg:py-32">
          <SectionHeading eyebrow={t("openings.eyebrow")} title={t("openings.title")} />

          <ul className="mt-14 flex flex-col">
            {jobs.map((job, index) => {
              const cities = officesFor(job);

              return (
                <li key={job.slug}>
                  <Reveal delay={index * 60}>
                    <Link
                      href={{ pathname: "/careers/[slug]", params: { slug: job.slug } }}
                      className="group flex flex-col gap-5 border-t border-line py-8 transition sm:flex-row sm:items-center sm:justify-between sm:gap-10"
                    >
                      <div className="flex flex-col gap-2.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-display text-xl font-semibold text-heading transition group-hover:text-accent sm:text-2xl">
                            {t(`jobs.${job.slug}.title`)}
                          </h3>
                          {job.featured ? (
                            <span className="bg-accent text-on-accent rounded-full px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.16em] uppercase">
                              {t("openings.featured")}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-muted max-w-2xl leading-relaxed">
                          {t(`jobs.${job.slug}.summary`)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-4">
                        <span className="text-muted hairline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                          <Icon name="pin" className="size-4" />
                          {job.remote || cities.length === 0
                            ? t("openings.remote")
                            : cities.map((office) => office.city).join(", ")}
                        </span>
                        <span className="text-muted hairline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                          <Icon name="clock" className="size-4" />
                          {t(`employmentTypes.${job.employmentType}`)}
                        </span>
                        <span className="text-accent inline-flex items-center gap-2 text-sm font-semibold">
                          {common("readMore")}
                          <Icon
                            name="arrow-right"
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <div className="hairline mt-14 flex flex-col gap-4 rounded-[var(--radius-card)] bg-panel p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-lg font-semibold text-heading">
                {t("openings.spontaneousTitle")}
              </h3>
              <p className="text-muted leading-relaxed">
                {t("openings.spontaneousBody")}
              </p>
            </div>
            <ExternalButtonLink
              href={`mailto:${company.careersEmail}`}
              variant="outline"
              className="shrink-0"
            >
              <Icon name="mail" className="size-4" />
              {company.careersEmail}
            </ExternalButtonLink>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- process */}
      <section className="container-page py-24 lg:py-32">
        <SectionHeading
          eyebrow={t("process.eyebrow")}
          title={t("process.title")}
          lead={t("process.lead")}
        />

        <ol className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {(t.raw("process.steps") as { title: string; body: string }[]).map(
            (step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 70}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-accent font-display numeric text-sm font-medium">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent"
                      />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-heading">
                      {step.title}
                    </h3>
                    <p className="text-muted leading-relaxed">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ),
          )}
        </ol>
      </section>

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav("home"), href: "/" },
          { name: nav("careers"), href: "/careers" },
        ])}
      />
    </>
  );
}
