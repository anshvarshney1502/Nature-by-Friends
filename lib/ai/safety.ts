import { getFriend } from "@/lib/content/friends";
import { friendRules, listeningMission } from "@/lib/content/general";
import { isSafe } from "@/lib/safety/validate";
import { modelOutputSchema, type IdentifyResult, type ModelOutput } from "./schemas";

const RISKY = /\b(wasp|hornet|bee|spider|scorpion|snake|centipede|caterpillar|jellyfish|mushroom|fungus|toadstool|berr(y|ies)|nettle|ivy|tick|ant)s?\b/i;

export const stopMission = [
  "Stay where you are and don't go closer.",
  "Tell a trusted adult what you found.",
  "You can still watch from far away if they say it's okay.",
];

/** Pull the first JSON object out of model text (models sometimes wrap it in prose or code fences). */
export function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in model output");
  return JSON.parse(text.slice(start, end + 1));
}

/**
 * Never trust the model. Validate shape, then:
 * - only accept slugs we have curated content for
 * - downgrade "likely" without a name; flag risky names for adult help
 * - replace any unsafe mission or text with curated content
 * - safety guidance and facts always come from curated content
 */
export function sanitize(raw: unknown): IdentifyResult {
  const out: ModelOutput = modelOutputSchema.parse(raw);
  const friend = out.matchedSlug ? getFriend(out.matchedSlug) : undefined;
  const name = out.possibleIdentification?.trim() || null;

  let confidence = out.confidenceLabel;
  if (!name) confidence = "unsure";
  const needsAdultHelp = out.needsAdultHelp || confidence === "unsure" || (name !== null && RISKY.test(name));

  const missionOk = out.observationMission.every(isSafe);
  let mission = missionOk ? out.observationMission : (friend?.mission.steps ?? listeningMission.steps);
  if (needsAdultHelp && !friend) mission = stopMission;

  return {
    possibleIdentification: name,
    matchedSlug: friend?.slug ?? null,
    confidenceLabel: confidence,
    visibleEvidence: out.visibleEvidence.filter(isSafe),
    childFriendlyExplanation: isSafe(out.childFriendlyExplanation)
      ? out.childFriendlyExplanation
      : "Something interesting is in this photo! Let's watch it from a distance.",
    observationMission: mission,
    relatedLearning: friend ? friend.facts.slice(0, 2) : out.relatedLearning.filter(isSafe),
    needsAdultHelp,
    safetyGuidance: friend ? friend.dontDo : friendRules,
    missionReplaced: !missionOk || mission === stopMission,
  };
}

/** What we show when no model is configured or it failed: honest, never an identification. */
export function fallbackResult(): IdentifyResult {
  return {
    possibleIdentification: null,
    matchedSlug: null,
    confidenceLabel: "unsure",
    visibleEvidence: [],
    childFriendlyExplanation: "We can't look at photos right now, but you can still be a nature detective with your own eyes!",
    observationMission: listeningMission.steps,
    relatedLearning: [],
    needsAdultHelp: true,
    safetyGuidance: friendRules,
    missionReplaced: true,
  };
}
