import { NextRequest, NextResponse } from "next/server";
import {
  BUDGET_BANDS,
  NEEDS,
  PROJECT_TYPES,
  TIMELINES,
  isLang,
} from "@/lib/hire";
import type { Inquiry } from "@/lib/hire";
import { buildLocalizedSummary } from "@/lib/hire-i18n";
import {
  getClientIp,
  globalDailyCap,
  hashIp,
  isHoneypotFilled,
  isTooFast,
  isValidEmail,
  rateLimit,
  sanitizeText,
  uuid,
} from "@/lib/security";
import { store } from "@/lib/store";
import { sendInquiryNotifications } from "@/lib/email";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type { Inquiry };

const INQUIRIES_KEY = "inquiries";

const NAME_MAX = 60;
const COMPANY_MAX = 80;
const DETAILS_MIN = 20;
const DETAILS_MAX = 2000;
const MAX_NEEDS = 8;

// ---------------------------------------------------------------------------
// POST /api/inquiries — the /hire brief form
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Parse body (cap payload size) ---
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 16_384) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // --- Spam filters (silent fake-success for bots) ---
  if (isHoneypotFilled(body.website)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
  if (isTooFast(body.formStartedAt)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // --- Rate limits ---
  const ipHash = hashIp(getClientIp(req));

  const perIp = await rateLimit(`hire:${ipHash}`, 3, 3600); // 3 / hour / IP
  if (!perIp.allowed) {
    return NextResponse.json(
      { error: "Too many submissions from this device. Please try again later." },
      { status: 429 }
    );
  }

  const daily = await globalDailyCap(50, "hire");
  if (!daily.allowed) {
    return NextResponse.json(
      { error: "The brief form is temporarily paused. Please try again tomorrow." },
      { status: 429 }
    );
  }

  // --- Validate & sanitize ---
  const name = typeof body.name === "string" ? sanitizeText(body.name, NAME_MAX) : "";
  const email =
    typeof body.email === "string" ? sanitizeText(body.email, 200).toLowerCase() : "";
  const company =
    typeof body.company === "string" ? sanitizeText(body.company, COMPANY_MAX) : undefined;
  const projectType = typeof body.projectType === "string" ? body.projectType : "";
  const needsRaw = Array.isArray(body.needs) ? body.needs : [];
  const needs = needsRaw
    .filter((n): n is string => typeof n === "string")
    .map((n) => n.trim())
    .filter((n) => (NEEDS as readonly string[]).includes(n))
    .slice(0, MAX_NEEDS);
  const budgetBand = typeof body.budgetBand === "string" ? body.budgetBand : "";
  const timeline = typeof body.timeline === "string" ? body.timeline : "";
  const details =
    typeof body.details === "string" ? sanitizeText(body.details, DETAILS_MAX) : "";
  // Client's UI language (validated; defaults to English).
  const lang = isLang(body.lang) ? body.lang : "en";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name (min 2 characters).";
  if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
  if (!(PROJECT_TYPES as readonly string[]).includes(projectType))
    errors.projectType = "Please choose a project type.";
  if (!(BUDGET_BANDS as readonly string[]).includes(budgetBand))
    errors.budgetBand = "Please choose a budget range.";
  if (!(TIMELINES as readonly string[]).includes(timeline))
    errors.timeline = "Please choose a timeline.";
  if (details.length < DETAILS_MIN)
    errors.details = `Tell me a bit more about the project (min ${DETAILS_MIN} characters).`;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed", fields: errors },
      { status: 400 }
    );
  }

  // --- Build + persist ---
  const inquiry: Inquiry = {
    id: uuid(),
    name,
    email,
    ...(company && company.length > 0 ? { company } : {}),
    projectType,
    needs,
    budgetBand,
    timeline,
    details,
    lang,
    status: "new",
    read: false,
    createdAt: new Date().toISOString(),
    ipHash,
  };
  // Client-facing summary in their language; the owner email stays English.
  const summary = buildLocalizedSummary(lang, inquiry);

  try {
    await store.listPushFront(INQUIRIES_KEY, inquiry);
    // Best-effort emails: copy to owner + confirmation to client.
    await sendInquiryNotifications(inquiry, summary);
    return NextResponse.json(
      { success: true, id: inquiry.id, summary },
      { status: 201 }
    );
  } catch (err) {
    console.error("[inquiries:POST]", err);
    return NextResponse.json(
      { error: "Failed to save your inquiry. Please try again." },
      { status: 500 }
    );
  }
}
