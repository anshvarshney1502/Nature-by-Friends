import { describe, expect, it, vi } from "vitest";
import { claimVoice, releaseVoice } from "@/lib/audio/voiceChannel";

describe("voice channel (no overlapping voices)", () => {
  it("starting a new voice stops the previous one", () => {
    const a = vi.fn(), b = vi.fn();
    claimVoice(a);
    claimVoice(b);
    expect(a).toHaveBeenCalledOnce();
    expect(b).not.toHaveBeenCalled();
  });
  it("re-claiming with the same voice doesn't stop itself", () => {
    const a = vi.fn();
    claimVoice(a); claimVoice(a);
    expect(a).not.toHaveBeenCalled();
  });
  it("a released voice isn't stopped later", () => {
    const a = vi.fn(), b = vi.fn();
    claimVoice(a); releaseVoice(a); claimVoice(b);
    expect(a).not.toHaveBeenCalled();
  });
});
