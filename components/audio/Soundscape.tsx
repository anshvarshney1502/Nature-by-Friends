"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { scenes, sceneForPath, type SceneId } from "@/lib/content/soundscapes";

const KEY = "nbf.soundscape.v1";
type Prefs = { on: boolean; scene: SceneId | null; volume: number };

/**
 * Ambient nature loops (ElevenLabs Sound Effects). On by default; browsers only allow sound after
 * the first tap or key press, so playback starts then. The header button turns it off (remembered).
 * Fades between scenes and ducks under the narrator (AudioPlayer sends "nbf:narration").
 */
export function Soundscape() {
  const path = usePathname();
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number | null>(null);
  const [prefs, setPrefs] = useState<Prefs>({ on: true, scene: null, volume: 0.8 });
  const [ducked, setDucked] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const scene = prefs.scene ?? sceneForPath(path);

  const [unlocked, setUnlocked] = useState(false);

  // Restore saved choices (including "off").
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<Prefs> | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage once on mount
      if (saved) setPrefs((p) => ({ on: saved.on ?? p.on, scene: saved.scene ?? null, volume: saved.volume ?? p.volume }));
    } catch {
      /* storage unavailable: defaults are fine */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  // Browsers block sound until the visitor interacts; start on the first tap/key anywhere.
  useEffect(() => {
    if (unlocked) return;
    // Taps on the sound control itself are handled by its own buttons (e.g. turning it off).
    const go = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-soundscape]")) return;
      setUnlocked(true);
    };
    window.addEventListener("pointerdown", go);
    window.addEventListener("keydown", go);
    return () => { window.removeEventListener("pointerdown", go); window.removeEventListener("keydown", go); };
  }, [unlocked]);

  useEffect(() => {
    const onNarration = (e: Event) => setDucked((e as CustomEvent<boolean>).detail);
    window.addEventListener("nbf:narration", onNarration);
    return () => window.removeEventListener("nbf:narration", onNarration);
  }, []);

  function fadeTo(target: number, then?: () => void) {
    const a = audio.current;
    if (!a) return;
    if (fade.current) cancelAnimationFrame(fade.current);
    const start = a.volume, t0 = performance.now(), ms = 700;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      a.volume = Math.min(1, Math.max(0, start + (target - start) * k)); // float drift can exceed [0, 1]
      if (k < 1) fade.current = requestAnimationFrame(step);
      else then?.();
    };
    fade.current = requestAnimationFrame(step);
  }

  // Start, stop or switch scene.
  useEffect(() => {
    const src = `/sounds/${scene}.mp3`;
    if (!prefs.on) {
      fadeTo(0, () => audio.current?.pause());
      return;
    }
    if (!unlocked) return;
    const swap = () => {
      audio.current ??= Object.assign(new Audio(), { loop: true, volume: 0, preload: "auto" });
      const a = audio.current;
      if (!a.src.endsWith(src)) a.src = src;
      a.play().then(() => fadeTo(ducked ? prefs.volume * 0.2 : prefs.volume)).catch(() => setUnlocked(false)); // still blocked: retry on the next tap
    };
    if (audio.current && !audio.current.paused && !audio.current.src.endsWith(src)) fadeTo(0, swap);
    else swap();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- volume/duck changes are handled by the effect below
  }, [prefs.on, scene, unlocked]);

  useEffect(() => {
    if (prefs.on && audio.current && !audio.current.paused) fadeTo(ducked ? prefs.volume * 0.2 : prefs.volume);
  }, [ducked, prefs.volume, prefs.on]);

  useEffect(() => () => { audio.current?.pause(); }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !panel.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("keydown", close); };
  }, [open]);

  const current = scenes.find((s) => s.id === scene)!;
  return (
    <div ref={panel} data-soundscape className="relative flex items-center">
      <button
        onClick={() => { setUnlocked(true); setPrefs((p) => ({ ...p, on: !p.on })); }}
        aria-pressed={prefs.on}
        aria-label="Nature sounds"
        className={`flex min-h-11 cursor-pointer items-center gap-1.5 rounded-l-full border-2 py-1.5 pl-3 pr-2 text-sm font-bold transition-colors ${prefs.on ? "border-leaf bg-leaf-soft text-forest" : "border-forest/15 bg-card text-ink-soft hover:bg-butter-soft"}`}
      >
        <Waves on={prefs.on} />
        <span className="hidden sm:inline" aria-hidden>Nature sounds</span>
      </button>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Nature sound settings"
        className={`flex min-h-11 cursor-pointer items-center rounded-r-full border-2 border-l-0 px-2 ${prefs.on ? "border-leaf bg-leaf-soft text-forest" : "border-forest/15 bg-card text-ink-soft hover:bg-butter-soft"}`}
      >
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {prefs.on && <span className="sr-only" aria-live="polite">Playing {current.label}</span>}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }}
            className="card absolute right-0 top-full z-40 mt-2 w-64 p-4"
          >
            <fieldset>
              <legend className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest">Choose a place</legend>
              <div className="mt-2 space-y-1">
                {scenes.map((s) => (
                  <label key={s.id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-2 ${scene === s.id ? "bg-leaf-soft" : "hover:bg-butter-soft"}`}>
                    <input type="radio" name="scene" className="accent-[var(--color-moss)]" checked={scene === s.id}
                      onChange={() => setPrefs((p) => ({ ...p, scene: s.id, on: true }))} />
                    {s.label}
                  </label>
                ))}
              </div>
              {prefs.scene && (
                <button className="btn-ghost mt-1 text-sm font-bold" onClick={() => setPrefs((p) => ({ ...p, scene: null }))}>
                  Match the page I&apos;m on
                </button>
              )}
            </fieldset>
            <label className="mt-3 block text-sm font-bold text-forest">
              Volume
              <input type="range" min={0.05} max={1} step={0.05} value={prefs.volume}
                onChange={(e) => setPrefs((p) => ({ ...p, volume: Number(e.target.value) }))}
                className="mt-1 w-full accent-[var(--color-moss)]" />
            </label>
            <p className="mt-2 text-xs text-ink-soft">Sounds made with ElevenLabs. Real nature sounds even better — try them outside!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Waves({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" className={on ? "anim-bob" : ""} style={{ transformBox: "fill-box" }} />
    </svg>
  );
}
