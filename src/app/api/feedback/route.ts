import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

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
}

// ---------------------------------------------------------------------------
// Redis client
// ---------------------------------------------------------------------------
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const FEEDBACKS_KEY = "feedbacks";
const RATE_LIMIT_TTL = 86400; // 24 hours in seconds
const RATE_LIMIT_MS = RATE_LIMIT_TTL * 1000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + "portfolio-salt")
    .digest("hex")
    .slice(0, 16);
}

function sanitize(str: string, maxLen: number): string {
  return str
    .replace(/<[^>]*>/g, "") // strip HTML
    .replace(/[^\w\s.,!?'"@()\-:;]/g, "")
    .slice(0, maxLen)
    .trim();
}

function uuid(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// GET /api/feedback — returns approved feedbacks, newest first
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    // lrange returns items as stored — each item is already parsed by Upstash
    const raw = await redis.lrange<Feedback>(FEEDBACKS_KEY, 0, -1);

    const feedbacks = raw
      .filter((f) => f.approved)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map(({ ipHash: _ip, approved: _approved, ...rest }) => rest); // strip private fields

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (err) {
    console.error("[feedback:GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/feedback — validates, rate-limits, and persists
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // --- Validate ---
  const errors: Record<string, string> = {};

  const name =
    typeof body.name === "string" ? sanitize(body.name, 60) : "";
  const role =
    typeof body.role === "string" ? sanitize(body.role, 80) : "";
  const message =
    typeof body.message === "string" ? sanitize(body.message, 500) : "";
  const rating =
    typeof body.rating === "number" ? Math.round(body.rating) : NaN;

  if (!name || name.length < 2) errors.name = "At least 2 characters required.";
  if (!message || message.length < 10) errors.message = "At least 10 characters required.";
  if (isNaN(rating) || rating < 1 || rating > 5) errors.rating = "Rating must be between 1 and 5.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed", fields: errors },
      { status: 400 }
    );
  }

  // --- Rate limit (persisted in Redis, survives cold starts) ---
  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = hashIp(rawIp);
  const rateLimitKey = `ratelimit:${ipHash}`;

  const lastSubmit = await redis.get<number>(rateLimitKey);
  if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: "You can only submit feedback once every 24 hours." },
      { status: 429 }
    );
  }

  // --- Build entry ---
  const entry: Feedback = {
    id: uuid(),
    name,
    role,
    rating,
    message,
    approved: false, // manual moderation — flip in Upstash console or CLI
    createdAt: new Date().toISOString(),
    ipHash,
  };

  // --- Persist ---
  try {
    // lpush prepends → newest items are at index 0
    await redis.lpush(FEEDBACKS_KEY, entry);
    // Set rate limit key with 24h TTL
    await redis.set(rateLimitKey, Date.now(), { ex: RATE_LIMIT_TTL });

    return NextResponse.json({ success: true, id: entry.id }, { status: 201 });
  } catch (err) {
    console.error("[feedback:POST]", err);
    return NextResponse.json(
      { error: "Failed to save feedback. Please try again." },
      { status: 500 }
    );
  }
}
