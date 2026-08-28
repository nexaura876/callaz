import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company, markets, offices } from "@/content/company";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { footerNav } from "./navigation";
import { ConsentTrigger } from "./ConsentTrigger";

const socials: { key: keyof typeof company.social; icon: IconName; label: string }[] = [
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "facebook", icon: "facebook", label: "Facebook" },
  { key: "youtube", icon: "youtube", label: "YouTube" },
];

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const consent = await getTranslations("consent");
  const country = await getTranslations("markets");
  const countryName = await getTranslations("countries");
  const headquarters = offices.find((office) => office.headquarters) ?? offices[0];

  // An empty string in the config means the profile does not exist yet. Linking it
  // anyway would drop visitors on a 404 hosted by someone else.
  const activeSocials = socials.filter((social) => company.social[social.key]);

  const columns = [
    { title: t("solutionsTitle"), items: footerNav.solutions },
    { title: t("companyTitle"), items: footerNav.company },
    { title: t("contactTitle"), items: footerNav.contact },
  ];

  return (
    <footer className="border-t border-line">
      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:py-20">
        <div className="flex flex-col gap-6">
          <Logo label={nav("home")} size="lg" />
          <p className="text-muted max-w-xs leading-relaxed">{t("tagline")}</p>

          <div className="flex flex-col gap-2 text-sm">
            <a
              href={company.phoneHref}
              className="text-body hover:text-accent -my-2 inline-flex items-center gap-2.5 py-3 font-medium transition"
            >
              <Icon name="phone" className="size-4 shrink-0" />
              {company.phone}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="text-body hover:text-accent -my-2 inline-flex items-center gap-2.5 py-3 font-medium transition"
            >
              <Icon name="mail" className="size-4 shrink-0" />
              {company.email}
            </a>
            {headquarters ? (
              <p className="text-muted mt-1 flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 size-4 shrink-0" />
                <span>
                  {headquarters.street}
                  <br />
                  {headquarters.postalCode} {headquarters.city}, {countryName(headquarters.countryCode)}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-accent font-mono text-[0.7rem] tracking-[0.2em] uppercase">
              {column.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-0.5">
              {column.items.map((item) => (
                <li key={item.key}>
                  {/* py-2 alone gave a 39px row; min-h-11 takes it to the 44px target. */}
                  <Link
                    href={item.href}
                    className="text-muted inline-flex min-h-11 items-center py-2 text-[0.95rem] transition hover:text-heading"
                  >
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container-page">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-6">
          <span className="text-faint font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            {t("marketsTitle")}
          </span>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {markets.map((market) => (
              <li key={market.id} className="text-muted text-sm">
                <span className="text-body">{country(market.id)}</span>{" "}
                <span className="numeric font-mono text-xs">{market.dial}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-faint text-sm">
            © {new Date().getFullYear()} {company.legalName} · {t("cvr")} {company.cvr} ·{" "}
            {t("rights")}
          </p>

          <div className="flex items-center gap-4">
            <ConsentTrigger label={consent("manage")} />

            {activeSocials.length > 0 ? (
              <ul className="flex items-center gap-1.5">
                {activeSocials.map((social) => (
                  <li key={social.key}>
                    <a
                      href={company.social[social.key]}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="text-muted inline-flex size-11 items-center justify-center rounded-full transition hover:bg-panel-2 hover:text-heading"
                    >
                      <Icon name={social.icon} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
