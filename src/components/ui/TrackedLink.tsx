"use client";

import { Link } from "@/i18n/navigation";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/** next-intl Link that fires an analytics event on click. */
export function TrackedLink({
  href,
  event,
  eventProps,
  className,
  children,
}: {
  href: string;
  event: AnalyticsEvent;
  eventProps?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(event, eventProps)}>
      {children}
    </Link>
  );
}
