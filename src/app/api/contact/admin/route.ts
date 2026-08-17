import { NextRequest, NextResponse } from "next/server";
import { ContactMessage } from "../route";
import { ADMIN_KEYS, requireAdmin } from "@/lib/admin";
import { store } from "@/lib/store";

// ---------------------------------------------------------------------------
// All admin endpoints require the shared passcode auth (rate-limited).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// GET /api/contact/admin — all messages, newest first
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const all = await store.listGetAll<ContactMessage>(ADMIN_KEYS.messages);
    const sorted = all.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(sorted, { status: 200 });
  } catch (err) {
    console.error("[contact:admin:GET]", err);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/contact/admin — mark a message read/unread
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { id, read } = await req.json();
    if (!id || typeof read !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const all = await store.listGetAll<ContactMessage>(ADMIN_KEYS.messages);
    let updated = false;
    const next = all.map((m) => {
      if (m.id === id) {
        updated = true;
        return { ...m, read };
      }
      return m;
    });

    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await store.listReplace(ADMIN_KEYS.messages, next);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact:admin:PATCH]", err);
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/contact/admin?id=... — remove a message
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

    const all = await store.listGetAll<ContactMessage>(ADMIN_KEYS.messages);
    const next = all.filter((m) => m.id !== id);

    if (next.length === all.length) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await store.listReplace(ADMIN_KEYS.messages, next);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact:admin:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
