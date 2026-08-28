import Link from "next/link";
import { routing } from "@/i18n/routing";

/**
 * The global 404, for paths that fall outside any locale segment.
 *
 * No message catalogue is loaded here, so the copy is hard-coded. Danish leads
 * because it is the default locale, with an English line under it for everyone
 * else. Both stay short: the job of this page is to get someone back onto the
 * site, not to explain anything.
 *
 * The colours are inline for the same reason, and they are the brand tokens
 * written out by hand. If the palette in globals.css moves, move these with it.
 */
const PAGE = "#060e19";
const BODY = "#cedcea";
const FAINT = "#2a415e";
const ACCENT = "#93c5ed";

export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: PAGE,
          color: BODY,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <p style={{ fontSize: "3rem", fontWeight: 700, margin: 0, color: FAINT }}>404</p>
        <h1 style={{ fontSize: "1.5rem", margin: 0, color: "#ffffff" }}>
          Siden findes ikke
        </h1>
        <p style={{ margin: 0, opacity: 0.75 }}>This page does not exist</p>
        <Link href="/" style={{ color: ACCENT, marginTop: "0.5rem" }}>
          Gå til forsiden — Go to the front page
        </Link>
      </body>
    </html>
  );
}
