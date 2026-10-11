import { describe, expect, it } from "vitest";
import { findUnsafe, isSafe } from "@/lib/safety/validate";
import { friends } from "@/lib/content/friends";

describe("safety validator", () => {
  it.each([
    "Gently pick up the ladybug and hold it.",
    "Try to catch the butterfly with a net.",
    "Chase the pigeons to see them fly.",
    "Dig up a worm to look at it.",
    "Feed the sparrow some bread.",
    "Look inside the nest to count the eggs.",
    "Keep it in a jar overnight.",
  ])("rejects %s", (t) => expect(isSafe(t)).toBe(false));

  it.each([
    "Don't touch it.",
    "Never chase a butterfly.",
    "Watch from two big steps away.",
    "Look without touching.",
    "Never go near a hive.",
  ])("allows %s", (t) => expect(isSafe(t)).toBe(true));

  it("finds the offending sentence", () => {
    expect(findUnsafe("Watch quietly. Then grab it.")).toBe("Then grab it.");
  });

  it("all curated missions and watching tips pass", () => {
    for (const f of friends) {
      for (const t of [...f.mission.steps, ...f.safeWatching, f.mission.ifNothingFound]) {
        expect(findUnsafe(t), `${f.slug}: ${t}`).toBeNull();
      }
    }
  });
});
