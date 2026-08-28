import { cx } from "@/lib/cx";

type Props = {
  items: string[];
  className?: string;
};

/**
 * A slow horizontal ticker of capability words.
 *
 * The list is rendered twice and the track translates by exactly half its width,
 * so the seam lands where the second copy starts and the loop is invisible. The
 * duplicate is hidden from assistive tech, which should hear the list once.
 */
export function Marquee({ items, className }: Props) {
  return (
    <div
      className={cx(
        "relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <ul className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
        {items.map((item) => (
          <li
            key={item}
            className="text-muted flex shrink-0 items-center gap-10 font-mono text-sm tracking-[0.16em] whitespace-nowrap uppercase"
          >
            {item}
            <span aria-hidden="true" className="bg-accent/40 size-1 rounded-full" />
          </li>
        ))}
      </ul>
      <ul
        aria-hidden="true"
        className="animate-marquee flex shrink-0 items-center gap-10 pr-10"
      >
        {items.map((item) => (
          <li
            key={item}
            className="text-muted flex shrink-0 items-center gap-10 font-mono text-sm tracking-[0.16em] whitespace-nowrap uppercase"
          >
            {item}
            <span aria-hidden="true" className="bg-accent/40 size-1 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
