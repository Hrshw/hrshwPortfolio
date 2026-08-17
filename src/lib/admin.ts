// ---------------------------------------------------------------------------
// Admin authentication for the moderation endpoints.
//
// Passcode lives only in the server environment (ADMIN_PASSCODE). It is
// compared in constant time and login attempts are rate-limited per IP to
// stop brute-force guessing. The admin UI keeps the passcode in memory only —
// it is never stored in cookies, localStorage, or logs.
// ---------------------------------------------------------------------------

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getClientIp, hashIp, rateLimit } from "./security";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "";

export const isAdminConfigured = ADMIN_PASSCODE.length > 0;

/**
 * Constant-time passcode check. Returns false whenever the passcode is
 * unset, malformed, or mismatched (same error either way — no oracle).
 */
function passcodeMatches(token: string): boolean {
  if (!ADMIN_PASSCODE) return false;
  try {
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(ADMIN_PASSCODE, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Extract the Bearer token from the Authorization header. */
function bearerToken(req: NextRequest): string {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return "";
  return auth.slice("Bearer ".length).trim();
}

/**
 * Authenticate an admin request AND throttle failed attempts per IP.
 * Returns the response to send when unauthorized.
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const token = bearerToken(req);
  const ipHash = hashIp(getClientIp(req));

  // Successful (correct-token) requests are never throttled — the limiter
  // only counts FAILED attempts, so a busy admin session can't lock itself out.
  if (!token || !passcodeMatches(token)) {
    const windowSec = 15 * 60;
    const rl = await rateLimit(`admin-login:${ipHash}`, 10, windowSec);
    if (!rl.allowed) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error:
              "Too many login attempts. Please wait a few minutes and try again.",
          },
          { status: 429 }
        ),
      };
    }
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true };
}

/** Shared admin list key helpers. */
export const ADMIN_KEYS = {
  feedbacks: "feedbacks",
  messages: "contact_messages",
} as const;
