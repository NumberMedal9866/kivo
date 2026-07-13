# Deployment (Vercel)

## Pre-flight checklist

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test          # unit
pnpm build         # production build
pnpm test:e2e      # Playwright starts the prod server itself
```

All must pass. Also verify:

- `.env.local` is **not** committed; no secrets in the repo.
- The form works in mock mode (`pnpm dev`, submit the form, watch console).
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` respond.
- The three locales render: `/ru`, `/uz`, `/en`.

## First deploy

```bash
npm i -g vercel        # if not installed
vercel login
vercel link            # create/link the project
vercel                 # preview deployment
vercel --prod          # production
```

Framework preset: **Next.js** (auto-detected). Build command `next build`,
install command `pnpm install` (auto-detected from the lockfile).

## Environment variables (Vercel dashboard)

Public (safe for the client):

| Variable                        | Example                   |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | `https://example.uz`      |
| `NEXT_PUBLIC_TELEGRAM_URL`      | `https://t.me/company`    |
| `NEXT_PUBLIC_CONTACT_PHONE`     | `+998 xx xxx xx xx`       |
| `NEXT_PUBLIC_CONTACT_EMAIL`     | `hello@example.uz`        |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` (optional) |
| `NEXT_PUBLIC_YANDEX_METRICA_ID` | `12345678` (optional)     |

Secret (server-only — never `NEXT_PUBLIC_`):

| Variable                       | Notes                         |
| ------------------------------ | ----------------------------- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | from the service-account JSON |
| `GOOGLE_PRIVATE_KEY`           | keep `\n` escapes if one line |
| `GOOGLE_SHEET_ID`              | spreadsheet ID                |
| `GOOGLE_SHEET_TAB`             | defaults to `Leads`           |

After changing env vars, redeploy (`vercel --prod`).

## Post-deploy checks

1. Open the production URL — `/` must redirect to a locale.
2. Switch languages; reload — the choice must persist (cookie).
3. Submit a test lead — verify the row appears in the Google Sheet.
4. View source of `/ru` — check `hreflang` alternates and JSON-LD.
5. Run Lighthouse (mobile) — targets: Performance ≥ 90, A11y ≥ 95,
   Best Practices ≥ 95, SEO ≥ 95.

## Domains

Add the production domain in Vercel → Domains, then update
`NEXT_PUBLIC_SITE_URL` and redeploy so canonicals/sitemap use the final host.
