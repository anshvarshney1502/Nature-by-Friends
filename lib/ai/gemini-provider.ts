import { ProviderError, type VisionProvider } from "./provider";

const BASE = "https://generativelanguage.googleapis.com/v1beta/openai";

/**
 * Google Gemini API via its OpenAI-compatible endpoint. Needs only GEMINI_API_KEY (server-side).
 * Gemma 4 (open weights) is tried first; if it errors (its hosted version returned intermittent 500s
 * in testing), the same request is retried once on a Gemini Flash model.
 */
export function geminiFromEnv(env = process.env): VisionProvider | null {
  const key = env.GEMINI_API_KEY;
  if (!key) return null;
  const models = [env.GEMINI_MODEL || "gemma-4-26b-a4b-it", env.GEMINI_FALLBACK_MODEL || "gemini-flash-latest"];

  async function call(model: string, body: object, signal?: AbortSignal) {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, temperature: 0.2, max_tokens: 800, ...body }),
    });
    if (!res.ok) throw new ProviderError(`${model} returned ${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new ProviderError(`${model} returned no content`);
    return content;
  }

  return {
    name: `gemini:${models.join(">")}`,
    async describeImage({ system, text, imageDataUrl, signal }) {
      const body = {
        messages: [
          { role: "system", content: system },
          { role: "user", content: [{ type: "text", text }, { type: "image_url", image_url: { url: imageDataUrl } }] },
        ],
      };
      try {
        return await call(models[0], body, signal);
      } catch (err) {
        if (signal?.aborted || models[1] === models[0]) throw err;
        console.warn("[identify] primary model failed, trying fallback:", err instanceof Error ? err.message : err);
        return call(models[1], body, signal);
      }
    },
  };
}
