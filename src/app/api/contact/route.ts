import { NextRequest, NextResponse } from "next/server";
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
import { sendContactEmail } from "@/lib/email";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  ipHash: string;
}

const MESSAGES_KEY = "contact_messages";

const NAME_MAX = 60;
const EMAIL_MAX = 200;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

// ---------------------------------------------------------------------------
// POST /api/contact — validated, rate-limited, spam-filtered contact form
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Parse body (cap payload size) ---
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 16_384) {
      return NextResponse.json(
        { error: "Payload too large." },
        { status: 413 }
      );
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // --- Spam filters (fail silently for bots — return success, drop the data) ---
  if (isHoneypotFilled(body.website)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
  if (isTooFast(body.formStartedAt)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // --- Rate limits ---
  const ipHash = hashIp(getClientIp(req));

  const perIp = await rateLimit(`contact:${ipHash}`, 5, 3600); // 5 / hour / IP
  if (!perIp.allowed) {
    return NextResponse.json(
      {
        error: "Too many messages from this device. Please try again later.",
      },
      { status: 429 }
    );
  }

  const daily = await globalDailyCap(150, "contact");
  if (!daily.allowed) {
    return NextResponse.json(
      { error: "Contact form is temporarily paused. Please try again tomorrow." },
      { status: 429 }
    );
  }

  // --- Validate & sanitize ---
  const name = typeof body.name === "string" ? sanitizeText(body.name, NAME_MAX) : "";
  const email =
    typeof body.email === "string" ? sanitizeText(body.email, EMAIL_MAX).toLowerCase() : "";
  const message =
    typeof body.message === "string" ? sanitizeText(body.message, MESSAGE_MAX) : "";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name (min 2 characters).";
  if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
  if (message.length < MESSAGE_MIN)
    errors.message = `Message must be at least ${MESSAGE_MIN} characters.`;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed", fields: errors },
      { status: 400 }
    );
  }

  // --- Persist ---
  const entry: ContactMessage = {
    id: uuid(),
    name,
    email,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    ipHash,
  };

  try {
    await store.listPushFront(MESSAGES_KEY, entry);
    // Best-effort email notification (no-op unless Resend is configured).
    await sendContactEmail({ name, email, message });
    return NextResponse.json(
      { success: true, id: entry.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[contact:POST]", err);
    return NextResponse.json(
      { error: "Failed to save your message. Please try again." },
      { status: 500 }
    );
  }
}
