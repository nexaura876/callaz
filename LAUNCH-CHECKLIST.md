# Before this goes live

The site is finished and builds clean, but a few things are placeholders that only
the business can confirm. Everything below is either a fact I could not verify or a
decision that is not mine to make.

Work through the **Blocking** section before pointing a domain at this.

---

## Blocking — do not launch without these

### 1. Mail on the domain

**Fixed for now, but worth doing properly.** An earlier draft invented
`hello@`, `sales@` and `jobs@callaz.dk`. No mail is set up on the domain, so all
three would have bounced. Every address on the site now points at
`yusufcaylak20@gmail.com`, the address in the CVR register, which does work.

A gmail.com address does undercut the positioning on a business site. When mail
exists on `callaz.dk`, change the three lines in
`src/content/company.ts` and nothing else. The contact page shows one card while
the addresses are identical and three as soon as they differ.

### 2. The phone number

`+45 41 61 05 03` is the number listed in the CVR register. If that is a personal
mobile rather than a business line, decide whether it belongs on a public website
that invites cold calls back. Change `phone` and `phoneHref` together.

### 3. The service commitments

`src/content/metrics.ts` currently promises:

| Figure | Meaning                     |
| ------ | --------------------------- |
| 60 sec | Target answer time          |
| 48 h   | Brief to first call         |
| 100%   | Of calls recorded           |
| 1 mo   | Notice period               |

These are published as promises, not as past results, and the site says so. They
are still promises, and all four are things the business controls rather than
things it has to get lucky with. **Confirm each one before launch**, particularly
the answer time, which is the only one a client can measure from outside.

The market and language counts used to sit here. They were wrong — the site
claimed six of each — and are now Denmark, in Danish and English, per the owner.
A count of one made a poor headline figure, so those two tiles were replaced with
the recording and notice-period commitments above.

### 4. Privacy policy review

`src/messages/{da,en}/pages.json` under `privacy` is a complete, honest policy that
matches what the site actually does. It is not legal advice. Have it read by
someone qualified before launch, particularly:

- the retention periods (currently 12 months for unconverted enquiries)
- the lawful basis wording for B2B calling
- whether a data processing agreement template exists for clients

Update `privacy.updatedDate` in both locales when you change anything.

### 5. Social profiles

**Fixed.** An earlier draft linked `linkedin.com/company/callaz` without checking.
No company page was found, so every social value is now empty and the footer skips
them. Add a URL only once the profile exists and is the company account.

---

## Before or shortly after launch

### 6. Set the environment variables

```
NEXT_PUBLIC_SITE_URL=https://callaz.dk
RESEND_API_KEY=...
ENQUIRY_FROM=Callaz <no-reply@callaz.dk>
ENQUIRY_TO=...
```

Until `RESEND_API_KEY` and `ENQUIRY_FROM` are set, **enquiries are only written to
the server log and no mail is sent**. Submit the form once on the live site and
confirm the mail arrives before you start driving traffic to it.

### 7. Job postings

`src/content/jobs.ts` and the `careers.jobs` messages describe two roles, both in Kolding. They
carry `JobPosting` structured data, so Google may surface them in job search.

- Confirm each role is real and currently open.
- Update `datePosted` in the message files to the real date.
- Remove any role you are not hiring for. Deleting it from `jobs.ts` turns the page
  into a 404 on the next deploy, which is what Google expects from a closed posting.

### 8. Salary and terms wording

The careers copy states "base salary plus performance pay" and "no commission-only
roles". That is a commitment to candidates. Confirm it matches what you actually
offer before it is published.

### 9. Register the site

- Google Search Console, then submit `https://callaz.dk/sitemap.xml`
- Confirm the share card renders at `https://callaz.dk/da/opengraph-image`

### 10. The logo is matted out of a photo

The site now uses your actual logo, not a redrawing of it. The only artwork
available was a photo of the logo on a reception wall, so
`scripts/extract-logo.mjs` estimates the wall behind each pixel, derives an alpha
from it, and un-mixes the wall colour back out. The shapes and colours are the
original; what was removed is the wall.

It is good enough to ship and it is genuinely your logo, but it inherits the
limits of its source: JPEG artefacts, the lighting from the wall, and a maximum
useful width of about 670px. It will look slightly soft on a high-DPI screen at
large sizes.

**Get the original file** from whoever produced the logo — ideally SVG or a PNG
with transparency. Drop it at `public/media/callaz-logo.png` (or import an SVG in
`src/components/layout/Logo.tsx`) and it replaces everything. Then rerun:

```bash
node scripts/generate-icons.mjs
```

That regenerates the favicon and the app icons from the new file.

One thing to know: the logo is dark navy and was drawn for light backgrounds, so
the dark theme uses a reversed version generated by `scripts/make-dark-logo.mjs`
— the navy becomes white and the grey globe a muted blue, with the shapes
untouched. If you get an official reversed logo, drop it at
`public/media/callaz-logo-reversed.png` and delete that script.

---

## Deliberately not included

Some things a site like this often has were left out on purpose, because putting
them in without substance behind them is a liability rather than an asset:

- **Client logos and testimonials.** None invented. Add real ones with written
  permission from the client.
- **Case studies with numbers.** Add once there is a campaign whose results you can
  evidence if a prospect asks.
- **Certification badges** (ISO 27001 and similar). Only add when certified.
- **Team photos and named staff.** Add when you want them public.
- **"Trusted by 200+ companies" style claims.** Under the Danish marketing act
  (markedsføringsloven §§ 5–6) an unsupported claim of this kind is misleading, and
  the burden of proof sits with the advertiser.

Each of these has a natural home in the existing design when the substance exists.

---

## Verifying a change

```bash
npm run verify
```

Runs the typecheck, the linter, and the message-catalogue comparison. The last one
matters most: next-intl falls back silently, so a missing Danish key ships as
English copy on a Danish page and nobody notices until a customer does.
