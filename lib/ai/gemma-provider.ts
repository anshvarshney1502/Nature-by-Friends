import { ProviderError, type VisionProvider } from "./provider";

/**
 * Gemma via any OpenAI-compatible /chat/completions endpoint:
 * Ollama (http://localhost:11434/v1), vLLM, LM Studio, or a hosted Gemma endpoint.
 * Default model gemma4:e4b — the small Gemma 4 variant that accepts image input.
 */
export function gemmaFromEnv(env = process.env): VisionProvider | null {
  const base = env.GEMMA_API_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  const model = env.GEMMA_MODEL || "gemma4:e4b";
  const key = env.GEMMA_API_KEY;
  return {
    name: `gemma:${model}`,
    async describeImage({ system, text, imageDataUrl, signal }) {
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        signal,
        headers: { "content-type": "application/json", ...(key ? { authorization: `Bearer ${key}` } : {}) },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 600,
          messages: [
            { role: "system", content: system },
            { role: "user", content: [{ type: "text", text }, { type: "image_url", image_url: { url: imageDataUrl } }] },
          ],
        }),
      });
      if (!res.ok) throw new ProviderError(`Gemma endpoint returned ${res.status}`);
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new ProviderError("Gemma endpoint returned no content");
      return content;
    },
  };
}
