"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isValidPhone } from "@/lib/leads/schema";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<"name" | "phone" | "consent" | "business" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "error" | "unavailable";

function getUtm(search: string) {
  const params = new URLSearchParams(search);
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmTerm: params.get("utm_term") ?? "",
  };
}

export function LeadForm({ source }: { source: string }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const startedAt = useRef<number | null>(null);
  const started = useRef(false);

  function onFirstInteraction() {
    if (!started.current) {
      started.current = true;
      startedAt.current = Date.now();
      trackEvent("lead_form_started", { source });
    }
  }

  function validate(form: HTMLFormElement): FieldErrors {
    const data = new FormData(form);
    const next: FieldErrors = {};
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = t("errors.name");
    else if (name.length > 100) next.name = t("errors.nameMax");
    if (!isValidPhone(phone)) next.phone = t("errors.phone");
    if (business.length > 150) next.business = t("errors.businessMax");
    if (message.length > 2000) next.message = t("errors.messageMax");
    if (!data.get("consent")) next.consent = t("errors.consent");
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return; // duplicate-click guard

    const form = e.currentTarget;
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus("submitting");
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          business: String(data.get("business") ?? ""),
          phone: String(data.get("phone") ?? ""),
          message: String(data.get("message") ?? ""),
          consent: Boolean(data.get("consent")),
          locale,
          website: String(data.get("website") ?? ""),
          startedAt: startedAt.current ?? Date.now(),
          context: {
            pageUrl: window.location.href,
            referrer: document.referrer,
            ...getUtm(window.location.search),
          },
        }),
      });

      const payload = (await res.json().catch(() => null)) as { ok: boolean; code?: string } | null;

      if (res.ok && payload?.ok) {
        setStatus("success");
        trackEvent("lead_form_submitted", { source });
        return;
      }
      setStatus(payload?.code === "unavailable" ? "unavailable" : "error");
      trackEvent("lead_form_error", { source, code: payload?.code ?? String(res.status) });
    } catch {
      setStatus("error");
      trackEvent("lead_form_error", { source, code: "network" });
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="py-6 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
            <path
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="mt-5 text-title text-ink">{t("successTitle")}</h3>
        <p className="mx-auto mt-2 max-w-sm text-ink-soft">{t("successText")}</p>
        <Button
          variant="secondary"
          size="md"
          className="mt-7"
          onClick={() => {
            setStatus("idle");
            started.current = false;
            startedAt.current = null;
          }}
        >
          {t("successNew")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate onFocusCapture={onFirstInteraction}>
      <div className="space-y-5">
        <Field label={t("name")} error={errors.name} id="lead-name">
          <input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            placeholder={t("namePlaceholder")}
            aria-invalid={errors.name ? true : undefined}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field
          label={t("business")}
          hint={t("businessOptional")}
          error={errors.business}
          id="lead-business"
        >
          <input
            id="lead-business"
            name="business"
            type="text"
            autoComplete="organization"
            maxLength={150}
            placeholder={t("businessPlaceholder")}
            aria-invalid={errors.business ? true : undefined}
            className={inputClass(Boolean(errors.business))}
          />
        </Field>

        <Field label={t("phone")} error={errors.phone} id="lead-phone">
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder={t("phonePlaceholder")}
            aria-invalid={errors.phone ? true : undefined}
            className={inputClass(Boolean(errors.phone))}
          />
        </Field>

        <Field
          label={t("message")}
          hint={t("messageOptional")}
          error={errors.message}
          id="lead-message"
        >
          <textarea
            id="lead-message"
            name="message"
            rows={3}
            maxLength={2000}
            placeholder={t("messagePlaceholder")}
            aria-invalid={errors.message ? true : undefined}
            className={cn(inputClass(Boolean(errors.message)), "min-h-24 resize-y py-3")}
          />
        </Field>

        {/* Honeypot — visually hidden, ignored by humans */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="lead-website">Website</label>
          <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              required
              aria-invalid={errors.consent ? true : undefined}
              className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
            />
            <span className="text-sm leading-relaxed text-ink-soft">
              {t.rich("consentLabel", {
                link: (chunks) => (
                  <Link
                    href="/privacy"
                    className="font-semibold text-ink underline decoration-line underline-offset-2 hover:text-brand"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>
          {errors.consent ? (
            <FieldError id="lead-consent-error">{errors.consent}</FieldError>
          ) : null}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? t("submitting") : t("submit")}
        </Button>

        <p
          role="alert"
          aria-live="assertive"
          className="min-h-5 text-center text-sm font-medium text-error"
        >
          {status === "error" ? t("errors.generic") : null}
          {status === "unavailable" ? t("errors.unavailable") : null}
        </p>
      </div>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-12 w-full rounded-xl border bg-bg/60 px-4 text-[0.95rem] text-ink placeholder:text-ink-soft/50 transition-colors focus:bg-surface focus:outline-2 focus:outline-offset-1",
    invalid
      ? "border-error focus:outline-error"
      : "border-line hover:border-ink/20 focus:outline-brand",
  );
}

function Field({
  label,
  hint,
  error,
  id,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-2 text-sm font-bold text-ink">
        {label}
        {hint ? <span className="font-normal text-ink-soft/70">({hint})</span> : null}
      </label>
      {children}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-error">
      {children}
    </p>
  );
}
