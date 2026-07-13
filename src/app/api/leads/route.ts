import { NextResponse, type NextRequest } from "next/server";
import { leadSchema, MIN_FORM_COMPLETION_MS } from "@/lib/leads/schema";
import { appendLead, getSheetsConfig, isMockMode } from "@/lib/leads/sheets";

export const runtime = "nodejs";

/**
 * Lead intake endpoint.
 * Responses use stable codes; the client renders localized messages.
 * Never claims a lead was stored unless storage actually succeeded.
 */

// Best-effort in-memory rate limit (per serverless instance).
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, code: "error" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "validation" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json({ ok: false, code: "validation", fields }, { status: 422 });
  }

  const lead = parsed.data;

  // Honeypot filled → pretend success, store nothing.
  if (lead.website !== "") {
    return NextResponse.json({ ok: true });
  }

  // Submitted faster than a human plausibly could → reject quietly.
  if (Date.now() - lead.startedAt < MIN_FORM_COMPLETION_MS) {
    return NextResponse.json({ ok: false, code: "error" }, { status: 400 });
  }

  // Production without storage configured: fail honestly with a code the
  // client turns into "use Telegram/phone/email instead".
  if (!isMockMode() && getSheetsConfig() === null) {
    console.error("[leads] Google Sheets is not configured — lead rejected");
    return NextResponse.json({ ok: false, code: "unavailable" }, { status: 503 });
  }

  try {
    const { stored } = await appendLead(lead);
    if (!stored) {
      return NextResponse.json({ ok: false, code: "unavailable" }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log the failure without the form contents.
    console.error(
      "[leads] failed to store lead:",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json({ ok: false, code: "error" }, { status: 502 });
  }
}
