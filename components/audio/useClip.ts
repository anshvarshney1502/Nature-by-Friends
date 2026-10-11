"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { claimVoice, releaseVoice } from "@/lib/audio/voiceChannel";

const duck = (on: boolean) => window.dispatchEvent(new CustomEvent("nbf:narration", { detail: on }));

/** Plays pre-made clips through the app-wide voice channel; the soundscape ducks while one plays. */
/** `onInterrupted` runs when another voice in the app takes over (e.g. to cancel a timed sequence). */
export function useClip(onInterrupted?: () => void) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const interrupted = useRef(onInterrupted);
  useEffect(() => { interrupted.current = onInterrupted; });

  // Stable function another voice can call to silence this one.
  const [halt] = useState(() => () => {
    audio.current?.pause();
    audio.current = null;
    setPlaying(null);
    duck(false);
  });
  // What another voice calls when it claims the channel.
  const [yieldTo] = useState(() => () => { halt(); interrupted.current?.(); });

  const stop = useCallback(() => {
    halt();
    releaseVoice(yieldTo);
  }, [halt, yieldTo]);

  const play = useCallback((src: string, onEnd?: () => void) => {
    claimVoice(yieldTo); // stops any other voice in the app
    audio.current?.pause();
    const a = new Audio(src);
    audio.current = a;
    setFailed(false);
    a.onended = () => {
      if (audio.current !== a) return;
      setPlaying(null);
      duck(false);
      releaseVoice(yieldTo);
      onEnd?.();
    };
    a.onerror = () => {
      if (audio.current !== a) return;
      setPlaying(null);
      setFailed(true);
      duck(false);
    };
    duck(true);
    setPlaying(src);
    a.play().catch(() => {
      if (audio.current !== a) return;
      setPlaying(null);
      setFailed(true);
      duck(false);
    });
  }, [yieldTo]);

  useEffect(() => () => stop(), [stop]);
  return { play, stop, playing, failed };
}
