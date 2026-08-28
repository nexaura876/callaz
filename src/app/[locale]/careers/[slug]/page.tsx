import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { company } from "@/content/company";
import { getJob, jobs, officesFor } from "@/content/jobs";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema, jobPostingSchema } from "@/lib/schema";
import { ExternalButtonLink } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/JsonLd";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

/**
 * Openings change rarely, so every locale and slug pair is rendered at build time.
 * A role removed from the array turns into a 404 on the next deploy, which is the
 * behaviour Google expects from a closed posting.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    jobs.map((job) => ({ locale, slug: job.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = getJob(slug);
  if (!job) return {};

  const t = await getTranslations({ locale, namespace: `careers.jobs.${slug}` });
  const href = { pathname: "/careers/[slug]" as const, params: { slug } };

  return {
    title: t("title"),
    description: t("summary"),
    alternates: alternatesFor(locale, href),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("summary"),
      href,
    }),
  };
}

export default async function JobPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const job = getJob(slug);
  if (!job) notFound();

  const t = await getTranslations(`careers.jobs.${slug}`);
  const careers = await getTranslations("careers");
  const nav = await getTranslations("nav");

  const cities = officesFor(job);
  const responsibilities = t.raw("responsibilities") as string[];
  const requirements = t.raw("requirements") as string[];

  const location =
    job.remote || cities.length === 0
      ? careers("openings.remote")
      : cities.map((office) => office.city).join(", ");

  const subject = encodeURIComponent(`${t("title")} — ${careers("apply.subject")}`);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid bg-grid-fade absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/14 animate-drift pointer-events-none absolute -top-40 right-[-8%] size-[28rem] rounded-full blur-3xl"
        />

        <div className="container-page relative py-14 lg:py-20">
          <Breadcrumb
            trail={[{ label: nav("careers"), href: "/careers" }, { label: t("title") }]}
          />

          <div className="mt-10 flex max-w-3xl flex-col items-start gap-6">
            <Eyebrow>{careers("openings.eyebrow")}</Eyebrow>
            <h1 className="font-display text-[2.2rem] leading-[1.06] font-semibold tracking-[-0.035em] text-heading sm:text-[2.9rem] lg:text-[3.3rem]">
              {t("title")}
            </h1>
            <p className="text-muted text-lg leading-relaxed">{t("summary")}</p>

            <ul className="mt-2 flex flex-wrap gap-3">
              <li className="text-muted hairline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Icon name="pin" className="size-4" />
                {location}
              </li>
              <li className="text-muted hairline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Icon name="clock" className="size-4" />
                {careers(`employmentTypes.${job.employmentType}`)}
              </li>
              <li className="text-muted hairline inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Icon name="globe" className="size-4" />
                {t("language")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-2xl font-semibold text-heading">
                {careers("job.aboutTitle")}
              </h2>
              {(t.raw("about") as string[]).map((paragraph) => (
                <p key={paragraph} className="text-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <h2 className="font-display text-2xl font-semibold text-heading">
                {careers("job.responsibilitiesTitle")}
              </h2>
              <ul className="flex flex-col gap-3">
                {responsibilities.map((item) => (
                  <li key={item} className="text-muted flex items-start gap-3">
                    <Icon name="check" className="text-accent mt-1 size-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h2 className="font-display text-2xl font-semibold text-heading">
                {careers("job.requirementsTitle")}
              </h2>
              <ul className="flex flex-col gap-3">
                {requirements.map((item) => (
                  <li key={item} className="text-muted flex items-start gap-3">
                    <Icon name="check" className="text-accent mt-1 size-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="hairline flex flex-col gap-5 rounded-[var(--radius-panel)] bg-panel p-8">
              <h2 className="font-display text-xl font-semibold text-heading">
                {careers("apply.title")}
              </h2>
              <p className="text-muted leading-relaxed">{careers("apply.body")}</p>

              <ExternalButtonLink
                href={`mailto:${company.careersEmail}?subject=${subject}`}
                size="lg"
                className="justify-center"
              >
                <Icon name="mail" className="size-4" />
                {careers("apply.cta")}
              </ExternalButtonLink>

              <p className="text-faint text-xs leading-relaxed">
                {careers("apply.note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          jobPostingSchema({
            locale,
            slug,
            title: t("title"),
            description: t("summary"),
            employmentType: job.employmentType,
            offices: cities,
            remote: job.remote,
            datePosted: t("datePosted"),
          }),
          breadcrumbSchema(locale, [
            { name: nav("home"), href: "/" },
            { name: nav("careers"), href: "/careers" },
          ]),
        ]}
      />
    </>
  );
}
