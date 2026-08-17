// ---------------------------------------------------------------------------
// Shared security / validation helpers used by all public API routes.
// ---------------------------------------------------------------------------

import crypto from "crypto";
import { store } from "./store";

// ---------------------------------------------------------------------------
// IP handling
// ---------------------------------------------------------------------------

/**
 * Extract the client IP from request headers.
 * `x-forwarded-for` is trusted only when the deployment sits behind a proxy
 * (Vercel, Cloudflare, etc.) and we always take the FIRST entry, which the
 * proxy appends. Unparseable values fall back to "unknown".
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first && /^[\w:.\[\]-]+$/.test(first)) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp && /^[\w:.\[\]-]+$/.test(realIp)) return realIp;
  return "unknown";
}

const IP_SALT = process.env.RATE_LIMIT_SALT || "portfolio-default-salt";

/** Salted, truncated hash of an IP so we never store raw addresses. */
export function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + IP_SALT)
    .digest("hex")
    .slice(0, 16);
}

// ---------------------------------------------------------------------------
// Text sanitization (Unicode-safe)
// ---------------------------------------------------------------------------

/**
 * Strip HTML, control characters, and zero-width characters while keeping
 * real text (including non-Latin scripts and emoji) intact. Then cap length.
 */
export function sanitizeText(input: string, maxLen: number): string {
  return input
    .replace(/<[^>]*>/g, "") // HTML tags (naive but sufficient — output is never rendered as HTML)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // control chars (keeps \t \n \r)
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width spaces / BOM
    .trim()
    .slice(0, maxLen);
}

// ---------------------------------------------------------------------------
// Field validation
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (email.length < 3 || email.length > 254) return false;
  if (!EMAIL_RE.test(email)) return false;
  // Reject double dots / leading/trailing dots in the domain portion.
  const domain = email.split("@")[1];
  if (!domain || domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return false;
  }
  return true;
}

/**
 * LinkedIn profile URL validation — parses the URL and requires the hostname
 * to be linkedin.com (or a subdomain) and the path to start with /in/.
 * A plain prefix check is not enough: "https://www.linkedin.com/evil.com" must fail.
 */
export function isValidLinkedInUrl(raw: string): boolean {
  if (raw.length > 200) return false;
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    const isLinkedInHost = host === "linkedin.com" || host.endsWith(".linkedin.com");
    if (!isLinkedInHost) return false;
    const path = u.pathname;
    return path === "/in/" || /^\/in\/[^/]+/.test(path);
  } catch {
    return false;
  }
}

/**
 * Validate a donation amount: a positive number within [min, max] with at most
 * two decimal places.
 */
export function isValidAmount(value: unknown, min: number, max: number): value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) return false;
  if (value < min || value > max) return false;
  const cents = Math.round(value * 100);
  if (Math.abs(cents - value * 100) > 1e-6) return false; // > 2 decimal places
  return true;
}

// ---------------------------------------------------------------------------
// Spam protection
// ---------------------------------------------------------------------------

/** A filled honeypot means a bot. Callers should fake-success and drop it. */
export function isHoneypotFilled(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0;
}

/**
 * Minimal "time trap": humans take a couple of seconds to fill a form.
 * Bots submit instantly. Reject submissions faster than minMs.
 */
export function isTooFast(startedAt: unknown, minMs = 2000): boolean {
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) return true;
  return Date.now() - startedAt < minMs;
}

// ---------------------------------------------------------------------------
// Rate limiting (Redis in prod, in-memory in dev)
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
}

/**
 * Fixed-window rate limiter keyed by `key`. Allows `limit` requests per
 * `windowSec`. Fails OPEN on storage errors so a Redis outage never takes
 * down the site — the persistence layer below still guards writes.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  try {
    const count = await store.increment(`ratelimit:${key}`, windowSec);
    if (count > limit) {
      return { allowed: false, remaining: 0, retryAfterSec: windowSec };
    }
    return { allowed: true, remaining: Math.max(0, limit - count) };
  } catch (err) {
    console.error("[rateLimit]", err);
    return { allowed: true, remaining: limit };
  }
}

/** Daily global circuit breaker shared across every visitor. */
export async function globalDailyCap(cap: number, scope: string): Promise<RateLimitResult> {
  const day = new Date().toISOString().slice(0, 10);
  return rateLimit(`global:${scope}:${day}`, cap, 86400);
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export function uuid(): string {
  return crypto.randomUUID();
}

export function jsonHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...extra,
  };
}
