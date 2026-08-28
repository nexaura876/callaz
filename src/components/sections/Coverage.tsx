import { getTranslations } from "next-intl/server";
import { company, languages, markets, offices } from "@/content/company";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Market, languages and where the team sits, read straight from the config.
 *
 * This started as a six-across grid of countries. Callaz sells in Denmark only, so
 * that layout left five empty cells and made one market look like a shortfall. The
 * section now argues the other way round — one market, known properly — and reads
 * as a fact sheet rather than a scoreboard.
 *
 * Nothing here is a claim about volume, only about where the team is set up to
 * call. If a second market is ever added, the rows grow on their own.
 */
export async function Coverage() {
  const t = await getTranslations("coverage");
  const country = await getTranslations("markets");
  const language = await getTranslations("languages");
  const countryName = await getTranslations("countries");
  const headquarters = offices.find((office) => office.headquarters) ?? offices[0];

  const rows = [
    {
      icon: "globe" as const,
      label: t("marketLabel"),
      value: markets.map((market) => country(market.id)).join(", "),
      meta: markets.map((market) => market.dial).join(" · "),
    },
    {
      icon: "users" as const,
      label: t("languagesLabel"),
      value: languages.map((id) => language(id)).join(", "),
      meta: null,
    },
    {
      icon: "pin" as const,
      label: t("baseLabel"),
      value: headquarters ? `${headquarters.city}, ${countryName(headquarters.countryCode)}` : "-",
      meta: headquarters ? headquarters.timezone : null,
    },
    {
      icon: "phone" as const,
      label: t("reachLabel"),
      value: company.phone,
      meta: null,
    },
  ];

  return (
    <section className="container-page py-24 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
          <p className="text-faint max-w-xl text-sm leading-relaxed">{t("note")}</p>
        </div>

        <Reveal>
          <dl className="hairline flex flex-col rounded-[var(--radius-panel)] bg-panel p-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="border-line flex items-center gap-5 border-b px-5 py-5 last:border-0"
              >
                <span className="text-accent hairline inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <Icon name={row.icon} className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <dt className="text-faint font-mono text-[0.68rem] tracking-[0.18em] uppercase">
                    {row.label}
                  </dt>
                  <dd className="font-display text-heading text-lg font-semibold">
                    {row.value}
                    {row.meta ? (
                      <span className="text-muted numeric ml-2.5 font-sans text-sm font-normal">
                        {row.meta}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
