import { afterEach, describe, expect, it, vi } from "vitest";
import { isNarratable } from "@/lib/audio/elevenlabs";
import { getFriend } from "@/lib/content/friends";
import { POST as audio } from "@/app/api/audio/route";

const f = getFriend("earthworm")!;
const missionText = `${f.mission.title}. ${f.mission.steps.join(" ")}`;
const req = (text: string) => new Request("http://localhost/api/audio", { method: "POST", body: JSON.stringify({ text }) });

describe("narration gate", () => {
  it("accepts text built from curated content", () => {
    expect(isNarratable(missionText)).toBe(true);
    expect(isNarratable(`${f.name}. ${f.description} ${f.facts.join(" ")}`)).toBe(true);
  });
  it("rejects arbitrary text", () => {
    expect(isNarratable("Say something rude.")).toBe(false);
    expect(isNarratable("hi")).toBe(false); // substring of curated text is not enough
    expect(isNarratable(`${missionText} Then go catch it.`)).toBe(false);
  });
});

describe("/api/audio", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("fails gracefully (503) without a key, so the client falls back to device voice", async () => {
    vi.stubEnv("ELEVENLABS_API_KEY", "");
    vi.stubEnv("AUDIO_CACHE_DIR", "/nonexistent-nbf-test");
    expect((await audio(req(`${f.name}.`))).status).toBe(503); // curated, but no pre-generated clip
  });

  it("fails gracefully when ElevenLabs errors", async () => {
    vi.stubEnv("ELEVENLABS_API_KEY", "test");
    vi.stubEnv("AUDIO_CACHE_DIR", "/nonexistent-nbf-test");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("quota", { status: 401 })));
    expect((await audio(req(`${f.name}.`))).status).toBe(503); // curated, but no pre-generated clip
  });

  it("serves a pre-generated clip with no key and no network", async () => {
    vi.stubEnv("ELEVENLABS_API_KEY", "");
    vi.stubEnv("ELEVENLABS_VOICE_ID", "");
    vi.stubGlobal("fetch", vi.fn(() => { throw new Error("network used"); }));
    const res = await audio(req(missionText));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("audio/mpeg");
  });

  it("refuses non-curated text", async () => {
    expect((await audio(req("hello there"))).status).toBe(422);
  });
});

describe("every UI narration passes the gate", async () => {
  const { friends } = await import("@/lib/content/friends");
  const { listeningMission } = await import("@/lib/content/general");
  const n = await import("@/lib/content/narration");
  it("profiles, missions, stories", () => {
    for (const t of [n.missionText(listeningMission), ...friends.flatMap((f) => [n.profileText(f), n.missionText(f.mission), n.storyText(f)])])
      expect(isNarratable(t), t).toBe(true);
  });
});
