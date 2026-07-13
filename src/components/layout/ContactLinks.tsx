"use client";

import { useTranslations } from "next-intl";
import { getContactChannels } from "@/lib/contacts";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const EVENT: Record<string, AnalyticsEvent> = {
  telegram: "telegram_click",
  phone: "phone_click",
  email: "email_click",
};

function ChannelIcon({ id, className }: { id: string; className?: string }) {
  if (id === "telegram") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M21.7 3.3a1.5 1.5 0 0 0-1.6-.2L2.9 10.4c-1.2.5-1.1 2.2.1 2.6l4.4 1.5 1.7 5.2c.4 1.1 1.8 1.3 2.5.4l2.4-2.9 4.5 3.3c.9.7 2.2.2 2.4-.9l2.1-14.7a1.5 1.5 0 0 0-.7-1.6ZM9.3 13.6l8.2-6.4c.3-.3.7.2.4.5l-6.7 6.9-.3 3.2-1.6-4.2Z" />
      </svg>
    );
  }
  if (id === "phone") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path
          d="M5 4h4l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Renders only the contact channels that are configured via environment
 * variables. `variant="footer"` = compact text links; `variant="buttons"` =
 * prominent alternative-contact buttons for CTA sections.
 */
export function ContactLinks({
  variant = "buttons",
  dark = false,
}: {
  variant?: "footer" | "buttons";
  dark?: boolean;
}) {
  const t = useTranslations();
  const channels = getContactChannels();

  if (channels.length === 0) return null;

  if (variant === "footer") {
    return (
      <ul className="space-y-2.5">
        {channels.map((c) => (
          <li key={c.id}>
            <a
              href={c.href}
              target={c.id === "telegram" ? "_blank" : undefined}
              rel={c.id === "telegram" ? "noopener noreferrer" : undefined}
              onClick={() => trackEvent(EVENT[c.id]!)}
              className={cn(
                "inline-flex items-center gap-2 text-sm transition-colors",
                dark ? "text-white/65 hover:text-white" : "text-ink-soft hover:text-ink",
              )}
            >
              <ChannelIcon id={c.id} className="h-4 w-4" />
              <span>{c.id === "telegram" ? t("contactChannels.telegram") : c.value}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {channels.map((c) => (
        <a
          key={c.id}
          href={c.href}
          target={c.id === "telegram" ? "_blank" : undefined}
          rel={c.id === "telegram" ? "noopener noreferrer" : undefined}
          onClick={() => trackEvent(EVENT[c.id]!)}
          className={cn(buttonClasses({ variant: "secondary", size: "md" }))}
        >
          <ChannelIcon id={c.id} className="h-4.5 w-4.5" />
          {t(`cta.${c.id}`)}
        </a>
      ))}
    </div>
  );
}
