import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { company } from "@/content/company";
import { alternatesFor } from "@/lib/site";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Waveform } from "@/components/sections/Waveform";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.thankYou" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/thank-you"),
    // A confirmation page has no business in the index, and it would only ever be
    // reached by a crawler following a form it cannot submit.
    robots: { index: false, follow: true },
  };
}

export default async function ThankYouPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("thankYou");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade absolute inset-0 opacity-60"
      />
      <div
        aria-hidden="true"
        className="bg-accent-glow/16 animate-drift pointer-events-none absolute -top-40 right-[-10%] size-[32rem] rounded-full blur-3xl"
      />

      <div className="container-page relative flex min-h-[60vh] flex-col items-center justify-center gap-8 py-24 text-center lg:py-32">
        <span className="text-accent hairline inline-flex size-16 items-center justify-center rounded-2xl bg-panel">
          <Icon name="check" className="size-8" />
        </span>

        <div className="flex max-w-2xl flex-col gap-5">
          <h1 className="font-display text-[2.2rem] leading-[1.06] font-semibold tracking-[-0.035em] text-heading sm:text-[2.9rem]">
            {t("title")}
          </h1>
          <p className="text-muted text-lg leading-relaxed">{t("body")}</p>
        </div>

        <Waveform className="h-10 w-full max-w-sm opacity-60" />

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg" withArrow>
            {t("home")}
          </ButtonLink>
          <ExternalButtonLink href={company.phoneHref} variant="outline" size="lg">
            <Icon name="phone" className="size-4" />
            {company.phone}
          </ExternalButtonLink>
        </div>

        <p className="text-faint text-sm">{t("note")}</p>
      </div>
    </section>
  );
}
