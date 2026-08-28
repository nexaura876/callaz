# Callaz

Website for Callaz, an outbound contact centre registered in Kolding, Denmark
(CVR 45815099). Built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4.
Fully bilingual, Danish first, with a light and a dark theme.

## Requirements

- Node.js 20.9 or newer (`.nvmrc` pins 24)
- npm 10 or newer

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site runs on <http://localhost:3000>. Nothing in `.env.local` is required to
develop: with no mail credentials configured, enquiries are printed to the server
console instead of being sent.

## Scripts

| Script                   | What it does                                              |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Development server with hot reload                        |
| `npm run build`          | Production build (prerenders all 43 routes)               |
| `npm start`              | Serves the production build                               |
| `npm run typecheck`      | `tsc --noEmit`                                            |
| `npm run lint`           | ESLint                                                    |
| `npm run check:messages` | Fails if the two message catalogues have drifted apart    |
| `npm run verify`         | All three of the above, in order. Run this before pushing |

## How it is put together

```
src/
  app/
    [locale]/          Every page. The folder name is the INTERNAL route.
    globals.css        Design tokens and the handful of custom utilities
    robots.ts          Keeps the confirmation page out of the index
    sitemap.ts         Every URL with its hreflang alternates
  components/
    layout/            Header, footer, menus, cookie banner
    sections/          Reusable page sections (metrics, coverage, FAQ, forms)
    ui/                Buttons, icons, headings and other primitives
    pages/             SolutionPage, the shared layout behind the four services
  content/             Facts, figures and lists. Edit these, not the components.
  i18n/                Routing, navigation helpers and message loading
  lib/                 Metadata, structured data, validation, mail, rate limiting
  messages/{da,en}/    All copy, split into five namespaces per locale
```

### Content lives in two places

Anything factual is in `src/content/`:

- `company.ts` — name, CVR, phone, email, offices, markets, languages
- `metrics.ts` — the headline figures and the operating principles
- `solutions.ts` — the four services and the industry list
- `jobs.ts` — open roles

Anything written is in `src/messages/`. A page never hard-codes a sentence, so
copy can be changed without touching a component.

### Brand and themes

The logo is the supplied artwork, at `public/media/callaz-logo.png`. It was matted
out of a photo of the logo on a wall by `scripts/extract-logo.mjs`; the shapes and
colours are original, the wall is not. `src/components/layout/Logo.tsx` wraps it:
`Logo` links home, `LogoMark` is the same artwork as a plain graphic.

The artwork is dark navy and made for light backgrounds, so a reversed variant is
derived by `scripts/make-dark-logo.mjs` and used on the dark theme. Which one
shows is decided in CSS from the theme, so there is no flash and no hydration
mismatch. Icons are generated from the original by `scripts/generate-icons.mjs`.

Colour is handled with semantic tokens rather than fixed classes. `globals.css`
defines `--c-page`, `--c-panel`, `--c-heading`, `--c-accent` and friends once per
theme, and `@theme inline` exposes them as ordinary Tailwind utilities:

```
bg-page  bg-panel  bg-panel-2  border-line
text-heading  text-body  text-muted  text-faint  text-accent
```

Because the utilities keep the `var()` reference, the whole site flips between
morning and evening without a single conditional class. Components should paint
with these and never with a fixed colour, or that section will be stuck in one
theme.

The dark theme is the default. A visitor can pick light, dark, or match-system
from the header, and the choice is applied by a small inline script in `<head>`
before the first paint — anything later, including a `useEffect`, repaints the
page in front of them.

### Proofreading the Danish

The Danish copy lives in `src/messages/da/`, but do not hand those files to a
proofreader who does not write code. One stray quote breaks the build, and the
error message will mean nothing to them. Export a spreadsheet instead:

```bash
node scripts/export-review.mjs
```

That writes `da-korrektur.csv`: every Danish sentence, which page it appears on,
and one empty column for corrections. They fill it in and send it back. Then:

```bash
node scripts/apply-review.mjs
```

which prints the diff and changes nothing, and once it looks right:

```bash
node scripts/apply-review.mjs --write
npm run verify
```

The apply step refuses to run if any string changed on the site after the export,
so a stale spreadsheet cannot silently overwrite newer copy. Instructions for the
proofreader, written in Danish, are in `KORREKTUR-DANSK.md`.

### Routing and URLs

Routes are declared once in `src/i18n/routing.ts`. Each entry maps an internal
pathname (which matches the folder in `app/[locale]/`) to a public URL per locale:

```ts
"/quote": { en: "/get-a-quote", da: "/faa-et-tilbud" }
```

Danish is the default locale and owns the bare paths; English sits under `/en`.
Because every route is declared per locale, the language switcher moves between
equivalent pages at any depth — `/loesninger/moedebooking` swaps to
`/en/solutions/appointment-setting`, not to the front page.

Two things to know when editing:

- The `matcher` in `src/middleware.ts` must keep `\\.` escaped. Written as `\.` it
  collapses to `.` in the string, matches any character, and the lookahead then
  excludes every path on the site.
- `opengraph-image` is deliberately excluded from the middleware, so share-image
  URLs are always locale-prefixed. `openGraphFor()` in `src/lib/site.ts` handles it.

### Adding a language

1. Add the code to `locales` in `src/i18n/routing.ts` and a path for it on every
   entry in `pathnames`.
2. Copy `src/messages/da/` to `src/messages/<locale>/` and translate.
3. Run `npm run check:messages` — it reports every key you missed.

Nothing else needs changing. The header switcher, sitemap, hreflang tags and
structured data all read from the same config.

## Privacy and GDPR

The site is built so that a first visit collects nothing at all:

- **No cookies at all before consent.** The only cookie the site ever sets is
  `callaz-consent`, written when the visitor answers the banner. next-intl would
  otherwise write a `NEXT_LOCALE` cookie on every request, so `localeCookie` is
  switched off in the routing config: with detection disabled it was never read,
  and the locale travels in the URL instead.
- **No third-party requests.** No analytics, no tag manager, no embeds. Fonts are
  self-hosted by `next/font` at build time rather than fetched from Google, which
  is what German courts have taken issue with in the Google Fonts rulings.
- **Refusing is as easy as accepting.** Both banner buttons are the same size and
  sit side by side, and the choice can be changed from the footer at any time.
- **Consent is never pre-ticked** on the enquiry forms.
- **The theme choice is the only thing in localStorage** (`callaz-theme`). It is a
  functional setting the visitor picks themselves, it never leaves the browser, and
  the privacy policy says so.
- **A Content-Security-Policy locked to `'self'`** means an injected third-party
  script cannot start collecting data even if one were introduced by accident.

Enquiry data goes to one place: the inbox in `ENQUIRY_TO`. The privacy policy at
`/privatlivspolitik` and `/en/privacy-policy` describes the lawful basis, retention
periods and data subject rights, and names Datatilsynet as the supervisory
authority. **Have it reviewed before launch** — see `LAUNCH-CHECKLIST.md`.

## Claims and figures

The numbers on the site are service commitments (target answer time, brief-to-first
call, calls recorded, notice period), not results from past campaigns, and the copy says so
explicitly under the hero panel. This is deliberate: under the Danish marketing act
an unsupported performance claim is misleading, so any figure presented as an
achieved result has to be evidenced on request. Keep new numbers in
`src/content/metrics.ts` and keep them the kind of promise the business controls.

## Environment variables

| Variable               | Required | Purpose                                            |
| ---------------------- | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Canonical origin. No trailing slash.               |
| `RESEND_API_KEY`       | For mail | Resend API key. Without it, enquiries are logged.  |
| `ENQUIRY_FROM`         | For mail | Verified sender, e.g. `Callaz <no-reply@callaz.dk>` |
| `ENQUIRY_TO`           | No       | Recipient. Defaults to the address in `company.ts`. |

## Deployment

Any Node host works. On Vercel the defaults are correct; set the environment
variables above and point the domain at the project. Every page is static, so the
only server-side work at runtime is the enquiry form.
