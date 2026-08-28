type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "chevron-down"
  | "close"
  | "menu"
  | "mail"
  | "phone"
  | "pin"
  | "globe"
  | "shield"
  | "clock"
  | "spark"
  | "headset"
  | "chart"
  | "users"
  | "layers"
  | "target"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "youtube";

type Props = {
  name: IconName;
  className?: string;
};

/**
 * Icons are inlined rather than pulled from a package. There are around twenty of
 * them, they all share one stroke weight, and this way the set costs no dependency
 * and no extra request.
 */
const paths: Record<IconName, React.ReactNode> = {
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  check: <path d="m4 12.5 5 5L20 6.5" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6 18 18M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </>
  ),
  spark: <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.3 6.3 9.5 9.5M14.5 14.5l3.2 3.2M17.7 6.3 14.5 9.5M9.5 14.5l-3.2 3.2" />,
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2.5" y="13" width="4.5" height="6" rx="2" />
      <rect x="17" y="13" width="4.5" height="6" rx="2" />
      <path d="M20 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M17.5 14.2A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
  layers: <path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <path
      d="M4.5 8.8h3V21h-3V8.8Zm1.5-5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM10 8.8h2.9v1.7c.5-.9 1.7-1.9 3.5-1.9 3 0 3.6 1.9 3.6 4.5V21h-3v-6.2c0-1.5-.3-2.5-1.7-2.5s-2.2 1-2.2 2.4V21h-3V8.8Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path
      d="M14 8.5V7c0-.8.4-1.2 1.3-1.2H17V3h-2.4C11.9 3 11 4.4 11 6.6v1.9H9V11h2v10h3V11h2.2l.3-2.5H14Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({ name, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

export type { IconName };
