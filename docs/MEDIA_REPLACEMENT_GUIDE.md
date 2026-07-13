# Media replacement guide

Real product renders/photos are not available yet. Every image slot renders a
designed SVG/CSS placeholder until the real file appears — the swap requires
**no code changes**.

## How it works

1. `src/content/media.ts` registers every image: ID, expected file path,
   localized alt text, dimensions, focal-point guidance, and which
   placeholder art direction to use meanwhile.
2. `<ProductMedia id="…" />` (server component) checks whether the file
   exists under `/public`. If yes → `next/image` with correct dimensions
   (no layout shift). If no → `<ImagePlaceholder>` composition.

## Replacing an image

1. Open `src/content/media.ts` and find the entry (e.g. `hero-kiosk-front`).
2. Produce the asset following `width`/`height` (or same aspect ratio),
   `focalPoint` and `transparentPreferred`.
3. Save it at the registered path, e.g.
   `public/images/hero-kiosk-front.webp`.
4. Rebuild / restart dev server. Done.

### Format recommendations

- Photos/scenes: **WebP** or **AVIF**, quality ~80.
- Product renders needing transparency: **WebP with alpha** or PNG.
- Keep files under ~300 KB where possible; `next/image` handles resizing.
- Provide a `mobileSrc` variant in the registry if a tighter crop is needed
  on small screens (supported by the `MediaEntry` type).

## Registered image slots

| ID                         | Section                | Notes                      |
| -------------------------- | ---------------------- | -------------------------- |
| `hero-kiosk-front`         | Home hero              | transparent bg preferred   |
| `hero-kiosk-detail`        | Product page detail    | macro of body + monogram   |
| `kiosk-in-coffee-shop`     | Product page           | environment scene          |
| `kiosk-fast-food-counter`  | Problem/solution       | two kiosks, counter behind |
| `payment-terminal-closeup` | Product page           | terminal close-up          |
| `kiosk-interface-menu`     | Product page interface | straight-on screen         |
| `kiosk-interface-language` | Benefits               | language switch visible    |
| `installation-team`        | Implementation page    | technicians on site        |
| `multi-location-diagram`   | Integrations page      | can stay an SVG diagram    |

> The home hero currently uses the CSS/SVG `KioskMockup` component rather
> than an image slot. When a real hero render arrives, either place it at
> `hero-kiosk-front` and swap `<HeroKiosk>` internals to `<ProductMedia>`,
> or keep the interactive mockup — both are valid.

## Alt text

Alt text is localized per entry in the registry (`alt.ru/uz/en`). Update it
to describe the real photo when replacing.

## Palette

Colors are CSS variables in `src/app/globals.css` (`@theme`). After real
imagery lands, adjust `--color-bg`, `--color-brand-soft` and the kiosk
material tones (`--color-kiosk-*`) so backgrounds and product shots blend.
