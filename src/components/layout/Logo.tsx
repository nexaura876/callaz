import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cx } from "@/lib/cx";
import logoOnLight from "../../../public/media/callaz-logo.png";
import logoOnDark from "../../../public/media/callaz-logo-reversed.png";

/**
 * The supplied logo, used as artwork rather than redrawn.
 *
 * It arrived only as a photo of the logo on a reception wall, so it was matted out
 * of that photo by scripts/extract-logo.mjs. The shapes and colours are the
 * original; what was removed is the wall.
 *
 * Two variants ship. The navy original is used on light grounds. A reversed
 * version, derived by scripts/make-dark-logo.mjs, is used on dark ones — the navy
 * artwork either vanishes into the evening theme or needs a white plate behind it,
 * and a white plate under a logo reads as a photo stuck onto the page.
 *
 * Which one shows is decided in CSS from the theme, not in JavaScript, so there is
 * no flash and no hydration mismatch. The hidden one is display:none, which also
 * keeps a screen reader from announcing the alt text twice.
 *
 * `unoptimized` keeps Next from running these through the image optimiser: they
 * are already small and fixed-size, and it keeps sharp out of the serving path.
 */

type Props = {
  label: string;
  className?: string;
  size?: "md" | "lg" | "xl";
};

const heights = {
  md: "h-11",
  lg: "h-14",
  xl: "h-24 sm:h-28",
};

/** Both variants, with only the one matching the current theme displayed. */
function Artwork({ alt, className }: { alt: string; className?: string }) {
  return (
    <>
      <Image
        src={logoOnLight}
        alt={alt}
        unoptimized
        data-logo="light"
        className={cx("w-auto", className)}
      />
      <Image
        src={logoOnDark}
        alt={alt}
        unoptimized
        data-logo="dark"
        className={cx("w-auto", className)}
      />
    </>
  );
}

export function Logo({ label, className, size = "md" }: Props) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={cx(
        "group inline-flex w-fit items-center transition-opacity hover:opacity-85",
        className,
      )}
    >
      {/* The link already carries the name, so the artwork is decorative here. */}
      <Artwork alt="" className={heights[size]} />
    </Link>
  );
}

/**
 * The same artwork, not wrapped in a link. Used where the logo is presented as a
 * graphic rather than as a way home, such as the hero.
 */
export function LogoMark({
  alt,
  className,
}: {
  /**
   * The wordmark and the slogan live inside the artwork, so wherever this is the
   * only place they appear, the alt text has to carry them. Otherwise the slogan
   * is invisible to a screen reader and to a search engine alike.
   */
  alt: string;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex w-fit items-center", className)}>
      <Artwork alt={alt} className="h-full" />
    </span>
  );
}
