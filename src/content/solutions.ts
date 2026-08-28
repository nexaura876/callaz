import type { StaticPathname } from "@/i18n/routing";

export type SolutionId =
  | "appointmentSetting"
  | "outboundSales"
  | "customerService"
  | "leadGeneration";

export type Solution = {
  id: SolutionId;
  href: StaticPathname;
  /** Number of entries under solutions.<id>.capabilities in the messages. */
  capabilities: number;
  deliverables: number;
  faq: number;
  /** Two-letter tag drawn in the card corner. */
  tag: string;
};

export const solutions: Solution[] = [
  {
    id: "appointmentSetting",
    href: "/solutions/appointment-setting",
    capabilities: 5,
    deliverables: 4,
    faq: 5,
    tag: "01",
  },
  {
    id: "outboundSales",
    href: "/solutions/outbound-sales",
    capabilities: 5,
    deliverables: 4,
    faq: 5,
    tag: "02",
  },
  {
    id: "customerService",
    href: "/solutions/customer-service",
    capabilities: 5,
    deliverables: 4,
    faq: 5,
    tag: "03",
  },
  {
    id: "leadGeneration",
    href: "/solutions/lead-generation",
    capabilities: 5,
    deliverables: 4,
    faq: 5,
    tag: "04",
  },
];

export function getSolution(id: SolutionId) {
  return solutions.find((solution) => solution.id === id);
}

/**
 * Sectors Callaz takes campaigns in. Copy lives under "industries.<id>".
 * Keep this list short — a page that claims every industry claims none.
 */
export const industries = [
  "energy",
  "telecom",
  "saas",
  "insurance",
  "trades",
  "logistics",
  "membership",
  "nonprofit",
] as const;

export type IndustryId = (typeof industries)[number];
