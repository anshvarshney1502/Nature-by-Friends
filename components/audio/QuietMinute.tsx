"use client";
import { useClip } from "./useClip";

const SRC = "/audio/quiet-minute.mp3";

/** Guided outdoor listening in the narrator's voice (~40 s), with a breathing circle. */
export function QuietMinute({ compact = false }: { compact?: boolean }) {
  const { play, stop, playing, failed } = useClip();
  const on = playing === SRC;
  if (compact)
    return (
      <button className="btn bg-butter text-forest shadow-[0_4px_0_#c9a440]" onClick={() => (on ? stop() : play(SRC))} aria-pressed={on}>
        {on ? "Stop the Quiet Minute" : "Listen to the Quiet Minute first"}
      </button>
    );
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative grid h-44 w-44 place-items-center" aria-hidden>
        <span className={`absolute inset-0 rounded-full bg-leaf-soft ${on ? "anim-breathe" : ""}`} />
        <span className={`absolute inset-6 rounded-full bg-leaf/30 ${on ? "anim-breathe" : ""}`} style={{ animationDelay: "0.4s" }} />
        <span className="relative font-[family-name:var(--font-display)] text-lg font-semibold text-forest">{on ? "Breathe…" : "Ready?"}</span>
      </div>
      <p className="mt-4 max-w-md text-ink-soft">
        About 40 seconds of quiet listening, read by our narrator. Best done outside, with a trusted adult nearby.
      </p>
      <button className="btn btn-primary mt-4" onClick={() => (on ? stop() : play(SRC))} aria-pressed={on}>
        {on ? "Stop" : "Start the Quiet Minute"}
      </button>
      {failed && <p role="status" className="mt-2 text-sm font-semibold text-coral">The audio couldn&apos;t play. You can still do it: close your eyes and count the sounds you hear.</p>}
    </div>
  );
}
