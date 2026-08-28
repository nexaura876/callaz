import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Copy is split per area so marketing and HR can edit in parallel without
 * landing on the same lines in a single enormous file.
 */
export const namespaces = ["site", "home", "solutions", "pages", "careers"] as const;

async function loadMessages(locale: string) {
  const files = await Promise.all(
    namespaces.map((namespace) => import(`../messages/${locale}/${namespace}.json`)),
  );

  return Object.assign({}, ...files.map((file) => file.default));
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: "Europe/Copenhagen",
  };
});
