# Brand replacement guide

"KIVO" is a **temporary brand**. Nothing has been checked for trademark
availability. All brand references flow from two places, so replacing the
brand is a contained operation.

## 1. `src/config/brand.ts`

Update:

- `name`, `legalName`, `shortName` — the new company name and legal entity
- `tagline`, `description` — positioning copy (English master)
- `logoText`, `monogram` — text used by the logo component and watermarks
- `seo.*` — site name, default title/description
- `socialLinks` — real profiles, if any

The file is marked with `TEMPORARY BRAND — replace this configuration…` —
remove that comment when done.

## 2. Translation dictionaries

`messages/ru.json`, `messages/uz.json`, `messages/en.json` mention the brand
in a handful of copy strings (hero subtitle, rental section, service intro,
meta descriptions). Search each file for the old name and reword naturally —
do not blind-replace, the sentences should still read well.

## 3. Logo

`src/components/brand/Logo.tsx` exports:

- `LogoMark` — the square monogram/icon
- `Logo` — mark + wordmark lockup

Replace the SVG contents with the final artwork, keeping the same component
props (`className`, `title`). Everything that shows the logo (header, footer,
kiosk mockup, demo screen, favicons) uses these components or
`brand.logoText`, so no other file needs editing.

Also replace:

- `src/app/icon.svg` — favicon
- `src/app/[locale]/opengraph-image.tsx` — social sharing image (uses
  `brand.monogram`/`brand.logoText`; adjust styling if desired)

## 4. Domain

- Set `NEXT_PUBLIC_SITE_URL` to the production domain (canonical URLs,
  hreflang, sitemap and OG URLs all derive from it).

## 5. Verify

```bash
pnpm check && pnpm build
grep -ri "kivo" src messages   # should only match brand.ts after renaming
```
