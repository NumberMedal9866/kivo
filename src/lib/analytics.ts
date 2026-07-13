"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Central analytics event helper. Events never include personal data
 * (no names, phone numbers or message content) — only event names and
 * coarse, non-identifying properties such as locale or section.
 */
export type AnalyticsEvent =
  | "hero_cta_click"
  | "telegram_click"
  | "phone_click"
  | "email_click"
  | "lead_form_started"
  | "lead_form_submitted"
  | "lead_form_error"
  | "language_changed"
  | "demo_started"
  | "demo_completed"
  | "integrations_page_opened"
  | "rental_section_viewed";

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, action: string, goal: string, params?: EventProps) => void;
  }
}

const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;

export function trackEvent(name: AnalyticsEvent, props?: EventProps): void {
  try {
    vercelTrack(name, props);
  } catch {
    // Analytics must never break the UI.
  }
  try {
    window.gtag?.("event", name, props);
  } catch {
    /* ignore */
  }
  try {
    if (YM_ID) {
      window.ym?.(Number(YM_ID), "reachGoal", name, props);
    }
  } catch {
    /* ignore */
  }
}
