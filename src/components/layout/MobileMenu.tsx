"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

type Props = {
  openLabel: string;
  closeLabel: string;
  children: React.ReactNode;
};

export function MobileMenu({ openLabel, closeLabel, children }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const pathname = usePathname();
  const closeButton = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation happens through ordinary links, so the panel has to close itself.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      /*
        The panel covers the page but does not remove it from the tab order, so
        without this Tab walks straight out of the open menu and into the header
        and body behind it, where nothing is visible. The list is read on each
        press rather than cached because the panel's own contents change with the
        route.
      */
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (active instanceof Node && !panelRef.current?.contains(active)) {
        // Focus started outside the panel entirely — pull it back in.
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const panel = (
    <div
      ref={panelRef}
      id={panelId}
      hidden={!open}
      // inset-0 runs under the notch and the home indicator, so both ends clear them.
      className="bg-page fixed inset-0 z-50 flex flex-col pt-[env(safe-area-inset-top)] lg:hidden"
    >
      <div className="flex h-[var(--header-height)] shrink-0 items-center justify-end px-5">
        <button
          ref={closeButton}
          type="button"
          onClick={() => setOpen(false)}
          aria-label={closeLabel}
          className="inline-flex size-11 items-center justify-center rounded-full text-heading transition hover:bg-panel-2"
        >
          <Icon name="close" className="size-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex size-11 items-center justify-center rounded-full text-heading transition hover:bg-panel-2 lg:hidden"
      >
        <Icon name="menu" className="size-6" />
      </button>

      {/*
        The header uses backdrop-blur, and backdrop-filter makes an element a
        containing block for fixed children. Without the portal the panel would be
        clipped to the height of the header itself.
      */}
      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}
