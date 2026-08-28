/**
 * The single source of truth for every hard fact on the site.
 *
 * Each field is tagged with where it came from. Keep the tags accurate when
 * editing, because CONTENT-AUDIT.md is written against them:
 *
 *   REGISTRY  verified in the Danish CVR register for CVR 45815099
 *   BRAND     taken from the supplied logo artwork
 *   ASSUMED   written for the site and NOT confirmed by the business
 *
 * Anything marked ASSUMED is a claim the business has to stand behind before this
 * goes public. See LAUNCH-CHECKLIST.md.
 */
export const company = {
  /** REGISTRY */
  name: "Callaz",
  /** REGISTRY — an enkeltmandsvirksomhed, so the trading name is the legal name. */
  legalName: "Callaz",
  /** REGISTRY — registered 22 August 2025. */
  founded: 2025,
  /** REGISTRY */
  cvr: "45815099",
  /** REGISTRY — the owner, listed since 22 August 2025. */
  owner: "Yunus Yusuf Caylak",

  /** REGISTRY — the number listed in CVR. This one is live today. */
  phone: "+45 41 61 05 03",
  phoneHref: "tel:+4541610503",

  /*
   * REGISTRY — the address on file in CVR, and the only mailbox certain to be read
   * today.
   *
   * An earlier draft invented hello@ / sales@ / jobs@callaz.dk. Those read better
   * on a page like this, but no mail is set up on the domain, so all three would
   * have bounced. One working address beats three dead branded ones.
   *
   * Once mail exists on callaz.dk, change these three lines and nothing else.
   */
  email: "yusufcaylak20@gmail.com",
  salesEmail: "yusufcaylak20@gmail.com",
  careersEmail: "yusufcaylak20@gmail.com",

  /** ASSUMED — the domain this is built for. Registration not verified. */
  url: "https://callaz.dk",

  /*
   * Only add a profile once it exists and belongs to the company. The footer skips
   * empty entries, so an unverified handle stays empty rather than sending
   * visitors to someone else, or to a 404.
   *
   * The founder has a personal LinkedIn profile; no company page was found.
   */
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
} as const;

export type Office = {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  street: string;
  postalCode: string;
  timezone: string;
  headquarters?: boolean;
};

/**
 * REGISTRY — the registered address is the only office that exists. It is a c/o
 * address at the owner's home, which is normal for a company this young.
 *
 * Add further offices here as they open; the footer, the about page and the
 * Organization schema all read from this array.
 */
export const offices: Office[] = [
  {
    id: "kolding",
    city: "Kolding",
    country: "Denmark",
    countryCode: "DK",
    street: "Tøndervej 10, 2. tv",
    postalCode: "6000",
    timezone: "Europe/Copenhagen",
    headquarters: true,
  },
];

export type Market = {
  id: string;
  countryCode: string;
  /** Dial prefix, shown in the coverage grid. */
  dial: string;
};

/**
 * CLIENT — Denmark only. An earlier draft listed six European markets; the owner
 * confirmed that is not the case, and they were removed.
 *
 * This drives the coverage section, the footer and areaServed in the structured
 * data, so every entry is a public claim that Callaz sells into that country.
 * Adding one back means being able to staff it.
 */
export const markets: Market[] = [{ id: "denmark", countryCode: "DK", dial: "+45" }];

/**
 * CLIENT — Danish and English only. Swedish, Norwegian, German and Turkish were
 * in an earlier draft and are not offered; the owner confirmed this.
 *
 * Labels live under "languages" in the messages, so each is written in the
 * reader's own language.
 */
export const languages = ["da", "en"] as const;
export type LanguageId = (typeof languages)[number];
