import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Feedback } from "../route";

const redis = Redis.fromEnv();
const FEEDBACKS_KEY = "feedbacks";

// Fallback passcode if environment variable is not set
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "admin123";

// Helper to check passcode
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.split(" ")[1];
  return token === ADMIN_PASSCODE;
}

// ---------------------------------------------------------------------------
// GET /api/feedback/admin — returns ALL feedbacks
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = await redis.lrange<Feedback>(FEEDBACKS_KEY, 0, -1);
    
    // Sort newest first
    const feedbacks = raw.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (err) {
    console.error("[admin:GET]", err);
    return NextResponse.json({ error: "Failed to fetch feedbacks." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/feedback/admin — Approves/Unapproves a feedback
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, approved } = await req.json();
    if (!id || typeof approved !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1. Fetch all
    const allFeedbacks = await redis.lrange<Feedback>(FEEDBACKS_KEY, 0, -1);
    
    // 2. Find and update
    let updated = false;
    const newFeedbacks = allFeedbacks.map((fb) => {
      if (fb.id === id) {
        updated = true;
        return { ...fb, approved };
      }
      return fb;
    });

    if (!updated) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    // 3. Overwrite list in Redis
    // We use a transaction/pipeline to avoid data loss
    const p = redis.pipeline();
    p.del(FEEDBACKS_KEY);
    if (newFeedbacks.length > 0) {
      // lpush takes multiple arguments, but we need to keep the order.
      // Upstash lpush prepends. To maintain order, we can reverse the array and lpush,
      // or we can use rpush on the original array.
      p.rpush(FEEDBACKS_KEY, ...newFeedbacks);
    }
    await p.exec();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin:PATCH]", err);
    return NextResponse.json({ error: "Failed to update feedback." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/feedback/admin — Deletes a feedback
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // 1. Fetch all
    const allFeedbacks = await redis.lrange<Feedback>(FEEDBACKS_KEY, 0, -1);
    
    // 2. Filter out
    const newFeedbacks = allFeedbacks.filter((fb) => fb.id !== id);

    if (newFeedbacks.length === allFeedbacks.length) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    // 3. Overwrite list in Redis
    const p = redis.pipeline();
    p.del(FEEDBACKS_KEY);
    if (newFeedbacks.length > 0) {
      p.rpush(FEEDBACKS_KEY, ...newFeedbacks);
    }
    await p.exec();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete feedback." }, { status: 500 });
  }
}
