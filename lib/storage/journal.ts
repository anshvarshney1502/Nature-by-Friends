import { z } from "zod";

export const entrySchema = z.object({
  id: z.string(),
  date: z.string(), // YYYY-MM-DD, no time or location
  friendSlug: z.string().nullable(),
  title: z.string().max(80),
  spot: z.string().max(60).default(""), // child's own nickname for a place, e.g. "the big tree"
  noticed: z.string().max(600).default(""),
  surprised: z.string().max(600).default(""),
  learned: z.string().max(600).default(""),
  foundIt: z.boolean().default(true),
  photo: z.string().optional(), // downscaled data URL, device only
  revisitOf: z.string().optional(),
  changed: z.string().max(600).optional(),
  same: z.string().max(600).optional(),
  revisitOn: z.string().optional(), // opt-in reminder date
});
export type Entry = z.infer<typeof entrySchema>;

const KEY = "nbf.journal.v1";

export function loadEntries(storage: Storage = localStorage): Entry[] {
  try {
    const parsed = z.array(entrySchema).safeParse(JSON.parse(storage.getItem(KEY) ?? "[]"));
    return parsed.success ? parsed.data.sort((a, b) => b.date.localeCompare(a.date)) : [];
  } catch {
    return [];
  }
}

/** Returns false if the browser refused to save (e.g. storage full). */
export function saveEntries(entries: Entry[], storage: Storage = localStorage): boolean {
  try {
    storage.setItem(KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function addEntry(entry: Omit<Entry, "id">, storage: Storage = localStorage) {
  const full = entrySchema.parse({ ...entry, id: crypto.randomUUID() });
  const ok = saveEntries([full, ...loadEntries(storage)], storage);
  return ok ? full : null;
}

export function deleteEntry(id: string, storage: Storage = localStorage) {
  return saveEntries(loadEntries(storage).filter((e) => e.id !== id), storage);
}

export const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
export const daysFromToday = (n: number) => new Date(Date.now() + n * 864e5).toLocaleDateString("en-CA");
