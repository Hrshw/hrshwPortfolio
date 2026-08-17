import { NextRequest, NextResponse } from "next/server";
import {
  getClientIp,
  globalDailyCap,
  hashIp,
  isHoneypotFilled,
  isTooFast,
  isValidLinkedInUrl,
  rateLimit,
  sanitizeText,
  uuid,
} from "@/lib/security";
import { store } from "@/lib/store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Feedback {
  id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
  ipHash: string;
  linkedinUrl?: string;
  project?: string;
}

const FEEDBACKS_KEY = "feedbacks";

const NAME_MAX = 60;
const ROLE_MAX = 80;
const MESSAGE_MAX = 500;
const PROJECT_MAX = 80;
const LINKEDIN_MAX = 200;

// ---------------------------------------------------------------------------
// GET /api/feedback — approved feedbacks, newest first (public)
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const raw = await store.listGetAll<Feedback>(FEEDBACKS_KEY);

    const feedbacks = raw
      .filter((f) => f && f.approved)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      // Build the public shape explicitly — private fields never leave the server.
      .map((f) => ({
        id: f.id,
        name: f.name,
        role: f.role,
        rating: f.rating,
        message: f.message,
        createdAt: f.createdAt,
        ...(f.linkedinUrl ? { linkedinUrl: f.linkedinUrl } : {}),
        ...(f.project ? { project: f.project } : {}),
      }));

    return NextResponse.json(feedbacks, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("[feedback:GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/feedback — validates, spam-filters, rate-limits, persists
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

  // One feedback per device per 24h (prevents testimonial flooding / vote rigging).
  const perIp = await rateLimit(`feedback:${ipHash}`, 1, 86400);
  if (!perIp.allowed) {
    return NextResponse.json(
      { error: "You can only submit feedback once every 24 hours." },
      { status: 429 }
    );
  }

  const daily = await globalDailyCap(100, "feedback");
  if (!daily.allowed) {
    return NextResponse.json(
      { error: "Feedback is temporarily paused. Please try again tomorrow." },
      { status: 429 }
    );
  }

  // --- Validate & sanitize ---
  const name = typeof body.name === "string" ? sanitizeText(body.name, NAME_MAX) : "";
  const role = typeof body.role === "string" ? sanitizeText(body.role, ROLE_MAX) : "";
  const message =
    typeof body.message === "string" ? sanitizeText(body.message, MESSAGE_MAX) : "";
  const rating = typeof body.rating === "number" ? Math.round(body.rating) : NaN;
  const rawLinkedin =
    typeof body.linkedinUrl === "string" ? body.linkedinUrl.trim().slice(0, LINKEDIN_MAX) : "";
  const linkedinUrl = rawLinkedin && isValidLinkedInUrl(rawLinkedin) ? rawLinkedin : undefined;
  const project =
    typeof body.project === "string" ? sanitizeText(body.project, PROJECT_MAX) : undefined;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "At least 2 characters required.";
  if (message.length < 10) errors.message = "At least 10 characters required.";
  if (Number.isNaN(rating) || rating < 1 || rating > 5)
    errors.rating = "Rating must be between 1 and 5.";
  if (rawLinkedin && !linkedinUrl) errors.linkedinUrl = "Must be a valid linkedin.com URL.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed", fields: errors },
      { status: 400 }
    );
  }

  // --- Build + persist entry (pending admin approval) ---
  const entry: Feedback = {
    id: uuid(),
    name,
    role,
    rating,
    message,
    approved: false,
    createdAt: new Date().toISOString(),
    ipHash,
    ...(linkedinUrl ? { linkedinUrl } : {}),
    ...(project ? { project } : {}),
  };

  try {
    await store.listPushFront(FEEDBACKS_KEY, entry);
    return NextResponse.json({ success: true, id: entry.id }, { status: 201 });
  } catch (err) {
    console.error("[feedback:POST]", err);
    return NextResponse.json(
      { error: "Failed to save feedback. Please try again." },
      { status: 500 }
    );
  }
}
