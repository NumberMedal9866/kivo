import { JWT } from "google-auth-library";
import type { Lead } from "@/lib/leads/schema";

/**
 * Server-only Google Sheets storage for leads.
 * Credentials come exclusively from environment variables and never reach
 * the client bundle. Setup instructions: docs/GOOGLE_SHEETS_SETUP.md.
 */

export type SheetsConfig = {
  email: string;
  key: string;
  sheetId: string;
  tab: string;
};

export function getSheetsConfig(): SheetsConfig | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !rawKey || !sheetId) return null;
  return {
    email,
    // Vercel/env files often store the key single-line with literal \n.
    key: rawKey.replace(/\\n/g, "\n"),
    sheetId,
    tab: process.env.GOOGLE_SHEET_TAB || "Leads",
  };
}

export function isMockMode(): boolean {
  if (process.env.LEADS_MOCK_MODE === "true") return true;
  // In development a missing configuration falls back to mock mode so the
  // form can be exercised locally without credentials.
  return process.env.NODE_ENV !== "production" && getSheetsConfig() === null;
}

/** Column order written to the sheet — keep in sync with docs. */
export function leadToRow(lead: Lead, timestamp: string): string[] {
  return [
    timestamp,
    lead.locale,
    lead.name,
    lead.business,
    lead.phone,
    lead.message,
    lead.context.pageUrl,
    lead.context.referrer,
    lead.context.utmSource,
    lead.context.utmMedium,
    lead.context.utmCampaign,
    lead.context.utmContent,
    lead.context.utmTerm,
    lead.consent ? "yes" : "no",
    "new",
  ];
}

export async function appendLead(lead: Lead): Promise<{ stored: boolean }> {
  const timestamp = new Date().toISOString();

  if (isMockMode()) {
    // Development mock: no external call. Do not log form contents in
    // production — this branch never runs there unless explicitly forced.
    console.info("[leads] mock mode — lead accepted (not stored)", {
      locale: lead.locale,
      timestamp,
    });
    return { stored: true };
  }

  const config = getSheetsConfig();
  if (!config) {
    return { stored: false };
  }

  const client = new JWT({
    email: config.email,
    key: config.key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const range = encodeURIComponent(`${config.tab}!A:O`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  await client.request({
    url,
    method: "POST",
    data: { values: [leadToRow(lead, timestamp)] },
  });

  return { stored: true };
}
