export type ConsentChoice = "necessary" | "all";

export const CONSENT_COOKIE = "callaz-consent";
export const CONSENT_EVENT = "callaz:consent-open";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function readConsent(): ConsentChoice | null {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`));

  const value = match?.split("=")[1];
  return value === "all" || value === "necessary" ? value : null;
}

export function writeConsent(choice: ConsentChoice) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;
}
