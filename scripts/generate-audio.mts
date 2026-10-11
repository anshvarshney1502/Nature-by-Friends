// Pre-generates narration MP3s into public/audio so the demo doesn't spend ElevenLabs credits per visitor.
// Usage: ELEVENLABS_API_KEY=... [ELEVENLABS_VOICE_ID=...] npx tsx scripts/generate-audio.ts
// ~37 clips, roughly 12k characters in total: check your plan's remaining quota first.
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { friends } from "../lib/content/friends";
import { listeningMission } from "../lib/content/general";
import { missionText, profileText, storyText } from "../lib/content/narration";
import { audioKey, narrate } from "../lib/audio/elevenlabs";

const voice = process.env.ELEVENLABS_VOICE_ID || "EeQEodFZVtBkjtgK3HBc";
const out = path.join(process.cwd(), "public", "audio");
await mkdir(out, { recursive: true });
const texts = [missionText(listeningMission), ...friends.flatMap((f) => [profileText(f), missionText(f.mission), storyText(f)])];
let made = 0;
for (const t of texts) {
  const file = path.join(out, `${audioKey(t, voice)}.mp3`);
  if (await access(file).then(() => true, () => false)) continue;
  await writeFile(file, await narrate(t));
  made++;
  console.log(`✓ ${t.slice(0, 50)}…`);
}
console.log(`Done: ${made} new, ${texts.length - made} already present.`);
