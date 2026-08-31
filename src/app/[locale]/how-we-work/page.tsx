import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { principles } from "@/content/metrics";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

type PageProps = { params: Promise<{ locale: Locale }> };

const principleIcons: Record<string, IconName> = {
  recordedCalls: "shield",
  namedTeam: "users",
  weeklyReporting: "chart",
  gdprByDefault: "shield",
  noLockIn: "spark",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.howWeWork" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/how-we-work"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/how-we-work",
    }),
  };
}

export default async function HowWeWorkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("howWeWork");
  const nav = await getTranslations("nav");
  const faq = t.raw("faq") as { q: string; a: string }[];

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
          <Breadcrumb trail={[{ label: nav("howWeWork") }]} />

          <div className="mt-10 flex max-w-2xl flex-col items-start gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.035em] text-heading sm:text-[3.1rem] lg:text-[3.6rem]">
              {t("title")}
            </h1>
            <p className="text-muted text-lg leading-relaxed">{t("lead")}</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- phases */}
      <section className="container-page py-24 lg:py-32">
        <SectionHeading
          eyebrow={t("phases.eyebrow")}
          title={t("phases.title")}
          lead={t("phases.lead")}
        />

        <ol className="mt-16 flex flex-col">
          {(
            t.raw("phases.items") as {
              title: string;
              body: string;
              duration: string;
              outputs: string[];
            }[]
          ).map((phase, index) => (
            <li key={phase.title}>
              <Reveal delay={index * 60}>
                <div className="grid gap-6 border-t border-line py-10 lg:grid-cols-[auto_1fr_1fr] lg:gap-12">
                  <div className="flex items-start gap-4 lg:w-40">
                    <span className="text-accent font-display numeric text-sm font-medium">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-faint font-mono text-xs tracking-[0.14em] uppercase">
                      {phase.duration}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="font-display text-2xl font-semibold text-heading">
                      {phase.title}
                    </h3>
                    <p className="text-muted leading-relaxed">{phase.body}</p>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {phase.outputs.map((output) => (
                      <li
                        key={output}
                        className="text-body flex items-start gap-3 text-[0.95rem]"
                      >
                        <Icon
                          name="check"
                          className="text-accent mt-1 size-4 shrink-0"
                        />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------ principles */}
      <section className="border-y border-line bg-panel/60">
        <div className="container-page py-24 lg:py-32">
          <SectionHeading
            eyebrow={t("principles.eyebrow")}
            title={t("principles.title")}
            lead={t("principles.lead")}
          />

          <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {principles.map((id, index) => (
              <li key={id}>
                <Reveal delay={index * 60} className="h-full">
                  <div className="hairline flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-panel p-7">
                    <span className="text-accent hairline inline-flex size-11 items-center justify-center rounded-xl bg-panel">
                      <Icon name={principleIcons[id] ?? "check"} className="size-5" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-heading">
                      {t(`principles.items.${id}.title`)}
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {t(`principles.items.${id}.body`)}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq title={t("faqTitle")} entries={faq} />

      <CtaBanner />

      <JsonLd
        data={[
          faqSchema(faq),
          breadcrumbSchema(locale, [
            { name: nav("home"), href: "/" },
            { name: nav("howWeWork"), href: "/how-we-work" },
          ]),
        ]}
      />
    </>
  );
}
