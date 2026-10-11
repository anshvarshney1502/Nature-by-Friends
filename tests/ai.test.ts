import { afterEach, describe, expect, it, vi } from "vitest";
import { extractJson, sanitize, stopMission } from "@/lib/ai/safety";
import { getFriend } from "@/lib/content/friends";
import { POST as identify } from "@/app/api/identify/route";

const good = {
  possibleIdentification: "Garden snail",
  matchedSlug: "snail",
  confidenceLabel: "likely",
  visibleEvidence: ["spiral shell", "eye stalks"],
  childFriendlyExplanation: "A snail is gliding on a wet wall.",
  observationMission: ["Watch its eye stalks from a step away.", "Look for its shiny trail."],
  relatedLearning: ["Why might snails like rain?"],
  needsAdultHelp: false,
};

describe("sanitize model output", () => {
  it("keeps a safe, well-formed answer", () => {
    const r = sanitize(good);
    expect(r.matchedSlug).toBe("snail");
    expect(r.missionReplaced).toBe(false);
    expect(r.safetyGuidance).toEqual(getFriend("snail")!.dontDo); // safety always curated
  });

  it("replaces unsafe handling instructions with the curated mission", () => {
    const r = sanitize({ ...good, observationMission: ["Pick up the snail and hold it on your hand."] });
    expect(r.missionReplaced).toBe(true);
    expect(r.observationMission).toEqual(getFriend("snail")!.mission.steps);
  });

  it("never shows a confident ID without a name", () => {
    const r = sanitize({ ...good, possibleIdentification: null, matchedSlug: null });
    expect(r.confidenceLabel).toBe("unsure");
    expect(r.needsAdultHelp).toBe(true);
  });

  it("ignores slugs we have no curated content for", () => {
    expect(sanitize({ ...good, matchedSlug: "tiger" }).matchedSlug).toBeNull();
  });

  it("flags risky creatures and switches to the stop mission when uncurated", () => {
    const r = sanitize({ ...good, possibleIdentification: "Wasp", matchedSlug: null, confidenceLabel: "maybe" });
    expect(r.needsAdultHelp).toBe(true);
    expect(r.observationMission).toEqual(stopMission);
  });

  it("rejects malformed output", () => {
    expect(() => sanitize({ hello: "world" })).toThrow();
  });

  it("extracts JSON wrapped in prose / code fences", () => {
    expect(extractJson('Sure!\n```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });
});

const img = "data:image/jpeg;base64,AAAA";
const req = (body: unknown) => new Request("http://localhost/api/identify", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });

describe("/api/identify", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("rejects non-image input", async () => {
    expect((await identify(req({ image: "hello" }))).status).toBe(400);
  });

  it("is honest about demo mode when no model is configured", async () => {
    vi.stubEnv("GEMMA_API_BASE_URL", "");
    const body = await (await identify(req({ image: img }))).json();
    expect(body.mode).toBe("demo");
    expect(body.result.possibleIdentification).toBeNull();
  });

  it("returns a safe fallback when the model errors", async () => {
    vi.stubEnv("GEMMA_API_BASE_URL", "http://model.test/v1");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("boom", { status: 500 })));
    const res = await identify(req({ image: img }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.mode).toBe("fallback");
    expect(JSON.stringify(body)).not.toContain("boom");
  });

  it("returns sanitized live output (mocked model)", async () => {
    vi.stubEnv("GEMMA_API_BASE_URL", "http://model.test/v1");
    const fetchMock = vi.fn(async () => Response.json({ choices: [{ message: { content: JSON.stringify({ ...good, observationMission: ["Catch it in a jar."] }) } }] }));
    vi.stubGlobal("fetch", fetchMock);
    const body = await (await identify(req({ image: img }))).json();
    expect(body.mode).toBe("live");
    expect(body.result.missionReplaced).toBe(true);
    const sent = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(sent.model).toBe("gemma4:e4b");
  });
});
