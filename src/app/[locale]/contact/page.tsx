import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/navigation";
import { company, offices } from "@/content/company";
import { alternatesFor, openGraphFor } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryForm } from "@/components/sections/EnquiryForm";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/contact"),
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      href: "/contact",
    }),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const nav = await getTranslations("nav");
  const countryName = await getTranslations("countries");
  const headquarters = offices.find((office) => office.headquarters) ?? offices[0];

  /*
   * Sales and careers currently resolve to the same mailbox, because the domain
   * has no mail on it yet. Listing one address three times under three headings
   * reads as a template nobody finished, so identical destinations collapse into
   * a single card. The moment the addresses differ, all three appear again with
   * no code change.
   */
  const allChannels = [
    {
      icon: "phone" as const,
      label: t("channels.phone"),
      value: company.phone,
      href: company.phoneHref,
      note: t("channels.phoneNote"),
    },
    {
      icon: "mail" as const,
      label: t("channels.sales"),
      value: company.salesEmail,
      href: `mailto:${company.salesEmail}`,
      note: t("channels.salesNote"),
    },
    {
      icon: "users" as const,
      label: t("channels.careers"),
      value: company.careersEmail,
      href: `mailto:${company.careersEmail}`,
      note: t("channels.careersNote"),
    },
  ];

  const channels = allChannels.filter(
    (channel, index) =>
      allChannels.findIndex((other) => other.href === channel.href) === index,
  );

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
          <Breadcrumb trail={[{ label: nav("contact") }]} />

          <div className="mt-10 flex max-w-3xl flex-col items-start gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.035em] text-heading sm:text-[3.1rem] lg:text-[3.6rem]">
              {t("title")}
            </h1>
            <p className="text-muted text-lg leading-relaxed">{t("lead")}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="flex flex-col gap-10">
            <ul className="flex flex-col gap-4">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="group hairline flex items-start gap-4 rounded-[var(--radius-card)] bg-panel p-6 transition hover:bg-panel-2"
                  >
                    <span className="text-accent hairline inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-panel">
                      <Icon name={channel.icon} className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-muted font-mono text-[0.68rem] tracking-[0.18em] uppercase">
                        {channel.label}
                      </span>
                      <span className="group-hover:text-accent font-medium break-words text-heading transition">
                        {channel.value}
                      </span>
                      <span className="text-faint text-sm leading-relaxed">
                        {channel.note}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {headquarters ? (
              <div className="hairline flex flex-col gap-3 rounded-[var(--radius-card)] p-6">
                <span className="text-muted font-mono text-[0.68rem] tracking-[0.18em] uppercase">
                  {t("addressTitle")}
                </span>
                <p className="text-body leading-relaxed">
                  {company.legalName}
                  <br />
                  {headquarters.street}
                  <br />
                  {headquarters.postalCode} {headquarters.city}
                  <br />
                  {countryName(headquarters.countryCode)}
                </p>
                <p className="text-faint font-mono text-xs">CVR {company.cvr}</p>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <span className="text-muted font-mono text-[0.68rem] tracking-[0.18em] uppercase">
                {t("hoursTitle")}
              </span>
              <p className="text-muted leading-relaxed">{t("hoursBody")}</p>
            </div>
          </div>

          <div className="hairline rounded-[var(--radius-panel)] bg-panel p-7 lg:p-10">
            <h2 className="font-display text-2xl font-semibold text-heading">
              {t("formTitle")}
            </h2>
            <p className="text-muted mt-3 mb-8 leading-relaxed">{t("formLead")}</p>
            <EnquiryForm />
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav("home"), href: "/" },
          { name: nav("contact"), href: "/contact" },
        ])}
      />
    </>
  );
}
