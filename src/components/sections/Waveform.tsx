import { cx } from "@/lib/cx";

/**
 * The hero motif: a bar chart of a voice on the line.
 *
 * The heights are a fixed sequence rather than Math.random, because the server and
 * the client have to agree on the markup. Each bar animates on its own delay, and
 * the whole thing stops moving under prefers-reduced-motion via the global rule.
 */
const bars = [
  0.28, 0.52, 0.86, 0.44, 0.7, 1, 0.62, 0.34, 0.78, 0.5, 0.92, 0.4, 0.66, 0.3, 0.58,
  0.82, 0.46, 0.74, 0.36, 0.6, 0.94, 0.42, 0.68, 0.32, 0.54, 0.88, 0.48, 0.72, 0.26,
  0.64,
];

export function Waveform({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("flex h-16 items-center gap-[3px] overflow-hidden", className)}
    >
      {bars.map((height, index) => (
        <span
          key={index}
          className="from-accent to-accent-glow w-[3px] flex-1 origin-center rounded-full bg-gradient-to-b"
          style={{
            height: `${Math.round(height * 100)}%`,
            animation: `wave ${1.6 + (index % 5) * 0.24}s var(--ease-out-soft) ${index * 0.055}s infinite`,
            opacity: 0.35 + height * 0.65,
          }}
        />
      ))}
    </div>
  );
}
