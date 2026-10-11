import type { Friend } from "./types";

// Exact texts the UI asks to narrate. Shared with scripts/generate-audio.ts so pre-generated files match.
type Mission = { title: string; steps: string[] };
export const profileText = (f: Friend) => `${f.name}. ${f.description} ${f.facts.join(" ")}`;
export const missionText = (m: Mission) => `${m.title}. ${m.steps.join(" ")}`;
export const storyText = (f: Friend) => `${f.story.title}. ${f.story.parts.map((p) => p.text).join(" ")} ${f.story.question}`;
