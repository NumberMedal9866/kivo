import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Integration } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * Official integration logo. Looks for <id>.svg first, then <id>.png in
 * public/brands/integrations (see the README there). Official artwork is
 * shown as-is — never recolored, distorted or animated. When no official
 * file exists (currently: iiko — see iiko.MISSING.md) a neutral wordmark
 * placeholder is rendered instead.
 *
 * `tile` wraps the logo in a consistent chip. Some official files are the
 * brands' white-on-dark variants (wordmark filled white) — those get a
 * night tile so the artwork stays untouched and legible.
 */

const DARK_TILE = new Set(["click"]);

function findLogoFile(id: string): string | undefined {
  const dir = path.join(process.cwd(), "public", "brands", "integrations");
  return ["svg", "png"]
    .map((ext) => `${id}.${ext}`)
    .find((name) => fs.existsSync(path.join(dir, name)));
}

/** True when an official asset exists for this integration. */
export function hasIntegrationLogo(id: string): boolean {
  return Boolean(findLogoFile(id));
}

export function IntegrationLogo({
  integration,
  tile = false,
  className,
}: {
  integration: Integration;
  tile?: boolean;
  className?: string;
}) {
  const file = findLogoFile(integration.id);
  // Dark tiles only make sense for existing white-variant artwork.
  const dark = Boolean(file) && DARK_TILE.has(integration.id);

  const logo = file ? (
    <Image
      src={`/brands/integrations/${file}`}
      alt={integration.name}
      width={112}
      height={36}
      className={cn("h-6 w-auto max-w-28 object-contain sm:h-7", !tile && className)}
    />
  ) : (
    <span
      className={cn(
        "text-[1.02rem] font-extrabold tracking-tight",
        tile ? "text-ink/70" : "text-current opacity-70",
        !tile && className,
      )}
    >
      {integration.name}
    </span>
  );

  if (!tile) return logo;

  return (
    <span
      className={cn(
        "inline-flex h-13 min-w-24 items-center justify-center rounded-xl px-4",
        dark
          ? "bg-night-soft shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]"
          : "bg-white shadow-[0_1px_2px_rgb(0_0_0/0.15)]",
        className,
      )}
    >
      {logo}
    </span>
  );
}
