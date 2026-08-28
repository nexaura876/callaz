import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { industries } from "@/content/solutions";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.industries" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/industries"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/industries",
    }),
  };
}

export default async function IndustriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("industries");
  const nav = await getTranslations("nav");

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
          <Breadcrumb trail={[{ label: nav("industries") }]} />

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
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((id, index) => (
            <li key={id}>
              <Reveal delay={index * 50} className="h-full">
                <div className="hairline flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-panel p-7 transition duration-300 hover:bg-panel-2">
                  <h2 className="font-display text-lg font-semibold text-heading">
                    {t(`sectors.${id}.title`)}
                  </h2>
                  <p className="text-muted text-[0.95rem] leading-relaxed">
                    {t(`sectors.${id}.body`)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-panel/60">
        <div className="container-page py-24 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <SectionHeading
              eyebrow={t("adapt.eyebrow")}
              title={t("adapt.title")}
              lead={t("adapt.lead")}
            />

            <Reveal>
              <ul className="flex flex-col">
                {(t.raw("adapt.items") as { title: string; body: string }[]).map(
                  (item) => (
                    <li key={item.title} className="border-b border-line py-6">
                      <div className="flex items-start gap-4">
                        <Icon
                          name="check"
                          className="text-accent mt-1 size-5 shrink-0"
                        />
                        <div className="flex flex-col gap-1.5">
                          <h3 className="font-display font-semibold text-heading">
                            {item.title}
                          </h3>
                          <p className="text-muted text-[0.95rem] leading-relaxed">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-page py-24 lg:py-32">
        <div className="hairline rounded-[var(--radius-panel)] bg-panel px-6 py-12 sm:px-12 lg:px-16">
          <div className="flex max-w-3xl flex-col gap-5">
            <Eyebrow>{t("honesty.eyebrow")}</Eyebrow>
            <h2 className="font-display text-[1.7rem] leading-[1.15] font-semibold text-heading sm:text-[2.1rem]">
              {t("honesty.title")}
            </h2>
            <p className="text-muted leading-relaxed">{t("honesty.body")}</p>
          </div>
        </div>
      </section>

      <CtaBanner />

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav("home"), href: "/" },
          { name: nav("industries"), href: "/industries" },
        ])}
      />
    </>
  );
}
