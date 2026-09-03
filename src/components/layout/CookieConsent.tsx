"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";

type Labels = {
  title: string;
  body: string;
  accept: string;
  reject: string;
  details: string;
  necessaryTitle: string;
  necessaryBody: string;
  analyticsTitle: string;
  analyticsBody: string;
  privacyLink: string;
  privacyHref: string;
  regionLabel: string;
};

export function CookieConsent({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Consent lives in localStorage, unreadable during SSR, so the initial
    // open state can only be known once this runs on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent() === null) setOpen(true);

    const reopen = () => {
      setShowDetails(true);
      setOpen(true);
    };

    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  const decide = useCallback((choice: ConsentChoice) => {
    writeConsent(choice);
    setOpen(false);
    setShowDetails(false);
  }, []);

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label={labels.regionLabel}
      // Pinned to the bottom edge, so the padding has to clear the home indicator.
      className="fixed inset-x-0 bottom-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
    >
      <div className="bg-panel-solid/95 hairline mx-auto max-w-3xl rounded-[var(--radius-panel)] p-5 shadow-[var(--shadow-lift-lg)] backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-lg font-semibold text-heading">{labels.title}</h2>
        <p className="text-muted mt-2 text-[0.95rem] leading-relaxed">{labels.body}</p>

        {showDetails ? (
          <dl className="mt-4 grid gap-4 rounded-2xl bg-panel p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-heading">{labels.necessaryTitle}</dt>
              <dd className="text-muted mt-1 leading-relaxed">{labels.necessaryBody}</dd>
            </div>
            <div>
              <dt className="font-semibold text-heading">{labels.analyticsTitle}</dt>
              <dd className="text-muted mt-1 leading-relaxed">{labels.analyticsBody}</dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => decide("all")}
            className="bg-accent text-on-accent hover:bg-accent-strong inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition"
          >
            {labels.accept}
          </button>
          <button
            type="button"
            onClick={() => decide("necessary")}
            className="hairline inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-heading transition hover:bg-panel-2"
          >
            {labels.reject}
          </button>

          <div className="text-muted flex items-center gap-4 text-sm sm:ml-auto">
            {showDetails ? null : (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="-my-3 inline-flex min-h-11 items-center py-3 underline-offset-4 transition hover:text-heading hover:underline"
              >
                {labels.details}
              </button>
            )}
            <a
              href={labels.privacyHref}
              className="-my-3 inline-flex min-h-11 items-center py-3 underline-offset-4 transition hover:text-heading hover:underline"
            >
              {labels.privacyLink}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
