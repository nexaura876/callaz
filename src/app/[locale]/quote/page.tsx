import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryForm } from "@/components/sections/EnquiryForm";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.quote" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/quote"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/quote",
    }),
  };
}

export default async function QuotePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("quote");
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
          className="bg-accent-glow/16 animate-drift pointer-events-none absolute -top-44 right-[-10%] size-[34rem] rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/14 pointer-events-none absolute bottom-[-20%] left-[-12%] size-[26rem] rounded-full blur-3xl"
        />

        <div className="container-page relative py-14 lg:py-20">
          <Breadcrumb trail={[{ label: nav("quote") }]} />

          <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <div className="flex flex-col items-start gap-7">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h1 className="font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.035em] text-heading sm:text-[3.1rem] lg:text-[3.5rem]">
                {t("title")}
              </h1>
              <p className="text-muted text-lg leading-relaxed">{t("lead")}</p>

              <ol className="mt-2 flex flex-col gap-5">
                {(t.raw("steps") as { title: string; body: string }[]).map(
                  (step, index) => (
                    <li key={step.title} className="flex items-start gap-4">
                      <span className="bg-accent text-on-accent font-display numeric inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="font-medium text-heading">{step.title}</span>
                        <span className="text-muted text-[0.95rem] leading-relaxed">
                          {step.body}
                        </span>
                      </span>
                    </li>
                  ),
                )}
              </ol>

              <ul className="mt-2 flex flex-col gap-2.5">
                {(t.raw("assurances") as string[]).map((item) => (
                  <li
                    key={item}
                    className="text-muted flex items-start gap-3 text-[0.95rem]"
                  >
                    <Icon name="check" className="text-accent mt-1 size-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal>
              <div className="hairline rounded-[var(--radius-panel)] bg-panel p-7 lg:p-10">
                <EnquiryForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbSchema(locale, [
            { name: nav("home"), href: "/" },
            { name: nav("quote"), href: "/quote" },
          ]),
        ]}
      />
    </>
  );
}
