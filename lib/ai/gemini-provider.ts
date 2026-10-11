import { ProviderError, type VisionProvider } from "./provider";

const BASE = "https://generativelanguage.googleapis.com/v1beta/openai";

/** Google Gemini API via its OpenAI-compatible endpoint. Needs only GEMINI_API_KEY (server-side). */
export function geminiFromEnv(env = process.env): VisionProvider | null {
  const key = env.GEMINI_API_KEY;
  if (!key) return null;
  const model = env.GEMINI_MODEL || "gemini-flash-latest";
  return {
    name: `gemini:${model}`,
    async describeImage({ system, text, imageDataUrl, signal }) {
      const res = await fetch(`${BASE}/chat/completions`, {
        method: "POST",
        signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 800,
          messages: [
            { role: "system", content: system },
            { role: "user", content: [{ type: "text", text }, { type: "image_url", image_url: { url: imageDataUrl } }] },
          ],
        }),
      });
      if (!res.ok) throw new ProviderError(`Gemini API returned ${res.status}`);
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new ProviderError("Gemini API returned no content");
      return content;
    },
  };
}
