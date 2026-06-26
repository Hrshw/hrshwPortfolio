import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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
// Paths
// ---------------------------------------------------------------------------
const DATA_FILE = path.join(process.cwd(), "data", "feedbacks.json");
const TMP_FILE = path.join(process.cwd(), "data", "feedbacks.tmp.json");

// ---------------------------------------------------------------------------
// In-memory rate limit store  { ipHash: lastSubmitTimestamp }
// Resets on server restart — fine for a portfolio.
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------------------------------------------------------------------------
// Sequential write queue — prevents concurrent write corruption
// ---------------------------------------------------------------------------
let writeQueue: Promise<void> = Promise.resolve();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function readFeedbacks(): Feedback[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
    return raw ? (JSON.parse(raw) as Feedback[]) : [];
  } catch {
    return [];
  }
}

function atomicWrite(data: Feedback[]): void {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(TMP_FILE, json, "utf-8");
  fs.renameSync(TMP_FILE, DATA_FILE); // OS-level atomic rename
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "portfolio-salt").digest("hex").slice(0, 16);
}

function sanitize(str: string, maxLen: number): string {
  return str
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[^\w\s.,!?'"@()\-:;]/g, "") // keep safe chars
    .slice(0, maxLen)
    .trim();
}

function uuid(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// GET /api/feedback  — returns only approved feedbacks
// ---------------------------------------------------------------------------
export async function GET() {
  const feedbacks = readFeedbacks()
    .filter((f) => f.approved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(({ ipHash: _ipHash, approved: _approved, ...rest }) => rest); // strip private fields

  return NextResponse.json(feedbacks, { status: 200 });
}

// ---------------------------------------------------------------------------
// POST /api/feedback  — validates, rate-limits, and persists
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // --- Validate fields ---
  const errors: Record<string, string> = {};

  const name = typeof body.name === "string" ? sanitize(body.name, 60) : "";
  const role = typeof body.role === "string" ? sanitize(body.role, 80) : "";
  const message = typeof body.message === "string" ? sanitize(body.message, 500) : "";
  const rating = typeof body.rating === "number" ? Math.round(body.rating) : NaN;

  if (!name || name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!message || message.length < 10) errors.message = "Message must be at least 10 characters.";
  if (isNaN(rating) || rating < 1 || rating > 5) errors.rating = "Rating must be between 1 and 5.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  // --- Rate limit ---
  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = hashIp(rawIp);
  const lastSubmit = rateLimitMap.get(ipHash);
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
    approved: false, // manual moderation required
    createdAt: new Date().toISOString(),
    ipHash,
  };

  // --- Atomic sequential write ---
  const result = await new Promise<NextResponse>((resolve) => {
    writeQueue = writeQueue.then(() => {
      try {
        const existing = readFeedbacks();
        existing.push(entry);
        atomicWrite(existing);
        rateLimitMap.set(ipHash, Date.now());
        resolve(
          NextResponse.json({ success: true, id: entry.id }, { status: 201 })
        );
      } catch (err) {
        console.error("[feedback] write error:", err);
        resolve(
          NextResponse.json({ error: "Failed to save feedback. Please try again." }, { status: 500 })
        );
      }
    });
  });

  return result;
}
