// Ambient loops generated once with the ElevenLabs Sound Effects API (scripts/generate-sounds.mts).
export type SceneId = "meadow" | "rain" | "evening";

export const scenes: { id: SceneId; label: string; prompt: string }[] = [
  { id: "meadow", label: "Sunny meadow", prompt: "Peaceful sunny garden ambience: soft distant songbirds, gentle breeze through leaves, calm and quiet, no people, no music" },
  { id: "rain", label: "Rain on soil", prompt: "Gentle light rain falling on soil and leaves in a garden, soft and calm, occasional water drip, no thunder, no music" },
  { id: "evening", label: "Evening crickets", prompt: "Calm evening garden ambience: soft crickets chirping, faint warm breeze, very peaceful, no people, no music" },
];

/** Default scene for a page, used until the visitor picks one. */
export function sceneForPath(path: string): SceneId {
  if (path.startsWith("/stories")) return "evening";
  if (path.startsWith("/ecosystem") || /^\/friends\/(earthworm|snail|ant)\b/.test(path)) return "rain";
  return "meadow";
}
