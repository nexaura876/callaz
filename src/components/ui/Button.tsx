import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";

type Variant = "primary" | "outline" | "onLight" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition duration-200 ease-[var(--ease-out-soft)] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // The accent is bright enough that the label has to go dark to stay readable.
  primary:
    "bg-accent text-on-accent hover:bg-accent-strong active:bg-accent hover:shadow-[var(--shadow-glow)]",
  outline: "text-heading hairline hover:bg-panel-2 hover:hairline-strong",
  onLight: "bg-panel-solid text-heading hover:bg-panel-solid shadow-[var(--shadow-lift)]",
  ghost: "text-heading/80 hover:bg-panel-2 hover:text-heading",
};

// min-h-11 is the 44px thumb target. The padding alone lands md at 43px, and the
// floor costs nothing at lg, which already clears it.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[0.94rem]",
  lg: "min-h-11 px-7 py-3.5 text-[1rem]",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md") {
  return cx(base, variants[variant], sizes[size]);
}

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
};

type LinkProps = CommonProps & {
  href: AppPathname;
  params?: Record<string, string>;
};

export function ButtonLink({
  href,
  params,
  children,
  variant,
  size,
  className,
  withArrow,
}: LinkProps) {
  return (
    <Link
      href={(params ? { pathname: href, params } : href) as never}
      className={cx(buttonStyles(variant, size), "group", className)}
    >
      {children}
      {withArrow ? (
        <Icon
          name="arrow-right"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      ) : null}
    </Link>
  );
}

type ExternalProps = CommonProps & {
  href: string;
  /** Only set on genuinely outbound links. tel: and mailto: should not have it. */
  external?: boolean;
};

export function ExternalButtonLink({
  href,
  children,
  variant,
  size,
  className,
  withArrow,
  external,
}: ExternalProps) {
  return (
    <a
      href={href}
      className={cx(buttonStyles(variant, size), "group", className)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
      {withArrow ? (
        <Icon
          name="arrow-right"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      ) : null}
    </a>
  );
}
