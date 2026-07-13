import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { media, type MediaId } from "@/content/media";
import { ImagePlaceholder } from "@/components/media/ImagePlaceholder";
import type { Locale } from "@/config/brand";

/**
 * Server component that renders a registered media entry.
 * If the real asset exists under /public it is served through next/image
 * with correct dimensions (no layout shift); otherwise a polished SVG/CSS
 * placeholder composition is rendered. Replacing a placeholder therefore
 * requires only dropping the file into /public/images — no code changes.
 */
export async function ProductMedia({
  id,
  className,
  priority = false,
}: {
  id: MediaId;
  className?: string;
  priority?: boolean;
}) {
  const entry = media[id];
  const locale = (await getLocale()) as Locale;
  const alt = entry.alt[locale] ?? entry.alt.en;

  const filePath = path.join(process.cwd(), "public", entry.src);
  const exists = fs.existsSync(filePath);

  if (exists) {
    return (
      <Image
        src={entry.src}
        alt={alt}
        width={entry.width}
        height={entry.height}
        priority={priority}
        className={className}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  return (
    <figure className={className} role="img" aria-label={alt}>
      <ImagePlaceholder entry={entry} />
    </figure>
  );
}
