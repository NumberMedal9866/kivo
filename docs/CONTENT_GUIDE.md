# Content guide

## Where copy lives

- All visible website copy: `messages/ru.json`, `messages/uz.json`,
  `messages/en.json`. Identical key structure; if you add a key, add it to
  all three files (the build will surface missing keys at runtime in dev).
- Kiosk demo strings and the fictional demo menu:
  `src/content/demo-menu.ts` (all three languages inline, because the demo's
  language is independent of the site locale).
- Industry evidence source URLs: `src/content/evidence.ts`; the wording is
  in each dictionary under `evidence.items`.

## Tone

- Established, confident, technically competent. B2B, not startup-hype.
- Banned vocabulary: "innovative", "revolutionary", "next-generation",
  countdowns, false scarcity, invented discounts.
- No invented facts: no years in business, kiosk counts, client names,
  testimonials, awards, offices, guaranteed results or exact prices.
- Commercial phrasing that is allowed: flexible rental, low initial
  commitment, individually prepared terms.

## Language notes

- **Russian** — professional B2B copy, ё is used, numbers formatted
  `24 000`. Avoid literal calques from English.
- **Uzbek (Latin)** — modern standard orthography. Use `‘` (U+2018) in
  `o‘`/`g‘` (e.g. `O‘zbekiston`, `to‘lov`) and `’` (U+2019) as tutuq belgisi
  (e.g. `ta’minot`, `ma’lumot`). Never a straight apostrophe `'`.
- **English** — concise, credible, no exclamation marks.

## Claims that require care

- Evidence section: every stat keeps its source link + date, combined
  digital-channel figures must stay labeled as combined, and the outcome
  disclaimer stays visible. These are external benchmarks, never kiyo
  results.
- Integrations: say "supported / configured per merchant", never
  "100% compatible" or "works flawlessly". No invented API details,
  certifications, acquiring banks or terminal models.
- Unresolved technical matters (offline mode, exact install time, SLAs,
  hardware specs, data residency): describe as "configurable" or "confirmed
  during technical assessment" — do not invent answers.

## Future content

The information architecture leaves room for articles / case studies later
(e.g. an `app/[locale]/blog` segment). Do not ship an empty blog for SEO —
add it when there is real content.
