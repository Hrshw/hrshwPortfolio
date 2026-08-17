import { NextRequest, NextResponse } from "next/server";
import { getClientIp, hashIp, isValidAmount, rateLimit, sanitizeText } from "@/lib/security";
import { supportConfig } from "@/lib/support";

// ---------------------------------------------------------------------------
// POST /api/support/upi
//
// Builds a UPI deep-link (upi://pay) SERVER-SIDE so the payee address, name,
// and note prefix always come from the server environment and can never be
// tampered with by a visitor. Returns the URL to open in the device's UPI app.
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  if (!supportConfig.upiEnabled) {
    return NextResponse.json(
      { error: "Support via UPI is not configured." },
      { status: 503 }
    );
  }

  // --- Rate limit (per IP, generous — generating a link is harmless) ---
  const ipHash = hashIp(getClientIp(req));
  const rl = await rateLimit(`support-upi:${ipHash}`, 60, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 2048) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // --- Validate amount (strict: finite, in range, ≤ 2 decimals) ---
  const { minAmount, maxAmount } = supportConfig;
  if (!isValidAmount(body.amount, minAmount, maxAmount)) {
    return NextResponse.json(
      {
        error: `Amount must be between ${minAmount} and ${maxAmount} ${supportConfig.currency} (max 2 decimal places).`,
      },
      { status: 400 }
    );
  }
  const amount = body.amount as number;

  // --- Optional note (sanitized, truncated) ---
  const rawNote = typeof body.note === "string" ? body.note : "";
  const note = sanitizeText(rawNote, 40).replace(/[<>]/g, "");
  const tn = [supportConfig.refPrefix, note].filter(Boolean).join(" ").slice(0, 60);

  // --- Build intent URL ---
  const params = new URLSearchParams({
    pa: supportConfig.upiId,
    pn: supportConfig.upiName,
    am: amount.toFixed(2),
    cu: supportConfig.currency,
    tn,
  });

  return NextResponse.json(
    {
      url: `upi://pay?${params.toString()}`,
      amount,
      upiId: supportConfig.upiId,
      upiName: supportConfig.upiName,
      currency: supportConfig.currency,
    },
    { status: 200 }
  );
}
