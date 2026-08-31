import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/navigation";
import { solutions } from "@/content/solutions";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";

type PageProps = { params: Promise<{ locale: Locale }> };

const icons: Record<string, IconName> = {
  appointmentSetting: "target",
  outboundSales: "chart",
  customerService: "headset",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.solutions" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/solutions"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/solutions",
    }),
  };
}

export default async function SolutionsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("solutionsIndex");
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
          className="bg-accent-glow/14 animate-drift pointer-events-none absolute -top-40 right-[-8%] size-[30rem] rounded-full blur-3xl"
        />

        <div className="container-page relative py-14 lg:py-20">
          <Breadcrumb trail={[{ label: nav("solutions") }]} />

          <div className="mt-10 flex max-w-3xl flex-col items-start gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.035em] text-heading sm:text-[3.1rem] lg:text-[3.6rem]">
              {t("title")}
            </h1>
            <p className="text-muted text-lg leading-relaxed">{t("lead")}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-24 lg:py-32">
        <ul className="grid gap-5 md:grid-cols-2">
          {solutions.map((solution, index) => (
            <li key={solution.id}>
              <Reveal delay={index * 70} className="h-full">
                <Link
                  href={solution.href}
                  className="group hairline relative flex h-full flex-col gap-6 overflow-hidden rounded-[var(--radius-card)] bg-panel p-8 transition duration-300 ease-[var(--ease-out-soft)] hover:bg-panel-2 lg:p-10"
                >
                  <div
                    aria-hidden="true"
                    className="bg-accent-glow/12 pointer-events-none absolute -top-24 -right-20 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="text-accent hairline group-hover:bg-accent group-hover:text-on-accent inline-flex size-12 items-center justify-center rounded-2xl bg-panel transition duration-300">
                      <Icon name={icons[solution.id] ?? "spark"} className="size-6" />
                    </span>
                    <span className="text-faint numeric font-mono text-sm">
                      {solution.tag}
                    </span>
                  </div>

                  <div className="relative flex flex-col gap-3">
                    <h2 className="font-display text-2xl font-semibold text-heading">
                      {nav(solution.id)}
                    </h2>
                    <p className="text-muted leading-relaxed">
                      {t(`cards.${solution.id}.body`)}
                    </p>
                  </div>

                  <ul className="relative flex flex-wrap gap-2 pt-1">
                    {(t.raw(`cards.${solution.id}.points`) as string[]).map((point) => (
                      <li
                        key={point}
                        className="text-muted hairline rounded-full px-3.5 py-1.5 text-sm"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  <span className="text-accent relative mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold">
                    {common("readMore")}
                    <Icon
                      name="arrow-right"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-panel/60">
        <div className="container-page py-24 lg:py-32">
          <SectionHeading
            eyebrow={t("engagement.eyebrow")}
            title={t("engagement.title")}
            lead={t("engagement.lead")}
          />

          <ul className="mt-16 grid gap-5 md:grid-cols-3">
            {(t.raw("engagement.models") as { title: string; body: string }[]).map(
              (model, index) => (
                <li key={model.title}>
                  <Reveal delay={index * 70} className="h-full">
                    <div className="hairline flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-panel p-8">
                      <h3 className="font-display text-xl font-semibold text-heading">
                        {model.title}
                      </h3>
                      <p className="text-muted leading-relaxed">{model.body}</p>
                    </div>
                  </Reveal>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <CtaBanner />

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav("home"), href: "/" },
          { name: nav("solutions"), href: "/solutions" },
        ])}
      />
    </>
  );
}
