import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import type { SolutionId } from "@/content/solutions";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Metrics } from "@/components/sections/Metrics";
import { Waveform } from "@/components/sections/Waveform";

type Entry = { title: string; body: string };
type FaqEntry = { q: string; a: string };

type Props = {
  id: SolutionId;
  href: StaticPathname;
  locale: Locale;
  icon: IconName;
};

/**
 * One layout, four pages. Everything that differs between them lives under
 * solutions.<id> in the message catalogue, so a new service is a translation entry
 * plus a four-line page file rather than another slab of markup.
 */
export async function SolutionPage({ id, href, locale, icon }: Props) {
  const t = await getTranslations(`solutions.${id}`);
  const shared = await getTranslations("solutions.shared");
  const nav = await getTranslations("nav");

  const capabilities = t.raw("capabilities") as Entry[];
  const deliverables = t.raw("deliverables") as Entry[];
  const faq = t.raw("faq") as FaqEntry[];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid bg-grid-fade absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/14 animate-drift pointer-events-none absolute -top-40 right-[-10%] size-[32rem] rounded-full blur-3xl"
        />

        <div className="container-page relative py-14 lg:py-20">
          <Breadcrumb trail={[{ label: nav("solutions"), href: "/solutions" }, { label: nav(id) }]} />

          <div className="mt-10 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
            <div className="flex flex-col items-start gap-6">
              <span className="text-accent hairline inline-flex size-14 items-center justify-center rounded-2xl bg-panel">
                <Icon name={icon} className="size-7" />
              </span>

              <Eyebrow>{t("eyebrow")}</Eyebrow>

              <h1 className="font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.035em] text-heading sm:text-[3.1rem] lg:text-[3.6rem]">
                {t("title")}
              </h1>

              <p className="text-muted max-w-2xl text-lg leading-relaxed">
                {t("lead")}
              </p>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/quote" size="lg" withArrow>
                  {shared("ctaPrimary")}
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline" size="lg">
                  {shared("ctaSecondary")}
                </ButtonLink>
              </div>
            </div>

            <Reveal>
              <div className="hairline rounded-[var(--radius-panel)] bg-panel p-7 lg:p-9">
                <Waveform className="h-10" />
                <div className="mt-8 border-t border-line pt-8">
                  <Metrics />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- capabilities */}
      <section className="container-page py-24 lg:py-32">
        <SectionHeading
          eyebrow={shared("capabilitiesEyebrow")}
          title={t("capabilitiesTitle")}
          lead={t("capabilitiesLead")}
        />

        <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability, index) => (
            <li key={capability.title}>
              <Reveal delay={index * 60} className="h-full">
                <div className="hairline flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-panel p-7 transition duration-300 hover:bg-panel-2">
                  <span className="text-accent font-display numeric text-sm font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-heading">
                    {capability.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{capability.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* --------------------------------------------------------- deliverables */}
      <section className="border-y border-line bg-panel/60">
        <div className="container-page py-24 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow={shared("deliverablesEyebrow")}
                title={t("deliverablesTitle")}
                lead={t("deliverablesLead")}
              />
            </div>

            <ul className="flex flex-col">
              {deliverables.map((deliverable, index) => (
                <li key={deliverable.title}>
                  <Reveal delay={index * 60}>
                    <div className="flex items-start gap-5 border-b border-line py-7">
                      <Icon
                        name="check"
                        className="text-accent mt-1 size-5 shrink-0"
                      />
                      <div className="flex flex-col gap-2">
                        <h3 className="font-display text-lg font-semibold text-heading">
                          {deliverable.title}
                        </h3>
                        <p className="text-muted leading-relaxed">
                          {deliverable.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- fit / no fit */}
      <section className="container-page py-24 lg:py-32">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="hairline flex h-full flex-col gap-5 rounded-[var(--radius-card)] bg-panel p-8 lg:p-10">
              <span className="text-accent inline-flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.2em] uppercase">
                <Icon name="check" className="size-4" />
                {shared("fitTitle")}
              </span>
              <ul className="flex flex-col gap-3.5">
                {(t.raw("fit") as string[]).map((item) => (
                  <li key={item} className="text-body flex items-start gap-3">
                    <Icon
                      name="check"
                      className="text-accent mt-1 size-4 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <div className="hairline flex h-full flex-col gap-5 rounded-[var(--radius-card)] p-8 lg:p-10">
              <span className="text-muted inline-flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.2em] uppercase">
                <Icon name="close" className="size-4" />
                {shared("noFitTitle")}
              </span>
              <ul className="flex flex-col gap-3.5">
                {(t.raw("noFit") as string[]).map((item) => (
                  <li key={item} className="text-muted flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="bg-ink-600 mt-2.5 size-1.5 shrink-0 rounded-full"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-faint mt-auto pt-4 text-sm leading-relaxed">
                {shared("noFitNote")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Faq eyebrow={shared("faqEyebrow")} title={t("faqTitle")} entries={faq} />

      <CtaBanner />

      <JsonLd
        data={[
          serviceSchema({
            locale,
            href,
            name: t("title"),
            description: t("lead"),
          }),
          faqSchema(faq),
          breadcrumbSchema(locale, [
            { name: nav("home"), href: "/" },
            { name: nav("solutions"), href: "/solutions" },
            { name: nav(id), href },
          ]),
        ]}
      />
    </>
  );
}
