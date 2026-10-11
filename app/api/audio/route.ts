import { z } from "zod";
import { isNarratable, narrate } from "@/lib/audio/elevenlabs";
import { fail, originAllowed, rateLimited, tooLarge } from "@/lib/http";

const body = z.object({ text: z.string().min(1).max(2500) });

export async function POST(req: Request) {
  if (!originAllowed(req)) return fail(403, "forbidden_origin", "Origin not allowed");
  if (tooLarge(req, 10_000)) return fail(413, "too_large", "Text too long");
  if (rateLimited(req, "audio", 30, 300)) return fail(429, "rate_limited", "Too many requests");

  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "invalid_request", "Expected { text }");
  if (!isNarratable(parsed.data.text)) return fail(422, "not_narratable", "Only the app's own content can be narrated");

  try {
    const mp3 = await narrate(parsed.data.text);
    return new Response(new Uint8Array(mp3), {
      headers: { "content-type": "audio/mpeg", "cache-control": "public, max-age=604800, immutable" },
    });
  } catch (err) {
    console.error("[audio]", err instanceof Error ? err.message : err);
    return fail(503, "audio_unavailable", "Narration unavailable");
  }
}
