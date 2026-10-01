# Deployment: kiyo.uz on Vercel (domain + email stay at ahost)

Verified against Vercel CLI 55 and Vercel docs updated 2026-02/03.
Everything except the login is copy-paste terminal commands — the dashboard
is only needed once, to read the project-specific DNS values.

> Why not the DNS values from tutorials: Vercel no longer uses one universal
> A/CNAME for everyone. Each project gets **unique** DNS targets, shown after
> you add the domain. Always copy the values Vercel shows you.

## 0. Pre-flight (already passing in this repo)

```bash
pnpm check && pnpm build && pnpm test:e2e
```

## 1. Log in (one time)

```bash
vercel login
```

Pick a login method (GitHub / Google / Email). With Email you'll get a
confirmation link in your inbox — click it, return to the terminal.

## 2. Link the folder and deploy

From the project root:

```bash
vercel link
```

Interactive prompts (answer as follows):

- "Set up …?" → **yes**
- "Which scope…" → your account
- "Link to existing project?" → **no**
- "What's your project's name?" → `kiyo`
- "In which directory is your code located?" → press Enter (`./`)

Then:

```bash
vercel --prod
```

The terminal prints a `https://….vercel.app` URL — the site is live there.

## 3. Environment variables (CLI, no dashboard)

Each command prompts "What's the value of …?" — paste the value, Enter.

```bash
vercel env add NEXT_PUBLIC_SITE_URL production      # → https://www.kiyo.uz (optional; this is the default)
vercel env add NEXT_PUBLIC_TELEGRAM_URL production  # → https://t.me/barsushe
vercel env add NEXT_PUBLIC_CONTACT_EMAIL production # → info@kiyo.uz
```

Later, when the Google Sheet is ready (docs/GOOGLE_SHEETS_SETUP.md):

```bash
vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production
vercel env add GOOGLE_PRIVATE_KEY production   # paste single-line, keep \n escapes
vercel env add GOOGLE_SHEET_ID production
vercel env add GOOGLE_SHEET_TAB production     # → Leads
```

Env changes apply on the next deploy:

```bash
vercel --prod
```

## 4. Attach the domain

```bash
vercel domains add kiyo.uz kiyo
vercel domains add www.kiyo.uz kiyo
```

Now get the exact DNS records Vercel wants for THIS project:

```bash
vercel domains inspect kiyo.uz
```

It prints the **intended DNS records** — an `A` record value for the apex
and a unique `CNAME` target for `www` (looks like `….vercel-dns-0XX.com`).

Dashboard alternative: [vercel.com/dashboard](https://vercel.com/dashboard)
→ open the `kiyo` project → **Settings** (left sidebar) → **Domains** →
**Add Domain** → type `kiyo.uz` (accept the suggested `www` redirect). The
page then displays the same required records with copy buttons.

## 5. Set the records at ahost

In the ahost client area → «Вход в cPanel» → **Zone Editor** (Редактор
зоны) → `kiyo.uz` → **Manage**:

1. Edit the **A** record for `kiyo.uz` (name `@`) → paste the A value from
   step 4.
2. Delete any old `www` record; add **CNAME** `www` → paste the CNAME target
   from step 4.
3. **Do not touch MX / mail records** — email `info@kiyo.uz` stays on ahost.

Check until it verifies (TAS-IX usually propagates in minutes):

```bash
vercel domains verify kiyo.uz
```

SSL is issued automatically once verification passes — no certificate steps.

## 6. Post-deploy checks

1. `https://kiyo.uz` opens with a valid padlock and redirects to
   `https://www.kiyo.uz/ru` (www is the primary/canonical host).
2. Language switch persists after reload (cookie).
3. Submit a test lead → row appears in the Google Sheet (once creds are set).
4. `https://www.kiyo.uz/sitemap.xml` and `/robots.txt` respond.
5. Telegram/email buttons appear (env vars picked up).

## 7. DNS must not depend on a hosting plan

The website lives on Vercel; the ahost **hosting** plan only ever carried
the DNS zone and the `info@kiyo.uz` mailbox. If that plan lapses or is
removed, the zone disappears with it and the whole domain stops resolving
(this happened in Sept/Oct 2026: the registry still delegated to ahost's
nameservers, which answered REFUSED). Diagnose with:

```bash
nslookup -norecurse -type=NS kiyo.uz ns1.uz      # who the registry delegates to
nslookup -type=SOA kiyo.uz dns1.ahost.uz         # "Query refused" = zone gone
```

Records the zone needs (whichever DNS host serves it):

| Name         | Type  | Value                                  |
| ------------ | ----- | -------------------------------------- |
| `kiyo.uz`    | A     | `216.198.79.1`                         |
| `www`        | CNAME | `dc2c91b411b2b7c8.vercel-dns-017.com`  |
| mail records | MX/A  | only for whichever provider hosts mail |

Re-check the A/CNAME values with `vercel domains inspect kiyo.uz` — they are
per-project.

## 8. Search engines

- **Google Search Console** → add a _Domain_ property `kiyo.uz`, verify with
  the DNS TXT record it gives you, then submit
  `https://www.kiyo.uz/sitemap.xml` under _Sitemaps_.
- **Yandex Webmaster** → add `https://www.kiyo.uz`, verify (DNS TXT or meta
  tag), submit the same sitemap.
- Meta-tag verification alternative: set `GOOGLE_SITE_VERIFICATION` /
  `YANDEX_VERIFICATION` env vars in Vercel (the content value only) and
  redeploy — the layout emits the tags.

## Useful commands

```bash
vercel open        # open the project dashboard in the browser
vercel ls          # list deployments
vercel env list production
vercel logs <deployment-url>
vercel rollback    # revert to the previous deployment
```
