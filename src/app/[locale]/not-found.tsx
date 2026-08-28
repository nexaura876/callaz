import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { footerNav } from "@/components/layout/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const nav = await getTranslations("nav");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade absolute inset-0 opacity-60"
      />

      <div className="container-page relative flex min-h-[60vh] flex-col items-center justify-center gap-8 py-24 text-center lg:py-32">
        <span className="text-faint font-display numeric text-[6rem] leading-none font-semibold sm:text-[8rem]">
          404
        </span>

        <div className="flex max-w-xl flex-col gap-4">
          <h1 className="font-display text-[1.9rem] leading-[1.1] font-semibold text-heading sm:text-[2.4rem]">
            {t("title")}
          </h1>
          <p className="text-muted leading-relaxed">{t("body")}</p>
        </div>

        <ButtonLink href="/" size="lg" withArrow>
          {t("cta")}
        </ButtonLink>

        <nav aria-label={t("suggestionsLabel")} className="mt-4">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {footerNav.solutions.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-muted hairline inline-block rounded-full px-4 py-2 text-sm transition hover:bg-panel-2 hover:text-heading"
                >
                  {nav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
