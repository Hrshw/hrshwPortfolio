import { NextRequest, NextResponse } from "next/server";
import { INQUIRY_STATUSES } from "@/lib/hire";
import type { Inquiry, InquiryStatus } from "@/lib/hire";
import { requireAdmin } from "@/lib/admin";
import { store } from "@/lib/store";

const INQUIRIES_KEY = "inquiries";

// ---------------------------------------------------------------------------
// GET /api/inquiries/admin — all inquiries, newest first
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const all = await store.listGetAll<Inquiry>(INQUIRIES_KEY);
    const sorted = all.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(sorted, { status: 200 });
  } catch (err) {
    console.error("[inquiries:admin:GET]", err);
    return NextResponse.json({ error: "Failed to fetch inquiries." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/inquiries/admin — update status and/or read flag
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { id, status, read } = await req.json();
    if (!id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    if (status !== undefined && !(INQUIRY_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (read !== undefined && typeof read !== "boolean") {
      return NextResponse.json({ error: "Invalid read flag" }, { status: 400 });
    }

    const all = await store.listGetAll<Inquiry>(INQUIRIES_KEY);
    let updated = false;
    const next = all.map((q) => {
      if (q.id === id) {
        updated = true;
        return {
          ...q,
          ...(status !== undefined ? { status: status as InquiryStatus } : {}),
          ...(read !== undefined ? { read } : {}),
        };
      }
      return q;
    });

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    await store.listReplace(INQUIRIES_KEY, next);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[inquiries:admin:PATCH]", err);
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/inquiries/admin?id=... — remove an inquiry
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const all = await store.listGetAll<Inquiry>(INQUIRIES_KEY);
    const next = all.filter((q) => q.id !== id);

    if (next.length === all.length) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    await store.listReplace(INQUIRIES_KEY, next);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[inquiries:admin:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}
