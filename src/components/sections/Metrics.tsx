import { getTranslations } from "next-intl/server";
import { commitments } from "@/content/metrics";
import { cx } from "@/lib/cx";

type Props = {
  tone?: "dark" | "light";
  className?: string;
};

/**
 * The commitment figures. They sit in a narrow hero panel and again in wide
 * sections, so the grid follows the container width rather than the viewport.
 * Plain breakpoints forced four columns into a 400px box and the values collided.
 */
export async function Metrics({ tone = "dark", className }: Props) {
  const t = await getTranslations("metrics");

  return (
    <div className={cx("@container", className)}>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-9 @2xl:grid-cols-4">
        {commitments.map((metric) => (
          // dt must precede dd in the markup; the column is reversed so the figure sits on top.
          <div key={metric.id} className="flex min-w-0 flex-col-reverse gap-1.5">
            <dt
              className={cx(
                "text-sm leading-snug",
                tone === "dark" ? "text-muted" : "text-faint",
              )}
            >
              {t(`${metric.id}.label`)}
            </dt>
            <dd
              className={cx(
                "font-display numeric flex items-baseline gap-1 text-[2.4rem] leading-none font-semibold @2xl:text-[2.9rem]",
                tone === "dark" ? "text-heading" : "text-ink-950",
              )}
            >
              {metric.value}
              {metric.unit ? (
                <span
                  className={cx(
                    "font-sans text-base font-medium",
                    tone === "dark" ? "text-accent" : "text-accent",
                  )}
                >
                  {t(`${metric.id}.unit`)}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
