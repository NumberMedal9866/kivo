import { brand } from "@/config/brand";

/**
 * Contact channels are rendered only when configured through environment
 * variables — no invented phone numbers, Telegram handles or emails.
 */
export type ContactChannel = {
  id: "telegram" | "phone" | "email";
  href: string;
  /** Human-readable value, e.g. the phone number itself. */
  value: string;
};

export function getContactChannels(): ContactChannel[] {
  const channels: ContactChannel[] = [];
  const { telegramUrl, phone, email } = brand.contacts;

  if (telegramUrl) {
    channels.push({
      id: "telegram",
      href: telegramUrl,
      value: telegramUrl.replace(/^https?:\/\//, ""),
    });
  }
  if (phone) {
    channels.push({ id: "phone", href: `tel:${phone.replace(/[^\d+]/g, "")}`, value: phone });
  }
  if (email) {
    channels.push({ id: "email", href: `mailto:${email}`, value: email });
  }
  return channels;
}

export function hasAnyContactChannel(): boolean {
  return getContactChannels().length > 0;
}
