import { getTranslations } from "next-intl/server";
import { hasAnyContactChannel } from "@/lib/contacts";

/**
 * Developer-only notice shown when no contact channel is configured.
 * Never rendered in production builds.
 */
export async function DevContactWarning() {
  if (process.env.NODE_ENV === "production" || hasAnyContactChannel()) {
    return null;
  }
  const t = await getTranslations("devWarning");
  return (
    <p className="mt-2 max-w-xs rounded-lg border border-dashed border-error/40 bg-error/5 p-2.5 text-xs text-error">
      {t("missingContacts")}
    </p>
  );
}
