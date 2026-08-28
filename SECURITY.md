# Security

## Reporting something

Email **yusufcaylak20@gmail.com**. Please report privately first and allow a
reasonable window before disclosing. No bounty is offered; credit is given gladly.
The machine-readable version is at `/.well-known/security.txt`.

---

## What is in place

The site is static apart from one form, so the attack surface is small on purpose.
Everything below is implemented, not planned.

### Headers

Set for every response in `next.config.ts`:

| Header | Value | What it stops |
| ------ | ----- | ------------- |
| `Content-Security-Policy` | everything locked to `'self'` | An injected script cannot phone home, load a remote payload, or exfiltrate form data |
| `X-Frame-Options` / `frame-ancestors 'none'` | deny | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME confusion on uploaded or user-influenced content |
| `Strict-Transport-Security` | 2 years, preload | Downgrade and cookie-stripping attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leaking full URLs to third parties |
| `Cross-Origin-Opener-Policy` | `same-origin` | Cross-window scripting between origins |
| `Permissions-Policy` | camera, mic, geolocation, payment, USB all denied | A compromised script silently asking for hardware |

`X-Powered-By` is switched off, so responses do not advertise the framework.

`script-src` keeps `'unsafe-inline'`, which is a real if minor weakening. It covers
the Next bootstrap script and the inline theme script. The alternative is a
per-request nonce, and that forces every page out of static rendering. Given that
no third-party script loads at all and `connect-src` is `'self'`, the residual risk
is small. `'unsafe-eval'` is development-only.

### The enquiry form

The only route that accepts input. Five layers, in order:

1. **Origin check.** `allowedOrigins` in `next.config.ts` plus an explicit
   Origin-against-Host comparison in the action. A form posted from another site is
   rejected.
2. **Honeypot.** A field hidden off-screen. Any content in it means a script.
3. **Timing check.** The form stamps its render time; anything submitted within
   2.5 seconds was not typed by a person.
4. **Schema validation.** Zod, server side, with length caps on every field. The
   client cannot skip it — the action validates regardless of what the browser did.
5. **Rate limit.** Five submissions per IP per ten minutes, in process.

Bots caught by the honeypot or the timer are sent to the confirmation page rather
than an error. Telling a script what it got wrong only teaches it to correct itself.

Mail goes out through the Resend HTTPS API, and anything that reaches a header is
stripped of control characters first, so a newline in a company name cannot break
the subject line.

### Data

- No cookie is set before the visitor answers the consent banner. `localeCookie` is
  off in the routing config, because next-intl otherwise writes `NEXT_LOCALE` on
  every request for no benefit — locale detection is disabled and the locale is in
  the URL.
- No third-party requests at all. Fonts are self-hosted at build time.
- The only `localStorage` key is the theme choice.
- Enquiry data is sent to one inbox and stored nowhere else. There is no database.

### Dependencies

Five runtime packages: `next`, `react`, `react-dom`, `next-intl`, `zod`. Icons,
fonts and the logo are all in-repo, which removes the usual long tail of
supply-chain exposure. Run `npm audit` before each deploy.

---

## Dependency advisories

`npm audit` currently reports three high-severity advisories, all reached through
`next`:

- **postcss** — build-time only. It processes our own stylesheet during `next
  build`; an attacker would have to control the CSS source to reach it, and the
  site ships static compiled CSS.
- **sharp / libvips** — used by the Next image optimiser. The logo is served with
  `unoptimized`, and there are no other raster images, so nothing calls it on a
  request. It runs only in the build scripts, over a local file.

Neither is reachable from a visitor request in this deployment. The fix is
`next@16`, a major upgrade; do it deliberately after launch with time to test,
not the evening before. Re-check with `npm audit` when you do.

## Known limits

Worth stating plainly rather than discovering later.

- **The rate limiter is per process and in memory.** It resets on deploy and does
  not span instances. It stops a single script hammering the form; it is not a
  defence against a distributed attempt. If that becomes a problem, the answer is a
  WAF or rate limiting at the edge, not a bigger map in the application.
- **`x-forwarded-for` can be spoofed.** The limiter keys on it, so treat it as a
  speed bump.
- **No CAPTCHA.** A deliberate trade: it costs every real visitor something and
  usually means embedding a third-party script, which would break both the CSP
  posture and the no-third-party-requests promise. If spam becomes real, Cloudflare
  Turnstile is the option that fits best — it would need a CSP exception.
- **No authentication anywhere**, because nothing on the site is private.
- **Secrets live in environment variables.** `RESEND_API_KEY` must never be
  committed; `.env*.local` is gitignored.

---

## Before deploying

```bash
npm audit
npm run verify
```

Then confirm on the live domain:

- `https://callaz.dk/.well-known/security.txt` resolves
- Response headers include the CSP above (`curl -I https://callaz.dk`)
- A form submission arrives in the inbox
- No `Set-Cookie` on a first visit
