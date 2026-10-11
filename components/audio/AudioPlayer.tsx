"use client";
import { useEffect, useRef, useState } from "react";
import { claimVoice, releaseVoice } from "@/lib/audio/voiceChannel";

type State = "idle" | "loading" | "playing" | "paused" | "unavailable";
const SPEEDS = [0.8, 1, 1.2];

/**
 * "Listen to your mission". Tries narrated audio from /api/audio (ElevenLabs, cached),
 * falls back to the browser's own voice, and otherwise tells the child to read the text,
 * which is always on screen.
 */
export function AudioPlayer({ text, label = "Listen" }: { text: string; label?: string }) {
  const [state, setState] = useState<State>("idle");
  const [source, setSource] = useState<"narrator" | "device" | null>(null);
  const [speed, setSpeed] = useState(1);
  const audio = useRef<HTMLAudioElement | null>(null);
  const url = useRef<string | null>(null);

  // Another voice in the app took over: go quiet (keeps the loaded audio so Replay is instant).
  const [yieldTo] = useState(() => () => {
    audio.current?.pause();
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    setState((s) => (s === "playing" || s === "paused" ? "idle" : s));
  });
  useEffect(() => {
    if (state === "playing") claimVoice(yieldTo);
    else if (state === "idle") releaseVoice(yieldTo);
  }, [state, yieldTo]);

  // Let the background soundscape duck under the narrator.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("nbf:narration", { detail: state === "playing" }));
  }, [state]);

  useEffect(() => () => {
    window.dispatchEvent(new CustomEvent("nbf:narration", { detail: false }));
    audio.current?.pause();
    if (url.current) URL.revokeObjectURL(url.current);
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }, []);

  function speakWithDevice() {
    if (typeof speechSynthesis === "undefined") return setState("unavailable");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = speed * 0.95;
    u.onend = () => setState("idle");
    u.onerror = () => setState("unavailable");
    setSource("device");
    setState("playing");
    speechSynthesis.speak(u);
  }

  async function play() {
    if (state === "paused") return resume();
    if (audio.current) {
      audio.current.currentTime = 0;
      audio.current.playbackRate = speed;
      await audio.current.play().catch(() => setState("unavailable"));
      return setState("playing");
    }
    if (source === "device") return speakWithDevice();
    setState("loading");
    try {
      const res = await fetch("/api/audio", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error(String(res.status));
      url.current = URL.createObjectURL(await res.blob());
      const a = new Audio(url.current);
      a.playbackRate = speed;
      a.onended = () => setState("idle");
      a.onerror = () => { audio.current = null; speakWithDevice(); };
      audio.current = a;
      setSource("narrator");
      await a.play();
      setState("playing");
    } catch {
      speakWithDevice();
    }
  }

  function pause() {
    if (source === "narrator") audio.current?.pause();
    else speechSynthesis.pause();
    setState("paused");
  }
  function resume() {
    if (source === "narrator") void audio.current?.play();
    else speechSynthesis.resume();
    setState("playing");
  }
  function replay() {
    if (source === "narrator" && audio.current) {
      audio.current.currentTime = 0;
      void audio.current.play();
      setState("playing");
    } else speakWithDevice();
  }
  function changeSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audio.current) audio.current.playbackRate = next;
  }

  if (state === "unavailable")
    return <p role="status" className="text-sm font-semibold text-ink-soft">Read-aloud isn&apos;t available right now. Ask a grown-up to read it with you.</p>;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Read aloud">
      {state === "playing" ? (
        <button className="btn btn-soft" onClick={pause}><Icon d="M8 5v14M16 5v14" />Pause</button>
      ) : (
        <button className="btn btn-soft" onClick={play} disabled={state === "loading"} aria-busy={state === "loading"}>
          <Icon d="M7 4.5v15l12-7.5-12-7.5Z" />
          {state === "loading" ? "Getting ready…" : state === "paused" ? "Resume" : label}
        </button>
      )}
      {source && (
        <>
          <button className="btn btn-ghost" onClick={replay}>Replay</button>
          {source === "narrator" && (
            <button className="btn btn-ghost" onClick={changeSpeed} aria-label={`Playback speed ${speed}x, tap to change`}>{speed}×</button>
          )}
          <span className="text-xs text-ink-soft">{source === "narrator" ? "Narrated" : "Device voice"}</span>
        </>
      )}
    </div>
  );
}

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);
