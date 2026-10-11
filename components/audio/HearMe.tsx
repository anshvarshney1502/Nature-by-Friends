"use client";
import { creatureSounds } from "@/lib/content/creatureSounds";
import { useClip } from "./useClip";

/** "Hear me" for a friend: its real call, or (for quiet friends) the sound of where it lives. */
export function HearMe({ slug, name }: { slug: string; name: string }) {
  const sound = creatureSounds[slug];
  const { play, stop, playing, failed } = useClip();
  if (!sound) return null;
  const src = `/sounds/creatures/${slug}.mp3`;
  const label = sound.kind === "call" ? `Hear the ${name.toLowerCase()}: ${sound.label.toLowerCase()}` : `Hear its home: ${sound.label.toLowerCase()}`;
  return (
    <div className="flex flex-col items-start gap-1">
      <button className="btn btn-soft" onClick={() => (playing ? stop() : play(src))} aria-pressed={!!playing}>
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${playing ? "anim-bob" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
        </svg>
        {playing ? "Stop" : label}
      </button>
      {sound.kind === "home" && <span className="text-xs text-ink-soft">This friend is very quiet, so you&apos;re hearing the place where it lives.</span>}
      {failed && <span role="status" className="text-xs font-semibold text-coral">This sound couldn&apos;t play. Try listening outside instead!</span>}
    </div>
  );
}
