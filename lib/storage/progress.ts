import { z } from "zod";

// Gentle, local-only progress: which friends you've met, which sounds you've learned, quiet minutes done.
// Stored in this browser only (never sent anywhere). No scores, streaks or rankings.
const schema = z.object({
  met: z.array(z.string()).default([]),
  sounds: z.array(z.string()).default([]),
  quietMinutes: z.number().int().nonnegative().default(0),
});
export type Progress = z.infer<typeof schema>;

const KEY = "nbf.progress.v1";
const EVENT = "nbf:progress";
const empty: Progress = { met: [], sounds: [], quietMinutes: 0 };

export function loadProgress(storage: Storage = localStorage): Progress {
  try {
    const r = schema.safeParse(JSON.parse(storage.getItem(KEY) ?? "null"));
    return r.success ? r.data : { ...empty };
  } catch {
    return { ...empty };
  }
}

function update(fn: (p: Progress) => Progress, storage: Storage = localStorage) {
  const next = fn(loadProgress(storage));
  try {
    storage.setItem(KEY, JSON.stringify(next));
    if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage full or blocked: progress is a nice-to-have */
  }
  return next;
}

const add = (xs: string[], x: string) => (xs.includes(x) ? xs : [...xs, x]);
export const markMet = (slug: string, s?: Storage) => update((p) => ({ ...p, met: add(p.met, slug) }), s);
export const markSound = (slug: string, s?: Storage) => update((p) => ({ ...p, sounds: add(p.sounds, slug) }), s);
export const addQuietMinute = (s?: Storage) => update((p) => ({ ...p, quietMinutes: p.quietMinutes + 1 }), s);
export const onProgress = (fn: () => void) => {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
};

/** Every key this app stores in the browser (used by "Delete all my data"). */
export const isAppKey = (k: string) => k.startsWith("nbf.");
