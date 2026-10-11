import { afterEach, describe, expect, it, vi } from "vitest";
import { friendSchema, getProfiles } from "@/lib/db/content";
import { friends } from "@/lib/content/friends";

describe("content source", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("bundled profiles match the schema used for MongoDB documents", () => {
    for (const f of friends) expect(friendSchema.safeParse(f).success, f.slug).toBe(true);
  });

  it("uses bundled content when MONGODB_URI is unset", async () => {
    vi.stubEnv("MONGODB_URI", "");
    expect((await getProfiles()).source).toBe("bundled");
  });

  it("falls back to bundled content when the database is unreachable", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb://127.0.0.1:1/?directConnection=true");
    const r = await getProfiles();
    expect(r.source).toBe("bundled");
    expect(r.friends).toHaveLength(12);
  }, 10_000);

  it("every related slug points at a real profile", () => {
    const slugs = new Set(friends.map((f) => f.slug));
    for (const f of friends) for (const r of f.related) expect(slugs.has(r), `${f.slug} -> ${r}`).toBe(true);
  });
});
