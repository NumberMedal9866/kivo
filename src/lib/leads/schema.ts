import { z } from "zod";
import { locales } from "@/config/brand";

/**
 * Lead validation shared by the client form and the API route.
 * Error messages are returned as stable codes; the client maps codes to
 * localized strings from the translation dictionaries.
 */

/** Strip formatting characters people commonly type in phone numbers. */
export function normalizePhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (/^\+\d{9,15}$/.test(cleaned)) return cleaned;
  if (/^998\d{9}$/.test(cleaned)) return `+${cleaned}`;
  // Bare 9-digit national number â†’ assume Uzbekistan.
  if (/^\d{9}$/.test(cleaned)) return `+998${cleaned}`;
  if (/^\d{10,15}$/.test(cleaned)) return `+${cleaned}`;
  return cleaned;
}

export function isValidPhone(raw: string): boolean {
  return /^\+\d{9,15}$/.test(normalizePhone(raw));
}

/** Remove ASCII control characters (keeps newlines for multi-line fields). */
function sanitize(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

const text = (max: number) => z.string().transform(sanitize).pipe(z.string().max(max));

export const leadSchema = z.object({
  name: text(100).pipe(z.string().min(1, "name")),
  business: text(150).optional().default(""),
  phone: z
    .string()
    .transform((v) => v.trim())
    .refine(isValidPhone, "phone")
    .transform(normalizePhone),
  message: text(2000).optional().default(""),
  consent: z.literal(true, "consent"),
  locale: z.enum(locales),
  /** Honeypot â€” must stay empty. Bots that fill it are silently dropped. */
  website: z.string().max(0).optional().default(""),
  /** Client timestamp of the first interaction, for minimum-fill-time check. */
  startedAt: z.number().int().nonnegative(),
  context: z
    .object({
      pageUrl: text(500).optional().default(""),
      referrer: text(500).optional().default(""),
      utmSource: text(120).optional().default(""),
      utmMedium: text(120).optional().default(""),
      utmCampaign: text(120).optional().default(""),
      utmContent: text(120).optional().default(""),
      utmTerm: text(120).optional().default(""),
    })
    .default({
      pageUrl: "",
      referrer: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmContent: "",
      utmTerm: "",
    }),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Minimum time between first interaction and submit (basic bot filter). */
export const MIN_FORM_COMPLETION_MS = 3000;
