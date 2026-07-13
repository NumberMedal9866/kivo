# Integration logo guide

The integration strip and integrations sections display iiko, Click, Uzum,
Payme, HUMO, Uzcard, Visa and Mastercard. Until official artwork is added,
the site renders neutral text placeholders.

The authoritative instructions (filenames, formats, padding, legal rules)
live next to the assets: [`public/brands/integrations/README.md`](../public/brands/integrations/README.md).

Key rules, repeated for visibility:

- Use only official files (brand center / press kit / supplied by the brand).
- Never recolor, redraw, distort or animate the artwork.
- Preserve clear space; files should be trimmed, layout adds spacing.
- The heading stays **"Integrates with"** — not "Our partners" — unless a
  formal partnership is signed.
- The list itself is configured in `src/config/brand.ts`
  (`brand.integrations`); adding an entry there automatically adds it to the
  strip, the integrations page and the FAQ copy should be reviewed manually.
