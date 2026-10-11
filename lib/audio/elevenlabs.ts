import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { friends } from "@/lib/content/friends";
import { friendRules, listeningMission } from "@/lib/content/general";

// Every string the app may ask to narrate. Requests must be made only of these sentences,
// so the endpoint can't be used to spend credits on arbitrary text.
const corpus = [
  ...friends.flatMap((f) => [f.name, f.description, ...f.facts, f.mission.title, ...f.mission.steps, f.story.title, ...f.story.parts.map((p) => p.text), f.story.question]),
  listeningMission.title, ...listeningMission.steps, ...friendRules,
];

const norm = (s: string) => s.trim().replace(/\.$/, "");
const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).map(norm).filter(Boolean);
const allowed = new Set(corpus.flatMap(sentences));
export const isNarratable = (text: string) => text.length <= 2500 && sentences(text).every((s) => allowed.has(s));


const bundledDir = path.join(process.cwd(), "public", "audio");

export const audioKey = (text: string, voice: string) => createHash("sha256").update(`${voice}\n${text}`).digest("hex").slice(0, 24);

export function elevenlabsConfigured(env = process.env) {
  return Boolean(env.ELEVENLABS_API_KEY);
}

/** Returns MP3 bytes: from pre-generated files, then disk cache, then ElevenLabs. */
export async function narrate(text: string, env = process.env): Promise<Buffer> {
  const voice = env.ELEVENLABS_VOICE_ID || "EeQEodFZVtBkjtgK3HBc"; // chosen narrator voice
  const key = audioKey(text, voice);
  const cacheDir = env.AUDIO_CACHE_DIR || path.join(os.tmpdir(), "nbf-audio");
  for (const dir of [bundledDir, cacheDir]) {
    const hit = await readFile(path.join(dir, `${key}.mp3`)).catch(() => null);
    if (hit) return hit;
  }
  if (!env.ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY not set");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: "POST",
    signal: AbortSignal.timeout(30_000),
    headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
      voice_settings: { stability: 0.6, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs returned ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(cacheDir, { recursive: true }).then(() => writeFile(path.join(cacheDir, `${key}.mp3`), buf)).catch(() => {});
  return buf;
}
