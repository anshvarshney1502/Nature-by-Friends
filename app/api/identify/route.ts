import { NextResponse } from "next/server";
import { geminiFromEnv } from "@/lib/ai/gemini-provider";
import { identifySystemPrompt, identifyUserText } from "@/lib/ai/prompts";
import { extractJson, fallbackResult, sanitize } from "@/lib/ai/safety";
import { identifyRequestSchema, type IdentifyResponse } from "@/lib/ai/schemas";
import { fail, originAllowed, rateLimited, tooLarge } from "@/lib/http";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!originAllowed(req)) return fail(403, "forbidden_origin", "Origin not allowed");
  if (tooLarge(req, 2_000_000)) return fail(413, "too_large", "Photo is too large");
  if (rateLimited(req, "identify", 10)) return fail(429, "rate_limited", "Too many requests, try again in a minute");

  const parsed = identifyRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, "invalid_request", parsed.error.issues[0]?.message ?? "Invalid request");

  const provider = geminiFromEnv();
  if (!provider) {
    return NextResponse.json<IdentifyResponse>({
      mode: "demo",
      result: fallbackResult(),
      notice: "No GEMINI_API_KEY is configured, so photos aren't analysed.",
    });
  }

  try {
    const text = await provider.describeImage({
      system: identifySystemPrompt(),
      text: identifyUserText,
      imageDataUrl: parsed.data.image,
      signal: AbortSignal.timeout(45_000),
    });
    const result = sanitize(extractJson(text));
    return NextResponse.json<IdentifyResponse>({
      mode: "live",
      result,
      notice: result.missionReplaced ? "We swapped in one of our own safe missions." : undefined,
    });
  } catch (err) {
    console.error("[identify]", provider.name, err instanceof Error ? err.message : err);
    return NextResponse.json<IdentifyResponse>({ mode: "fallback", result: fallbackResult() });
  }
}
