import { afterEach, describe, expect, it, vi } from "vitest";
import { friendSchema, getProfiles } from "@/lib/db/content";
import { friends } from "@/lib/content/friends";
import { creatureSlugs } from "@/components/illustrations/Creature";
import { webLinks, webNodes } from "@/lib/content/web";
import { quietMinuteParts } from "@/lib/content/creatureSounds";
import { existsSync } from "node:fs";
import { tourSlides } from "@/lib/content/tour";

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
    expect(r.friends).toHaveLength(friends.length);
  }, 10_000);

  it("every related slug points at a real profile", () => {
    const slugs = new Set(friends.map((f) => f.slug));
    for (const f of friends) for (const r of f.related) expect(slugs.has(r), `${f.slug} -> ${r}`).toBe(true);
  });

  it("every friend has its own illustration", () => {
    for (const f of friends) expect(creatureSlugs, f.slug).toContain(f.slug);
  });

  it("friendship web: every link joins real nodes and every friend is in the web", () => {
    const ids = new Set(webNodes.map((n) => n.id));
    for (const l of webLinks) expect(ids.has(l.from) && ids.has(l.to), `${l.from}-${l.to}`).toBe(true);
    for (const f of friends) expect(webNodes.some((n) => n.slug === f.slug), f.slug).toBe(true);
    for (const n of webNodes) expect(webLinks.some((l) => l.from === n.id || l.to === n.id), `${n.id} has no links`).toBe(true);
  });

  it("every pre-generated sound file exists", () => {
    for (let i = 1; i <= quietMinuteParts.length; i++) expect(existsSync(`public/audio/quiet/${i}.mp3`), `quiet ${i}`).toBe(true);
    for (const f of friends) expect(existsSync(`public/sounds/creatures/${f.slug}.mp3`), f.slug).toBe(true);
  });

  it("tour: every slide has narration, real characters and a real page", () => {
    const pages = new Set(["/garden", "/missions", "/listen", "/journal", "/ecosystem", "/stories", "/parents"]);
    for (const t of tourSlides) {
      expect(existsSync(`public/audio/tour/${t.id}.mp3`), t.id).toBe(true);
      for (const c of t.creatures) expect(creatureSlugs, `${t.id}: ${c}`).toContain(c);
      if (t.href) expect(pages.has(t.href), t.href).toBe(true);
      expect(existsSync(`app${t.href ?? ""}/page.tsx`), `page for ${t.href}`).toBe(true);
    }
  });
});
