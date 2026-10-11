// Generates every pre-made ElevenLabs sound into public/: ambient loops, creature sounds,
// Sound Safari narration and the Quiet Minute. Skips files that already exist, so re-running is free.
// Usage: npm run sounds:generate   (reads ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID from .env.local)
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scenes } from "../lib/content/soundscapes";
import { tourSlides } from "../lib/content/tour";
import { creatureSounds, quietMinuteParts, safariIntro, safariRounds } from "../lib/content/creatureSounds";

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("Set ELEVENLABS_API_KEY");
const voice = process.env.ELEVENLABS_VOICE_ID || "EeQEodFZVtBkjtgK3HBc";
const pub = path.join(process.cwd(), "public");

async function make(rel: string, request: () => Promise<Response>) {
  const file = path.join(pub, rel);
  if (await access(file).then(() => true, () => false)) return console.log(`= ${rel}`);
  await mkdir(path.dirname(file), { recursive: true });
  const res = await request();
  if (!res.ok) throw new Error(`${rel}: ElevenLabs returned ${res.status} ${await res.text()}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${rel}`);
}

const sfx = (text: string, seconds: number, loop: boolean) => () =>
  fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({ text, duration_seconds: seconds, prompt_influence: 0.5, loop }),
  });

const speak = (text: string) => () =>
  fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.6, similarity_boost: 0.75 } }),
  });

for (const s of scenes) await make(`sounds/${s.id}.mp3`, sfx(s.prompt, 22, true));
for (const [slug, s] of Object.entries(creatureSounds)) await make(`sounds/creatures/${slug}.mp3`, sfx(s.prompt, s.kind === "call" ? 5 : 8, false));
await make("audio/safari/intro.mp3", speak(safariIntro));
for (const r of safariRounds) await make(`audio/safari/${r.slug}.mp3`, speak(r.reveal));
for (const [i, p] of quietMinuteParts.entries()) await make(`audio/quiet/${i + 1}.mp3`, speak(p.text));
for (const t of tourSlides) await make(`audio/tour/${t.id}.mp3`, speak(t.voice));
