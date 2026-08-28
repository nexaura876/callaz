"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import {
  fieldErrorsFrom,
  looksAutomated,
  parseEnquiry,
  submittedTooFast,
  type EnquiryState,
} from "@/lib/enquiry";
import { sendEnquiry } from "@/lib/mailer";
import { takeToken } from "@/lib/rate-limit";

/**
 * Behind a proxy the socket address belongs to the proxy, so the forwarded header
 * is the only useful key. It can be spoofed, which is why the limiter counts as a
 * speed bump and not as a security control.
 *
 * x-forwarded-for is a comma-separated list that each hop *appends* to, so the
 * entry closest to this server is the one nearest hop actually observed; the
 * first entry is whatever the original client claimed, which a visitor can set to
 * a different value on every request to dodge the bucket entirely. The last
 * entry is used for that reason.
 */
async function clientKey() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  const chain = forwarded?.split(",").map((part) => part.trim()).filter(Boolean);
  return chain?.at(-1) || store.get("x-real-ip") || "unknown";
}

/**
 * Defence in depth on top of allowedOrigins in next.config.
 *
 * Next refuses a cross-origin action on its own, but that check lives in
 * framework code and this one costs nothing. A missing Origin header is allowed
 * through: some privacy tooling strips it, and the honeypot and timing check
 * still stand behind this.
 */
async function sameOrigin() {
  const store = await headers();
  const origin = store.get("origin");
  if (!origin) return true;

  const host = store.get("x-forwarded-host") ?? store.get("host");
  if (!host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const locale = await getLocale();
  const thanks = getPathname({ locale, href: "/thank-you" });

  if (!(await sameOrigin())) {
    console.warn("[enquiry] rejected a cross-origin submission");
    return { status: "error", formError: "generic" };
  }

  // Bots land on the confirmation page rather than on an error. Telling a script
  // what it got wrong only teaches it to correct itself.
  if (looksAutomated(formData) || submittedTooFast(formData)) {
    redirect(thanks);
  }

  const parsed = parseEnquiry(formData);

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  if (!takeToken(await clientKey()).allowed) {
    return { status: "error", formError: "rateLimited" };
  }

  try {
    await sendEnquiry(parsed.data);
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return { status: "error", formError: "generic" };
  }

  redirect(thanks);
}
