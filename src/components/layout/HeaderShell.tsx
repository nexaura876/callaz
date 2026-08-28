"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";

/**
 * The header floats over the hero and only takes on a background once the page has
 * moved. Scroll state is the one thing here that has to be client-side, so it is
 * isolated in this shell and the contents stay server components.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-stuck={stuck}
      className={cx(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300 ease-[var(--ease-out-soft)]",
        stuck
          ? "bg-page/85 border-b border-line backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {children}
    </header>
  );
}
