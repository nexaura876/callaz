import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** "glass" sits on a dark background, "solid" on a light one. */
  tone?: "glass" | "solid";
  as?: "div" | "article" | "li" | "section";
};

/**
 * The recurring surface across the site: a rounded card with a hairline instead of
 * a border, so it reads as a pane of glass on the dark canvas rather than a box.
 */
export function Panel({ children, className, tone = "glass", as: Tag = "div" }: Props) {
  return (
    <Tag
      className={cx(
        "rounded-[var(--radius-card)]",
        tone === "glass"
          ? "hairline bg-panel backdrop-blur-[2px]"
          : "border-ink-200/70 border bg-white shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
