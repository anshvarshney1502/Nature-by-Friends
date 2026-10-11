import { NextResponse } from "next/server";

// shortcut: in-memory per-instance limiter; resets on restart and isn't shared across instances. Use Redis/KV if scaled out.
const hits = new Map<string, { n: number; reset: number }>();

export function rateLimited(req: Request, bucket: string, max = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 20, windowMs = 60_000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  return ++h.n > max;
}

/** Same-origin requests have no Origin or a matching one; others must be listed in ALLOWED_ORIGINS. */
export function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  if (origin === new URL(req.url).origin) return true;
  const allowed = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

export const fail = (status: number, code: string, message: string) => NextResponse.json({ error: { code, message } }, { status });

export function tooLarge(req: Request, maxBytes: number) {
  const len = Number(req.headers.get("content-length") ?? 0);
  return len > maxBytes;
}
