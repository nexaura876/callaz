# Content audit

Where every factual claim on the site comes from, and which ones nobody has
confirmed yet.

This exists because a marketing site is judged on its facts, and a website written
for a company is not the same as a website written *by* it. Anything below marked
**ASSUMED** was written to make the site work, not because the business said it.

Three sources:

| Tag          | Meaning                                                          |
| ------------ | ---------------------------------------------------------------- |
| **REGISTRY** | Verified in the Danish CVR register, entry 45815099               |
| **CLIENT**   | Supplied directly (the logo artwork and the slogan on it)         |
| **ASSUMED**  | Written for the site. **Not confirmed. Must be checked.**         |

---

## Verified — safe to publish

| Claim | Value | Source |
| ----- | ----- | ------ |
| Company name | Callaz | REGISTRY |
| Legal form | Enkeltmandsvirksomhed (sole proprietorship) | REGISTRY |
| CVR number | 45815099 | REGISTRY |
| Registered | 22 August 2025 | REGISTRY |
| Owner | Yunus Yusuf Caylak | REGISTRY |
| Registered address | Tøndervej 10, 2. tv, 6000 Kolding | REGISTRY |
| Industry code | 822000, Drift af callcentre | REGISTRY |
| Phone | +45 41 61 05 03 | REGISTRY |
| Email | yusufcaylak20@gmail.com | REGISTRY |
| Slogan | Dækker alt jeres behov fra A til Z | CLIENT (on the logo) |
| Brand mark | globe, orbit, headset forming a C | CLIENT (artwork) |
| Brand colour | the navy of the wordmark | CLIENT (artwork) |

The site states the founding year, the CVR number, the address and the legal form
on `/om-callaz`. All four match the register.

---

## Assumed — confirm before launch

### Contact and identity

| Claim | Where | Status |
| ----- | ----- | ------ |
| The domain `callaz.dk` | `company.url`, every canonical URL | Registration not verified |
| A company LinkedIn page | `company.social.linkedin` | **Removed.** No company page was found; the founder has a personal profile. Left empty, and the footer skips empty entries. |
| `hello@` / `sales@` / `jobs@callaz.dk` | earlier draft | **Removed.** No mail exists on the domain, so all three would have bounced. Everything now points at the registered address. |

### Resolved since the first audit

| Was claimed | Actually | Where it had reached |
| ----------- | -------- | -------------------- |
| Six markets: DK, SE, NO, DE, NL, GB | **Denmark only** | Coverage section, footer, `areaServed` in structured data |
| Six languages: da, en, sv, no, de, tr | **Danish and English only** | Same, plus the customer service page and the careers copy |
| A remote native-speaker role for SE, NO, DE, TR | **Removed** | It existed only to serve markets that were never real. Two Kolding roles remain. |

The owner confirmed the first two directly. Both are now tagged CLIENT in
`content/company.ts` rather than ASSUMED, and the two metric tiles that counted
them were replaced with the recording and notice-period commitments, because a
headline figure of one market argues against itself.

This is the failure mode the audit was written to catch: the copy was fluent and
internally consistent, and still described a company that did not exist.

### Scale and capability — still to confirm

| Claim | Where | Why it needs checking |
| ----- | ----- | --------------------- |
| Target answer time 60 sec | `content/metrics.ts`, hero, solution pages | A service promise. Reasonable, but it is a promise. |
| Brief to first call 48 h | same | Same. |
| Four service lines | `content/solutions.ts` and all copy | Consistent with the registered industry code, but the specific scope of each was written here. |
| Eight industries | `content/solutions.ts`, `/brancher` | Written as illustration. The page says explicitly that the list is where campaigns have run, which is a claim about history. |
| Two open jobs | `content/jobs.ts`, `/karriere` | Invented, and they carry `JobPosting` structured data, so Google may list them as real vacancies. |
| Weekly reporting, call recording, DPA before first call, monthly terms | throughout | Operating promises, not observations. They are the backbone of the sales argument, so they have to be true. |

### Resolved since the first audit (2)

| Was claimed | Actually | Where it had reached |
| ----------- | -------- | --------------------- |
| "Founded by people who had spent time inside phone floors" (invented, plural) | Founded by **Yusuf Caylak**, who has more than 10 years of personal experience in telephone sales and customer service, and has worked with more than 10 companies in Denmark, including in the electricity and cleaning sectors | `/om-callaz`, `about.story.paragraphs` |

The owner confirmed the experience and company-count figures directly. They are
now the opening paragraph of the About page story, tagged CLIENT rather than
invented. This is a claim about the **founder's** personal track record, not
Callaz the legal entity's (see the note below) — keep that distinction if the
copy is ever extended, since the company itself remains newly registered.

### Numbers deliberately **not** claimed

No Callaz-the-company employee count, revenue, client count, meetings booked,
conversion rate, customer logo, testimonial, case study or certification appears
anywhere. The register shows no registered employment yet, and none of those
could be evidenced. The hero panel says in both languages that the figures shown
are operating targets rather than past results.

The one exception is the founder's personal pre-Callaz track record (10+ years,
10+ companies — see above), which the owner confirmed directly and which is
about Yusuf's own history rather than the company's.

This matters legally, not only reputationally: under the Danish marketing act
(markedsføringsloven §§ 5–6) the burden of proving a performance claim sits with
the advertiser.

---

## How to correct any of it

Everything above lives in three files. None of it is hard-coded in a component.

- `src/content/company.ts` — contact details, offices, markets, languages
- `src/content/metrics.ts` — the headline figures
- `src/content/jobs.ts` — the open roles
- `src/messages/{da,en}/` — every sentence

Removing a market or a language is a one-line edit; the coverage grid, the footer
and the structured data all follow. Deleting a job from `jobs.ts` turns its page
into a 404 on the next deploy, which is what Google expects from a closed posting.

Run `npm run verify` afterwards.
