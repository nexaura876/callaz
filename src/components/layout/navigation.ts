import type { StaticPathname } from "@/i18n/routing";
import type { IconName } from "@/components/ui/Icon";

export type NavItem = {
  /** Key under "nav" in the messages. */
  key: string;
  href: StaticPathname;
  /** Only set on items shown in the mega menu, which describes each entry. */
  icon?: IconName;
  descriptionKey?: string;
};

export type NavGroup = {
  key: string;
  /** The overview page the group heading itself links to. */
  href: StaticPathname;
  items: NavItem[];
};

export function isGroup(item: NavItem | NavGroup): item is NavGroup {
  return "items" in item;
}

/** The order here is used by both the desktop bar and the mobile panel. */
export const primaryNav: (NavItem | NavGroup)[] = [
  {
    key: "solutions",
    href: "/solutions",
    items: [
      {
        key: "appointmentSetting",
        href: "/solutions/appointment-setting",
        icon: "target",
        descriptionKey: "appointmentSettingDesc",
      },
      {
        key: "outboundSales",
        href: "/solutions/outbound-sales",
        icon: "chart",
        descriptionKey: "outboundSalesDesc",
      },
      {
        key: "customerService",
        href: "/solutions/customer-service",
        icon: "headset",
        descriptionKey: "customerServiceDesc",
      },
      {
        key: "leadGeneration",
        href: "/solutions/lead-generation",
        icon: "layers",
        descriptionKey: "leadGenerationDesc",
      },
    ],
  },
  { key: "industries", href: "/industries" },
  { key: "howWeWork", href: "/how-we-work" },
  { key: "about", href: "/about" },
  { key: "careers", href: "/careers" },
];

export const footerNav = {
  solutions: [
    { key: "appointmentSetting", href: "/solutions/appointment-setting" },
    { key: "outboundSales", href: "/solutions/outbound-sales" },
    { key: "customerService", href: "/solutions/customer-service" },
    { key: "leadGeneration", href: "/solutions/lead-generation" },
  ],
  company: [
    { key: "about", href: "/about" },
    { key: "howWeWork", href: "/how-we-work" },
    { key: "industries", href: "/industries" },
    { key: "careers", href: "/careers" },
  ],
  contact: [
    { key: "contact", href: "/contact" },
    { key: "quote", href: "/quote" },
    { key: "privacy", href: "/privacy" },
  ],
} satisfies Record<string, { key: string; href: StaticPathname }[]>;
