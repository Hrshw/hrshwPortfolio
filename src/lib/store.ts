// ---------------------------------------------------------------------------
// Data store
//
// Production uses Upstash Redis (configured via KV_REST_API_URL / KV_REST_API_TOKEN
// or the legacy UPSTASH_* vars). When no Redis is configured — e.g. local dev —
// we fall back to an in-memory Map so the site and its APIs still work.
// The memory backend is NOT persistent: set the env vars in production.
// ---------------------------------------------------------------------------

import { Redis } from "@upstash/redis";

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const hasRedis = Boolean(redisUrl && redisToken);

const redis = hasRedis ? new Redis({ url: redisUrl, token: redisToken }) : null;

// ---------------------------------------------------------------------------
// In-memory fallback (dev only)
// ---------------------------------------------------------------------------
interface MemValue {
  value: unknown;
  expiresAt: number; // 0 = never expires
}

const mem = new Map<string, MemValue>();
const MEM_MAX_KEYS = 50_000;

function memNow() {
  return Date.now();
}

function memGet(key: string): unknown | undefined {
  const entry = mem.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt !== 0 && entry.expiresAt <= memNow()) {
    mem.delete(key);
    return undefined;
  }
  return entry.value;
}

function memSet(key: string, value: unknown, ttlSec = 0) {
  if (mem.size >= MEM_MAX_KEYS && !mem.has(key)) {
    // Drop expired keys first to make room.
    for (const [k, e] of mem) {
      if (e.expiresAt !== 0 && e.expiresAt <= memNow()) mem.delete(k);
    }
  }
  mem.set(key, {
    value,
    expiresAt: ttlSec > 0 ? memNow() + ttlSec * 1000 : 0,
  });
}

// ---------------------------------------------------------------------------
// Store API (shared surface)
// ---------------------------------------------------------------------------
export const store = {
  /** Prepend an item to a list. */
  async listPushFront(key: string, value: unknown): Promise<void> {
    if (redis) {
      await redis.lpush(key, value);
      return;
    }
    const list = (memGet(key) as unknown[] | undefined) ?? [];
    list.unshift(value);
    memSet(key, list);
  },

  /** Append an item to a list. */
  async listPushBack(key: string, value: unknown): Promise<void> {
    if (redis) {
      await redis.rpush(key, value);
      return;
    }
    const list = (memGet(key) as unknown[] | undefined) ?? [];
    list.push(value);
    memSet(key, list);
  },

  /** Return every item in a list (oldest → newest). */
  async listGetAll<T>(key: string): Promise<T[]> {
    if (redis) {
      return redis.lrange<T>(key, 0, -1);
    }
    return ((memGet(key) as unknown[] | undefined) ?? []) as T[];
  },

  /** Replace the entire contents of a list. */
  async listReplace<T>(key: string, values: T[]): Promise<void> {
    if (redis) {
      const p = redis.pipeline();
      p.del(key);
      if (values.length > 0) p.rpush(key, ...values);
      await p.exec();
      return;
    }
    memSet(key, values);
  },

  /**
   * Atomically increment a counter with a TTL (first call sets the TTL).
   * Used by rate limiters. Returns the value after increment.
   */
  async increment(key: string, ttlSec: number): Promise<number> {
    if (redis) {
      const value = await redis.incr(key);
      if (value === 1) await redis.expire(key, ttlSec);
      return value;
    }
    const now = memNow();
    const entry = mem.get(key);
    let count = 1;
    let expiresAt = now + ttlSec * 1000;
    if (entry && (entry.expiresAt === 0 || entry.expiresAt > now)) {
      count = (entry.value as number) + 1;
      expiresAt = entry.expiresAt;
    }
    mem.set(key, { value: count, expiresAt });
    return count;
  },

  async get<T>(key: string): Promise<T | null> {
    if (redis) {
      const v = await redis.get<T>(key);
      return v ?? null;
    }
    return (memGet(key) as T | undefined) ?? null;
  },

  async set(key: string, value: unknown, ttlSec = 0): Promise<void> {
    if (redis) {
      if (ttlSec > 0) await redis.set(key, value, { ex: ttlSec });
      else await redis.set(key, value);
      return;
    }
    memSet(key, value, ttlSec);
  },
};

export { redis };
