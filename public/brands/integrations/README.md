# Integration logos

This directory holds the **official** logo files for the integration/trust
strip. Until a file exists here, the site renders a neutral text placeholder
for that brand — nothing breaks when files are missing.

## Required filenames

| Brand      | Filename         |
| ---------- | ---------------- |
| iiko       | `iiko.svg`       |
| Click      | `click.svg`      |
| Uzum       | `uzum.svg`       |
| Payme      | `payme.svg`      |
| HUMO       | `humo.svg`       |
| Uzcard     | `uzcard.svg`     |
| Visa       | `visa.svg`       |
| Mastercard | `mastercard.svg` |

## File requirements

- **Format:** SVG strongly preferred (crisp at any size). If only raster is
  available, use a transparent PNG at least 240 px wide and change the
  extension check in `src/components/home/IntegrationLogo.tsx`.
- **Padding:** trim the artwork to its bounding box; the layout adds its own
  clear space. Do not bake extra margins into the file.
- **Color:** use the brand's official full-color or monochrome variant as
  provided. **Never** recolor, redraw, distort or animate the artwork.
- **Source:** only files supplied by the brand owner or downloaded from an
  authorized brand center / press kit. Keep a note of where each file came
  from.

## Replacement steps

1. Obtain the official file (brand center, press kit, or partner manager).
2. Rename it to match the table above.
3. Drop it into this directory.
4. Restart the dev server / rebuild — the placeholder is replaced
   automatically.

## Legal note

Displaying these marks under an "Integrates with" heading describes factual
interoperability. Do **not** move them under headings like "Our partners"
unless a formal partnership exists, and do not imply sponsorship or
endorsement.
