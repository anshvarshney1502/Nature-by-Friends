"use client";
import { useEffect, useRef, useState } from "react";
import { quietMinuteParts } from "@/lib/content/creatureSounds";
import { useClip } from "./useClip";

/**
 * Guided outdoor listening (~1 minute): narrator parts with real silences between them.
 * The background soundscape ducks under the voice and comes back up in the silences.
 */
export function QuietMinute({ compact = false }: { compact?: boolean }) {
  const { play, stop, failed } = useClip();
  const [step, setStep] = useState<number | null>(null); // index of current part, null when idle
  const timer = useRef<number | null>(null);

  const clear = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = null; };

  function playPart(i: number) {
    if (i >= quietMinuteParts.length) return finish();
    setStep(i);
    play(`/audio/quiet/${i + 1}.mp3`, () => {
      timer.current = window.setTimeout(() => playPart(i + 1), quietMinuteParts[i].pauseAfter * 1000);
    });
  }
  function finish() { clear(); stop(); setStep(null); }
  const on = step !== null;

  useEffect(() => () => clear(), []);
  useEffect(() => { if (failed) finish(); }, [failed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (compact)
    return (
      <button className="btn bg-butter text-forest shadow-[0_4px_0_#c9a440]" onClick={() => (on ? finish() : playPart(0))} aria-pressed={on}>
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
      {on && (
        <ol className="mt-3 flex gap-1.5" aria-label="Quiet Minute progress">
          {quietMinuteParts.map((_, i) => (
            <li key={i} className={`h-2 w-5 rounded-full ${i <= step ? "bg-leaf" : "bg-forest/10"}`} />
          ))}
        </ol>
      )}
      <p className="mt-4 max-w-md text-ink-soft">
        About one minute of quiet listening, guided by our narrator, with real silences for you to listen. Best done outside, with a trusted adult nearby.
      </p>
      <button className="btn btn-primary mt-4" onClick={() => (on ? finish() : playPart(0))} aria-pressed={on}>
        {on ? "Stop" : "Start the Quiet Minute"}
      </button>
      {failed && <p role="status" className="mt-2 text-sm font-semibold text-coral-ink">The audio couldn&apos;t play. You can still do it: close your eyes and count the sounds you hear.</p>}
    </div>
  );
}
