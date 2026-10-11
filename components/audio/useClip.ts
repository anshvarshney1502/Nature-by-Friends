"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// One pre-made clip at a time across the app; the soundscape ducks while it plays.
let current: HTMLAudioElement | null = null;
const duck = (on: boolean) => window.dispatchEvent(new CustomEvent("nbf:narration", { detail: on }));

export function useClip() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const stop = useCallback(() => {
    audio.current?.pause();
    setPlaying(null);
    duck(false);
  }, []);

  const play = useCallback((src: string, onEnd?: () => void) => {
    current?.pause();
    const a = new Audio(src);
    current = audio.current = a;
    setFailed(false);
    a.onended = () => { setPlaying(null); duck(false); onEnd?.(); };
    a.onerror = () => { setPlaying(null); setFailed(true); duck(false); };
    a.onpause = () => { if (!a.ended) setPlaying((p) => (p === src ? null : p)); };
    duck(true);
    setPlaying(src);
    a.play().catch(() => { setPlaying(null); setFailed(true); duck(false); });
  }, []);

  useEffect(() => () => { audio.current?.pause(); duck(false); }, []);
  return { play, stop, playing, failed };
}
