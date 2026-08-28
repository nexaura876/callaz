import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

/**
 * tone describes the background the eyebrow sits on: "dark" is the default,
 * because most of the site is.
 */
export function Eyebrow({ children, tone = "dark", className }: Props) {
  return (
    <p
      className={cx(
        "inline-flex items-center gap-2.5 font-mono text-[0.7rem] font-medium tracking-[0.22em] uppercase",
        tone === "dark" ? "text-accent" : "text-faint",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "inline-block size-1.5 rounded-full",
          tone === "dark" ? "bg-accent animate-blip" : "bg-accent-glow",
        )}
      />
      {children}
    </p>
  );
}
