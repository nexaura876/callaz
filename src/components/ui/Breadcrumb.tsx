import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";

type Crumb = {
  label: string;
  href?: StaticPathname;
};

export async function Breadcrumb({ trail }: { trail: Crumb[] }) {
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");

  return (
    <nav aria-label={common("breadcrumbLabel")}>
      <ol className="text-muted flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide">
        <li>
          <Link href="/" className="-my-3 inline-flex min-h-11 items-center py-3 transition hover:text-heading">
            {nav("home")}
          </Link>
        </li>
        {trail.map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-faint">
              /
            </span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="-my-3 inline-flex min-h-11 items-center py-3 transition hover:text-heading"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-body">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
