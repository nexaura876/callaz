/**
 * Every number that appears as a headline figure on the site.
 *
 * These are service commitments and operating targets, not historical results —
 * the wording in the messages files is written to match that, and it must stay
 * that way. Do not turn any of these into a claim about volume delivered, revenue
 * or client count unless the business can evidence the figure on request.
 *
 * Marketing law in Denmark (markedsføringsloven §§ 5-6) treats an unsupported
 * performance claim as misleading, so an unverifiable number here is a legal
 * exposure and not only a credibility one.
 */
export type Metric = {
  id: string;
  value: string;
  /** Rendered after the value in a lighter weight, e.g. "sec". */
  unit?: string;
};

/**
 * Shown in the hero panel and repeated on the solution pages.
 *
 * Counting markets and languages was dropped once the real answer turned out to
 * be one and two: a headline figure of "1 market" argues against itself. These
 * four are policy the owner sets, which makes them both safer and stronger.
 */
export const commitments: Metric[] = [
  { id: "answerTime", value: "60", unit: "sec" },
  { id: "onboarding", value: "48", unit: "h" },
  { id: "recorded", value: "100", unit: "percent" },
  { id: "notice", value: "1", unit: "month" },
];
