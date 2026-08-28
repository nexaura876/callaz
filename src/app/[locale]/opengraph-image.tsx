import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { company, markets } from "@/content/company";
import { commitments } from "@/content/metrics";

export const alt = "Callaz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The share card is generated at build time, one per locale. Everything is laid out
 * with flex and inline styles because Satori supports neither the cascade nor the
 * Tailwind classes the rest of the site is built on.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const metric = await getTranslations({ locale, namespace: "metrics" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #060e19 0%, #112034 55%, #16497c 100%)",
          padding: "72px 80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              background: "rgba(147, 197, 237, 0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#93c5ed",
              }}
            />
          </div>
          <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.045em" }}>
            Callaz
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.04em",
              maxWidth: 940,
              display: "flex",
            }}
          >
            {t("titleLead")} {t("titleAccent")}
          </div>
          <div style={{ fontSize: 27, color: "#a4bad2", maxWidth: 860, display: "flex" }}>
            {t("eyebrow")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 52,
            borderTop: "1px solid rgba(255,255,255,0.16)",
            paddingTop: 32,
            fontSize: 23,
            color: "#cedcea",
          }}
        >
          {commitments.slice(0, 3).map((entry) => (
            <span key={entry.id} style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#93c5ed", fontWeight: 700 }}>{entry.value}</span>
              {metric(`${entry.id}.label`)}
            </span>
          ))}
          <span style={{ display: "flex", marginLeft: "auto", color: "#7191b3" }}>
            {markets.length} markets · {company.phone}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
