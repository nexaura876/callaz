"use client";

import { CONSENT_EVENT } from "@/lib/consent";

export function ConsentTrigger({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      // The negative margin keeps the row height while the padding grows the target to 44px.
      className="text-faint -my-3 inline-flex min-h-11 items-center py-3 text-sm underline-offset-4 transition hover:text-heading hover:underline"
    >
      {label}
    </button>
  );
}
