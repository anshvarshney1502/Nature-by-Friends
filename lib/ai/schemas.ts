import { z } from "zod";

export const confidenceLabels = ["likely", "maybe", "unsure"] as const;

/** What we ask the model for. Safety advice is deliberately NOT requested: it always comes from curated content. */
export const modelOutputSchema = z.object({
  possibleIdentification: z.string().max(80).nullable(),
  matchedSlug: z.string().max(40).nullable(),
  confidenceLabel: z.enum(confidenceLabels),
  visibleEvidence: z.array(z.string().max(160)).max(4),
  childFriendlyExplanation: z.string().max(400),
  observationMission: z.array(z.string().max(160)).min(1).max(4),
  relatedLearning: z.array(z.string().max(160)).max(3).default([]),
  needsAdultHelp: z.boolean(),
});
export type ModelOutput = z.infer<typeof modelOutputSchema>;

export type IdentifyResult = ModelOutput & { safetyGuidance: string[]; missionReplaced: boolean };
export type IdentifyResponse = { mode: "live" | "demo" | "fallback"; result: IdentifyResult; notice?: string };

export const identifyRequestSchema = z.object({
  image: z
    .string()
    .regex(/^data:image\/(jpeg|png|webp);base64,/, "Must be a JPEG, PNG or WebP data URL")
    .max(1_500_000, "Image too large"),
});
