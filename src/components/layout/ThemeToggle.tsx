"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  readTheme,
  resolvedTheme,
  watchSystemTheme,
  type Theme,
} from "@/lib/theme";
import { cx } from "@/lib/cx";

type Labels = {
  /** Group label, e.g. "Appearance". */
  group: string;
  light: string;
  dark: string;
  system: string;
};

const order: Theme[] = ["light", "dark", "system"];

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 13.5A8.2 8.2 0 0 1 10.5 4a8.5 8.5 0 1 0 9.5 9.5Z" />
    </svg>
  );
}

function SystemIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M8.5 20h7M12 16.5V20" />
    </svg>
  );
}

const icons = { light: SunIcon, dark: MoonIcon, system: SystemIcon };

export function ThemeToggle({
  labels,
  className,
  size = "sm",
}: {
  labels: Labels;
  className?: string;
  size?: "sm" | "md";
}) {
  // "system" until mounted: the server has no idea what the visitor prefers, and
  // guessing produces a hydration mismatch on the pressed state.
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
    // An OS-level theme change hits the same stuck-transition problem as the
    // toggle does, so it gets the same suppression.
    return watchSystemTheme();
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div
      role="group"
      aria-label={labels.group}
      className={cx("border-line flex w-fit rounded-full border p-0.5", className)}
    >
      {order.map((option) => {
        const Icon = icons[option];
        const active = mounted && theme === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            aria-pressed={active}
            title={labels[option]}
            className={cx(
              "inline-flex items-center justify-center rounded-full transition",
              size === "sm" ? "size-8" : "size-11",
              active
                ? "bg-accent text-on-accent"
                : "text-muted hover:text-heading hover:bg-panel-2",
            )}
          >
            <Icon className={size === "sm" ? "size-4" : "size-5"} />
            <span className="sr-only">{labels[option]}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Reads the live theme, for anything that has to branch on it in JS. */
export function useResolvedTheme() {
  const [value, setValue] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const update = () => setValue(resolvedTheme(readTheme()));
    update();

    const media = window.matchMedia("(prefers-color-scheme: light)");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return value;
}
