import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company } from "@/content/company";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { isGroup, primaryNav } from "./navigation";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const common = await getTranslations("common");

  return (
    <HeaderShell>
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-6">
        <Logo label={t("home")} size="md" />

        <nav aria-label={t("mainLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) =>
              isGroup(item) ? (
                <li key={item.key} className="group static">
                  {/*
                    The trigger is a real link to the overview page. Hovering opens
                    the panel, but keyboard and touch users still get somewhere
                    sensible from a single activation.
                  */}
                  <Link
                    href={item.href}
                    className="text-body flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.94rem] font-medium transition hover:bg-panel-2 hover:text-heading"
                  >
                    {t(item.key)}
                    <Icon
                      name="chevron-down"
                      className="size-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
                    />
                  </Link>

                  <div className="invisible absolute inset-x-0 top-full opacity-0 transition duration-200 ease-[var(--ease-out-soft)] group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="container-page pt-2 pb-4">
                      <div className="bg-panel-solid/95 hairline rounded-[var(--radius-panel)] p-3 shadow-[var(--shadow-lift-lg)] backdrop-blur-xl">
                        <ul className="grid grid-cols-2 gap-1">
                          {item.items.map((child) => (
                            <li key={child.key}>
                              <Link
                                href={child.href}
                                className="group/item flex items-start gap-4 rounded-[1.1rem] p-4 transition hover:bg-panel-2"
                              >
                                {child.icon ? (
                                  <span className="text-accent hairline mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-panel transition group-hover/item:bg-accent group-hover/item:text-on-accent">
                                    <Icon name={child.icon} className="size-5" />
                                  </span>
                                ) : null}
                                <span className="flex flex-col gap-1">
                                  <span className="font-display font-semibold text-heading">
                                    {t(child.key)}
                                  </span>
                                  {child.descriptionKey ? (
                                    <span className="text-muted text-sm leading-relaxed">
                                      {t(child.descriptionKey)}
                                    </span>
                                  ) : null}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-body block rounded-full px-4 py-2 text-[0.94rem] font-medium transition hover:bg-panel-2 hover:text-heading"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={company.phoneHref}
            className="text-body hidden items-center gap-2 px-2 font-mono text-[0.85rem] font-medium transition hover:text-heading xl:inline-flex"
          >
            <Icon name="phone" className="size-4" />
            {company.phone}
          </a>

          <ThemeToggle
            labels={{
              group: t("themeLabel"),
              light: t("themeLight"),
              dark: t("themeDark"),
              system: t("themeSystem"),
            }}
            className="hidden lg:flex"
          />

          <LocaleSwitcher label={t("languageLabel")} className="hidden lg:flex" />

          <ButtonLink href="/quote" className="hidden sm:inline-flex">
            {common("ctaQuote")}
          </ButtonLink>

          <MobileMenu openLabel={t("openMenu")} closeLabel={t("closeMenu")}>
            <nav aria-label={t("mainLabel")}>
              <ul className="flex flex-col gap-1">
                {primaryNav.map((item) =>
                  isGroup(item) ? (
                    <li key={item.key} className="pt-4">
                      {/*
                        Reads as a section label but is a real link to the overview
                        page, so it needs a thumb-sized target like the rest. min-h-11
                        does the work the 21px line box could not.
                      */}
                      <Link
                        href={item.href}
                        className="text-muted inline-flex min-h-11 items-center px-3 font-mono text-[0.7rem] tracking-[0.2em] uppercase transition hover:text-heading"
                      >
                        {t(item.key)}
                      </Link>
                      <ul>
                        {item.items.map((child) => (
                          <li key={child.key}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-3 py-3 text-lg font-medium text-heading transition hover:bg-panel-2"
                            >
                              {t(child.key)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        className="block rounded-xl px-3 py-3 text-lg font-medium text-heading transition hover:bg-panel-2"
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
              <span className="text-muted font-mono text-[0.7rem] tracking-[0.2em] uppercase">
                {t("languageLabel")}
              </span>
              <LocaleSwitcher label={t("languageLabel")} size="md" />
            </div>

            <div className="border-line mt-4 flex items-center justify-between gap-4 border-t pt-6">
              <span className="text-faint font-mono text-[0.7rem] tracking-[0.2em] uppercase">
                {t("themeLabel")}
              </span>
              <ThemeToggle
                size="md"
                labels={{
                  group: t("themeLabel"),
                  light: t("themeLight"),
                  dark: t("themeDark"),
                  system: t("themeSystem"),
                }}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href="/quote" size="lg" withArrow>
                {common("ctaQuote")}
              </ButtonLink>
              <a
                href={company.phoneHref}
                className="hairline inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-heading transition hover:bg-panel-2"
              >
                <Icon name="phone" className="size-4" />
                {company.phone}
              </a>
            </div>
          </MobileMenu>
        </div>
      </div>
    </HeaderShell>
  );
}
