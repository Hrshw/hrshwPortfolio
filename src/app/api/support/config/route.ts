import { NextResponse } from "next/server";
import { supportConfig } from "@/lib/support";

// ---------------------------------------------------------------------------
// GET /api/support/config
//
// Public, read-only view of the support configuration so the client can render
// the section. Only the UPI ID + amounts are exposed — the payee is public by
// nature (it's printed on payment apps) and the actual payment URL is still
// generated server-side on POST /api/support/upi, so visitors can never
// re-point a payment.
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json(supportConfig, {
    status: 200,
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}
