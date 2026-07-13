# KIVO — self-service kiosk website

Multilingual (RU / UZ / EN) marketing website for a company supplying
self-service ordering kiosks to restaurants, coffee shops and quick-service
businesses in Uzbekistan.

> **Temporary brand:** "KIVO" is a provisional name. Everything brand-related
> is centralized so it can be replaced in one place — see
> [docs/BRAND_REPLACEMENT_GUIDE.md](docs/BRAND_REPLACEMENT_GUIDE.md).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, static generation)
- TypeScript (strict), Tailwind CSS 4, Motion
- [next-intl](https://next-intl.dev) — localized routes `/ru`, `/uz`, `/en`
- Zod validation, Google Sheets lead storage
- Vercel Analytics + Speed Insights, optional GA4 / Yandex Metrica
- Vitest (unit) + Playwright (e2e)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in what you have; everything is optional in dev
pnpm dev                     # http://localhost:3000
```

The root URL redirects to the best matching language (cookie → browser
language → Russian fallback, configured in `src/config/brand.ts`).

## Scripts

| Command          | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | Development server                         |
| `pnpm build`     | Production build                           |
| `pnpm start`     | Serve the production build                 |
| `pnpm lint`      | ESLint                                     |
| `pnpm typecheck` | TypeScript                                 |
| `pnpm format`    | Prettier write / `format:check` to verify  |
| `pnpm test`      | Vitest unit tests                          |
| `pnpm test:e2e`  | Playwright e2e (builds nothing; see below) |
| `pnpm check`     | format:check + lint + typecheck + test     |

Playwright starts the app itself via `playwright.config.ts` (production
build must exist: run `pnpm build` first, or let the config run it).

## Localization

- Dictionaries: `messages/ru.json`, `messages/uz.json`, `messages/en.json`
  — same key structure in all three; every visible string lives there.
- Routing/detection: `src/i18n/` + `src/proxy.ts` (cookie `NEXT_LOCALE`).
- The **kiosk demo** has its own language state; its strings live in
  `src/content/demo-menu.ts` (all three languages in one file).
- To add a language: extend `locales` in `src/config/brand.ts`, add
  `messages/<locale>.json`, add the label in each dictionary's
  `langSwitcher`, and extend `SHORT` in
  `src/components/layout/LanguageSwitcher.tsx`.

## Replacing things

| What                      | Where / how                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Brand name, contacts, SEO | `src/config/brand.ts` + [guide](docs/BRAND_REPLACEMENT_GUIDE.md)                     |
| Logo                      | `src/components/brand/Logo.tsx` (drop-in SVG component)                              |
| Product photos/renders    | `public/images/` + `src/content/media.ts` + [guide](docs/MEDIA_REPLACEMENT_GUIDE.md) |
| Integration logos         | `public/brands/integrations/` + [guide](docs/INTEGRATION_LOGO_GUIDE.md)              |
| Copy & tone               | `messages/*.json` + [guide](docs/CONTENT_GUIDE.md)                                   |
| Industry evidence         | `src/content/evidence.ts` + `evidence.items` in each dictionary                      |

## Contacts

No phone/Telegram/email is invented. A channel renders **only** when its
environment variable is set:

```
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/yourcompany
NEXT_PUBLIC_CONTACT_PHONE=+998 xx xxx xx xx
NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
```

In development a small red note marks missing contacts; it never renders in
production.

## Lead form → Google Sheets

Server-side only (`src/app/api/leads/route.ts`). Setup:
[docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md).
Without credentials the API runs in **mock mode in development** and returns
an honest "temporarily unavailable" error in production.

## Analytics

Vercel Analytics/Speed Insights are always on (no config needed on Vercel).
GA4 and Yandex Metrica load **only** when their IDs are present:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
NEXT_PUBLIC_YANDEX_METRICA_ID=12345678
```

Events tracked: hero/CTA clicks, contact-channel clicks, form started /
submitted / error, language change, demo started / completed, rental section
viewed, integrations page opened. No personal data is ever attached.

## Deployment (Vercel)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Short version:

```bash
vercel link
vercel                       # preview
vercel --prod                # production
```

Set the environment variables from `.env.example` in the Vercel dashboard
(Google credentials as **encrypted** server variables).

## Before public launch

- [ ] Replace the temporary brand (name, logo, legal entity)
- [ ] Configure real contact channels
- [ ] Connect the production Google Sheet
- [ ] Legal review of the privacy notice (`src/app/[locale]/privacy/page.tsx` has the TODO)
- [ ] Add official integration logos
- [ ] Add real product imagery
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final domain
