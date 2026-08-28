import { cx } from "@/lib/cx";
import { Eyebrow } from "./Eyebrow";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "left",
  as: Heading = "h2",
  className,
}: Props) {
  return (
    <div
      className={cx(
        "flex flex-col gap-5",
        align === "center" && "mx-auto max-w-2xl items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Heading
        className={cx(
          "text-[2rem] leading-[1.1] font-semibold sm:text-[2.5rem] lg:text-[3rem]",
          tone === "dark" ? "text-heading" : "text-ink-950",
        )}
      >
        {title}
      </Heading>
      {lead ? (
        <p
          className={cx(
            "max-w-2xl text-lg leading-relaxed",
            tone === "dark" ? "text-muted" : "text-faint",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
