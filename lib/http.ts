import { NextResponse } from "next/server";

// shortcut: in-memory per-instance limiter; resets on restart and isn't shared across instances. Use Redis/KV if scaled out.
const hits = new Map<string, { n: number; reset: number }>();

/**
 * Client IP that the visitor cannot fake. Render sits behind Cloudflare, which sets CF-Connecting-IP and
 * rejects requests that try to supply it (verified live). Vercel overwrites x-real-ip. X-Forwarded-For's
 * first entry is attacker-controlled, so it is only used for local development.
 */
export function clientIp(req: Request, env: Record<string, string | undefined> = process.env) {
  const h = (k: string) => req.headers.get(k)?.trim() || null;
  if (env.RENDER) return h("cf-connecting-ip") ?? h("true-client-ip") ?? "unknown";
  if (env.VERCEL) return h("x-real-ip") ?? "unknown";
  return h("x-forwarded-for")?.split(",")[0].trim() || "local";
}

function hit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  return ++h.n > max;
}

/** Per-IP limit, plus an optional cap across all visitors so rotating IPs can't drain a paid quota. */
export function rateLimited(req: Request, bucket: string, max = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 20, globalMax?: number, windowMs = 60_000) {
  if (globalMax && hit(`${bucket}:*`, globalMax, windowMs)) return true;
  return hit(`${bucket}:${clientIp(req)}`, max, windowMs);
}

/**
 * Browsers always send Origin on POST, so a POST without one is a script, not our page: reject it.
 * Origins must match this site's public host or be listed in ALLOWED_ORIGINS.
 */
export function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return req.method === "GET" || req.method === "HEAD";
  // Behind a proxy (Render/Vercel) req.url is the internal address, so compare against the public host header.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  try {
    if (new URL(origin).host === host) return true;
  } catch {
    return false;
  }
  const allowed = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

export const fail = (status: number, code: string, message: string) => NextResponse.json({ error: { code, message } }, { status });

export function tooLarge(req: Request, maxBytes: number) {
  const len = Number(req.headers.get("content-length") ?? 0);
  return len > maxBytes;
}
