import { getTranslations } from "next-intl/server";
import { company } from "@/content/company";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Eyebrow";

export async function CtaBanner() {
  const t = await getTranslations("cta");

  return (
    <section className="container-page pb-24 lg:pb-32">
      <div className="from-ink-900 via-ink-950 to-ink-1000 hairline relative overflow-hidden rounded-[var(--radius-panel)] bg-gradient-to-br px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
        <div
          aria-hidden="true"
          className="bg-accent-glow/18 animate-drift pointer-events-none absolute -top-32 -right-28 size-96 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-accent-glow/18 pointer-events-none absolute -bottom-40 -left-24 size-80 rounded-full blur-3xl"
        />

        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-5">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="font-display text-[2rem] leading-[1.08] font-semibold text-heading sm:text-[2.5rem] lg:text-[3rem]">
              {t("title")}
            </h2>
            <p className="text-muted max-w-xl text-lg leading-relaxed">{t("body")}</p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quote" size="lg" withArrow>
                {t("primary")}
              </ButtonLink>
              <ExternalButtonLink href={company.phoneHref} variant="outline" size="lg">
                <Icon name="phone" className="size-4" />
                {company.phone}
              </ExternalButtonLink>
            </div>
          </div>

          <ol className="flex flex-col gap-3">
            {t.raw("steps").map((step: { title: string; body: string }, index: number) => (
              <li
                key={step.title}
                className="hairline flex items-start gap-4 rounded-2xl bg-panel px-5 py-4"
              >
                <span className="bg-accent text-on-accent font-display numeric inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-medium text-heading">{step.title}</span>
                  <span className="text-muted text-sm leading-relaxed">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
