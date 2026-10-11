"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { safariRounds } from "@/lib/content/creatureSounds";
import { getFriend } from "@/lib/content/friends";
import { Creature } from "@/components/illustrations/Creature";
import { useClip } from "./useClip";

const shuffle = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);

function makeRound(slug: string) {
  const others = shuffle(safariRounds.map((r) => r.slug).filter((s) => s !== slug)).slice(0, 2);
  return shuffle([slug, ...others]);
}

/** Listen, guess who made the sound, then the narrator reveals a fact. No points, no timer. */
export function SoundSafari() {
  const reduce = useReducedMotion();
  const { play, playing, failed } = useClip();
  const [order, setOrder] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const slug = order?.[i];
  const round = safariRounds.find((r) => r.slug === slug);

  function start() {
    const o = shuffle(safariRounds.map((r) => r.slug));
    setOrder(o);
    setI(0);
    setChoices(makeRound(o[0]));
    setWrong([]);
    setSolved(false);
    play("/audio/safari/intro.mp3", () => play(`/sounds/creatures/${o[0]}.mp3`));
  }

  function guess(s: string) {
    if (solved || !slug) return;
    if (s === slug) {
      setSolved(true);
      play(`/audio/safari/${slug}.mp3`);
    } else setWrong((w) => [...w, s]);
  }

  function next() {
    const n = i + 1;
    setI(n);
    setWrong([]);
    setSolved(false);
    if (order && n < order.length) {
      setChoices(makeRound(order[n]));
      play(`/sounds/creatures/${order[n]}.mp3`);
    }
  }

  if (!order)
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <div className="flex -space-x-4">
          {["sparrow", "frog", "honeybee"].map((s, k) => (
            <div key={s} className="anim-bob" style={{ animationDelay: `${k * 0.4}s` }}><Creature slug={s} className="h-20 w-20" /></div>
          ))}
        </div>
        <p className="mt-3 max-w-md text-lg">Hear a sound from nature and guess which friend made it. Turn your volume up!</p>
        <button className="btn btn-primary mt-4" onClick={start}>Start Sound Safari</button>
      </div>
    );

  if (!slug)
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <Creature slug="sparrow" className="anim-bob h-24 w-24" />
        <h3 className="mt-3 text-2xl font-semibold">You listened to {order.length} nature friends!</h3>
        <p className="mt-1 max-w-md text-ink-soft">Now try it for real: go outside with a trusted adult, close your eyes, and see which of these sounds you can hear.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/missions" className="btn btn-primary">Start a mission</Link>
          <button className="btn btn-soft" onClick={start}>Play again</button>
        </div>
      </div>
    );

  const f = getFriend(slug)!;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-ink-soft">Sound {i + 1} of {order.length}</p>
        <button className="btn btn-soft" onClick={() => play(`/sounds/creatures/${slug}.mp3`)} disabled={!!playing}>
          <svg viewBox="0 0 24 24" className={`h-5 w-5 ${playing ? "anim-bob" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" /></svg>
          {playing ? "Listening…" : "Hear it again"}
        </button>
      </div>
      <p className="mt-4 text-center font-[family-name:var(--font-display)] text-2xl font-semibold text-forest">Who is making this sound?</p>
      {failed && <p role="status" className="mt-2 text-center text-sm font-semibold text-coral-ink">The sound didn&apos;t play. Check your volume and tap “Hear it again”.</p>}
      <ul className="mt-4 grid grid-cols-3 gap-3">
        {choices.map((c) => {
          const cf = getFriend(c)!;
          const isWrong = wrong.includes(c);
          const isRight = solved && c === slug;
          return (
            <li key={c}>
              <motion.button
                onClick={() => guess(c)}
                disabled={isWrong || solved}
                animate={isWrong && !reduce ? { x: [0, -6, 6, -4, 0] } : isRight && !reduce ? { scale: [1, 1.08, 1] } : {}}
                className={`flex w-full cursor-pointer flex-col items-center rounded-3xl border-2 p-2 font-semibold transition-colors ${isRight ? "border-leaf bg-leaf-soft" : isWrong ? "border-forest/10 bg-paper-deep/50 opacity-50" : "border-forest/10 bg-card hover:border-leaf hover:bg-leaf-soft/40"}`}
              >
                <Creature slug={c} className="h-16 w-16 sm:h-24 sm:w-24" />
                <span className="text-sm text-forest sm:text-base">{cf.name}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite" className="mt-4 min-h-24">
        <AnimatePresence mode="wait">
          {solved && round ? (
            <motion.div key="right" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-leaf-soft/60 p-4 text-center">
              <p className="text-lg font-semibold text-forest">{round.reveal}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                <button className="btn btn-primary" onClick={next}>{i + 1 < order.length ? "Next sound" : "Finish"}</button>
                <Link href={`/friends/${f.slug}`} className="btn btn-ghost">Meet the {f.name.toLowerCase()}</Link>
              </div>
            </motion.div>
          ) : wrong.length > 0 ? (
            <motion.p key="wrong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-semibold text-ink-soft">
              Not quite — listen again and try another friend!
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
