import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav("home"), href: "/" },
          { name: nav("careers"), href: "/careers" },
        ])}
      />
    </>
  );
}
