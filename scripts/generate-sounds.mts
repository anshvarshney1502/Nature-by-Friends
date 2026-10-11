// Generates the ambient nature loops into public/sounds with the ElevenLabs Sound Effects API.
// Usage: npm run sounds:generate   (reads ELEVENLABS_API_KEY from .env.local; skips files that exist)
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scenes } from "../lib/content/soundscapes";

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("Set ELEVENLABS_API_KEY");
const out = path.join(process.cwd(), "public", "sounds");
await mkdir(out, { recursive: true });

for (const s of scenes) {
  const file = path.join(out, `${s.id}.mp3`);
  if (await access(file).then(() => true, () => false)) { console.log(`= ${s.id} exists`); continue; }
  const res = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({ text: s.prompt, duration_seconds: 22, prompt_influence: 0.45, loop: true }),
  });
  if (!res.ok) throw new Error(`${s.id}: ElevenLabs returned ${res.status} ${await res.text()}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${s.id}`);
}
