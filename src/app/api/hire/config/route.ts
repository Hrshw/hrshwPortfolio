import { NextResponse } from "next/server";
import { isEmailConfigured } from "@/lib/email";

// ---------------------------------------------------------------------------
// GET /api/hire/config — flags consumed by the admin panel (e.g. "email not
// configured" warning). No sensitive data.
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json(
    { emailConfigured: isEmailConfigured() },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
