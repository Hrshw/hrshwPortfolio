import { NextRequest, NextResponse } from "next/server";
import type { Feedback } from "@/lib/feedback";
import { ADMIN_KEYS, requireAdmin } from "@/lib/admin";
import { store } from "@/lib/store";

// ---------------------------------------------------------------------------
// GET /api/feedback/admin — returns ALL feedbacks (incl. pending)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const raw = await store.listGetAll<Feedback>(ADMIN_KEYS.feedbacks);
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
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { id, approved } = await req.json();
    if (!id || typeof approved !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const all = await store.listGetAll<Feedback>(ADMIN_KEYS.feedbacks);
    let updated = false;
    const next = all.map((fb) => {
      if (fb.id === id) {
        updated = true;
        return { ...fb, approved };
      }
      return fb;
    });

    if (!updated) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    await store.listReplace(ADMIN_KEYS.feedbacks, next);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[admin:PATCH]", err);
    return NextResponse.json({ error: "Failed to update feedback." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/feedback/admin?id=... — Deletes a feedback
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const all = await store.listGetAll<Feedback>(ADMIN_KEYS.feedbacks);
    const next = all.filter((fb) => fb.id !== id);

    if (next.length === all.length) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    await store.listReplace(ADMIN_KEYS.feedbacks, next);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[admin:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete feedback." }, { status: 500 });
  }
}
