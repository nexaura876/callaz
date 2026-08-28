"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cx } from "@/lib/cx";

type Props = {
  label: string;
  className?: string;
  /** "md" is used in the mobile panel, where the targets have to be thumb-sized. */
  size?: "sm" | "md";
};

export function LocaleSwitcher({ label, className, size = "sm" }: Props) {
  const active = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  function switchTo(locale: string) {
    if (locale === active) return;

    startTransition(() => {
      // pathname is the internal route, so [slug] pages survive the switch.
      router.replace({ pathname, params } as never, { locale: locale as never });
    });
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        "flex w-fit rounded-full p-0.5 hairline",
        pending && "opacity-60",
        className,
      )}
    >
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-current={locale === active ? "true" : undefined}
          className={cx(
            "rounded-full font-mono font-medium tracking-widest uppercase transition",
            size === "sm"
              ? "px-3 py-1.5 text-[0.68rem]"
              : "inline-flex min-h-11 items-center px-5 text-sm",
            locale === active
              ? "bg-accent text-on-accent"
              : "text-muted hover:text-heading",
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
