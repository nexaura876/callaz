import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/navigation";
import { company } from "@/content/company";
import { solutions } from "@/content/solutions";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LogoMark } from "@/components/layout/Logo";
import { Coverage } from "@/components/sections/Coverage";
import { CtaBanner } from "@/components/sections/CtaBanner";

type PageProps = { params: Promise<{ locale: Locale }> };

const solutionIcons: Record<string, IconName> = {
  appointmentSetting: "target",
  outboundSales: "chart",
  customerService: "headset",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: alternatesFor(locale, "/"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/",
    }),
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");

  return (
    <>
      {/* ------------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-grid bg-grid-fade absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/16 animate-drift pointer-events-none absolute -top-48 right-[-12%] size-[38rem] rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/16 pointer-events-none absolute top-[18%] left-[-16%] size-[30rem] rounded-full blur-3xl"
        />

        <div className="container-page relative flex max-w-3xl flex-col items-start gap-7 py-16 lg:py-24">
          {/*
            The brand lockup opens the page rather than sitting only in the
            header. The slogan is part of the artwork, so it travels in the alt
            text as well — it is the only place those words appear on the page.
          */}
          <LogoMark
            alt={`${company.name} — ${common("slogan")}`}
            className="h-24 sm:h-28"
          />

          <Eyebrow>{t("hero.eyebrow")}</Eyebrow>

          <h1 className="font-display text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-heading sm:text-[3.4rem] lg:text-[4.1rem]">
            {t("hero.titleLead")}{" "}
            <span className="text-gradient">{t("hero.titleAccent")}</span>
          </h1>

          <p className="text-muted max-w-xl text-lg leading-relaxed lg:text-xl">
            {t("hero.lead")}
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/quote" size="lg" withArrow>
              {t("hero.primary")}
            </ButtonLink>
            <ButtonLink href="/solutions" variant="outline" size="lg">
              {t("hero.secondary")}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- solutions */}
      <section className="container-page py-24 lg:py-32">
        <SectionHeading
          eyebrow={t("solutions.eyebrow")}
          title={t("solutions.title")}
          lead={t("solutions.lead")}
        />

        <ul className="mt-16 grid gap-5 md:grid-cols-2">
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
                      <Icon
                        name={solutionIcons[solution.id] ?? "spark"}
                        className="size-6"
                      />
                    </span>
                    <span className="text-faint numeric font-mono text-sm">
                      {solution.tag}
                    </span>
                  </div>

                  <div className="relative flex flex-col gap-3">
                    <h3 className="font-display text-2xl font-semibold text-heading">
                      {nav(solution.id)}
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {t(`solutions.cards.${solution.id}`)}
                    </p>
                  </div>

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

      {/* -------------------------------------------------------------- coverage */}
      <Coverage />

      {/* --------------------------------------------------------------- careers */}
      <section className="container-page pb-24 lg:pb-32">
        <div className="hairline relative overflow-hidden rounded-[var(--radius-panel)] bg-panel px-6 py-14 sm:px-12 lg:px-16">
          <div
            aria-hidden="true"
            className="bg-accent-glow/14 pointer-events-none absolute -top-28 right-0 size-80 rounded-full blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-5">
              <Eyebrow>{t("careers.eyebrow")}</Eyebrow>
              <h2 className="font-display text-[1.9rem] leading-[1.1] font-semibold text-heading sm:text-[2.4rem]">
                {t("careers.title")}
              </h2>
              <p className="text-muted max-w-xl leading-relaxed">{t("careers.body")}</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/careers" withArrow>
                  {t("careers.cta")}
                </ButtonLink>
                <ExternalButtonLink
                  href={`mailto:${company.careersEmail}`}
                  variant="ghost"
                >
                  <Icon name="mail" className="size-4" />
                  {company.careersEmail}
                </ExternalButtonLink>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {t.raw("careers.points").map((point: string) => (
                <li
                  key={point}
                  className="text-body flex items-start gap-3 text-[0.95rem]"
                >
                  <Icon name="check" className="text-accent mt-1 size-4 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
