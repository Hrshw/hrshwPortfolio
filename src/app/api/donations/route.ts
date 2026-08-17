import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { isValidAmount } from "@/lib/security";
import { store } from "@/lib/store";

// ---------------------------------------------------------------------------
// Lightweight manual donation tracker.
//
// UPI payments happen outside the app (in the visitor's UPI app), so this lets
// the owner tick "+1" in /admin whenever a donation lands, optionally with the
// amount. Stored as a single JSON value in the same store as everything else.
// ---------------------------------------------------------------------------

const DONATIONS_KEY = "donations";

interface DonationsState {
  count: number;
  totalAmount: number;
}

async function getState(): Promise<DonationsState> {
  const s = await store.get<DonationsState>(DONATIONS_KEY);
  return s && typeof s.count === "number" && typeof s.totalAmount === "number"
    ? s
    : { count: 0, totalAmount: 0 };
}

// ---------------------------------------------------------------------------
// GET /api/donations — current count + total
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json(await getState(), { status: 200 });
  } catch (err) {
    console.error("[donations:GET]", err);
    return NextResponse.json({ error: "Failed to load donations." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/donations — record one donation (optional amount)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is fine — a bare tick.
    }

    let amount: number | undefined;
    const rawAmount = body.amount;
    if (rawAmount !== undefined && rawAmount !== null && rawAmount !== "") {
      if (!isValidAmount(rawAmount, 1, 1_000_000)) {
        return NextResponse.json(
          {
            error:
              "Amount must be between 1 and 1000000 INR (max 2 decimal places).",
          },
          { status: 400 }
        );
      }
      amount = rawAmount as number;
    }

    const s = await getState();
    const next: DonationsState = {
      count: s.count + 1,
      totalAmount: Math.round((s.totalAmount + (amount ?? 0)) * 100) / 100,
    };
    await store.set(DONATIONS_KEY, next);

    return NextResponse.json(next, { status: 200 });
  } catch (err) {
    console.error("[donations:POST]", err);
    return NextResponse.json({ error: "Failed to record donation." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/donations — reset the tracker
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const reset: DonationsState = { count: 0, totalAmount: 0 };
    await store.set(DONATIONS_KEY, reset);
    return NextResponse.json(reset, { status: 200 });
  } catch (err) {
    console.error("[donations:DELETE]", err);
    return NextResponse.json({ error: "Failed to reset donations." }, { status: 500 });
  }
}
