import { describe, expect, it } from "vitest";
import { addEntry, deleteEntry, loadEntries } from "@/lib/storage/journal";

class MemStorage {
  data = new Map<string, string>();
  full = false;
  getItem = (k: string) => this.data.get(k) ?? null;
  setItem = (k: string, v: string) => {
    if (this.full) throw new DOMException("quota", "QuotaExceededError");
    this.data.set(k, v);
  };
}
const mk = () => new MemStorage() as unknown as Storage & MemStorage;
const base = { date: "2026-10-11", friendSlug: "snail", title: "Snail", spot: "", noticed: "slime", surprised: "", learned: "", foundIt: true };

describe("journal storage", () => {
  it("persists across loads", () => {
    const s = mk();
    addEntry(base, s);
    addEntry({ ...base, date: "2026-10-12" }, s);
    const got = loadEntries(s);
    expect(got).toHaveLength(2);
    expect(got[0].date).toBe("2026-10-12");
  });

  it("deletes", () => {
    const s = mk();
    const e = addEntry(base, s)!;
    deleteEntry(e.id, s);
    expect(loadEntries(s)).toHaveLength(0);
  });

  it("survives corrupt data", () => {
    const s = mk();
    s.setItem("nbf.journal.v1", "{not json");
    expect(loadEntries(s)).toEqual([]);
  });

  it("reports quota failure instead of losing silently", () => {
    const s = mk();
    s.full = true;
    expect(addEntry(base, s)).toBeNull();
  });
});
