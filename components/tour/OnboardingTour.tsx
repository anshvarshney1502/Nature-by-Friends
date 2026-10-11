"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { tourSlides } from "@/lib/content/tour";
import { Creature } from "@/components/illustrations/Creature";
import { useClip } from "@/components/audio/useClip";

const KEY = "nbf.tour.v1";
export const openTour = () => window.dispatchEvent(new Event("nbf:tour"));

/**
 * First-visit guided tour of every feature: a 3D paper stage that tilts with the pointer,
 * page-flip transitions, and narration in the app's ElevenLabs voice. Skippable at any time.
 */
export function OnboardingTour() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { play, stop } = useClip();
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [started, setStarted] = useState(false); // narration only after a tap (browser audio rule)
  const [muted, setMuted] = useState(false);
  const [voiceDone, setVoiceDone] = useState(false); // narration finished: invite the next step
  const dialog = useRef<HTMLDivElement>(null);
  const slide = tourSlides[i];
  const last = i === tourSlides.length - 1;

  // Show once on the first visit; "Take the tour" buttons reopen it.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read localStorage once after mount
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* storage blocked: skip the auto tour rather than show it on every page */
    }
    const reopen = () => { setI(0); setStarted(false); setOpen(true); };
    window.addEventListener("nbf:tour", reopen);
    return () => window.removeEventListener("nbf:tour", reopen);
  }, []);

  const close = useCallback(() => {
    stop();
    setOpen(false);
    try { localStorage.setItem(KEY, "done"); } catch { /* ignore */ }
  }, [stop]);

  const go = useCallback((n: number) => {
    if (n < 0 || n >= tourSlides.length) return;
    setDir(n > i ? 1 : -1);
    setI(n);
  }, [i]);

  // Narrate the current slide.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the cue for each new slide
    setVoiceDone(false);
    if (open && started && !muted) play(`/audio/tour/${slide.id}.mp3`, () => setVoiceDone(true));
    else stop();
  }, [open, started, muted, slide.id, play, stop]);
  const showCue = started && (voiceDone || muted);

  // Keyboard, focus and scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") { setStarted(true); go(i + 1); }
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, i, go, close]);

  // 3D tilt that follows the pointer.
  const px = useMotionValue(0), py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-1, 1], [12, -12]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(px, [-1, 1], [-16, 16]), { stiffness: 120, damping: 14 });
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  if (!open) return null;

  const flip = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, rotateY: 75 * dir, x: 60 * dir },
        animate: { opacity: 1, rotateY: 0, x: 0 },
        exit: { opacity: 0, rotateY: -75 * dir, x: -60 * dir },
      };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest/75 p-3 backdrop-blur-sm sm:p-6">
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        tabIndex={-1}
        className="card relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden outline-none"
      >
        {/* top bar */}
        <div className="flex items-center justify-between gap-2 border-b-2 border-forest/10 px-4 py-2.5">
          <p className="text-sm font-bold text-ink-soft">
            Guided tour · {i + 1} of {tourSlides.length}
          </p>
          <div className="flex items-center gap-1">
            {started && (
              <button className="btn btn-ghost text-sm" onClick={() => setMuted((m) => !m)} aria-pressed={muted}>
                {muted ? "Unmute voice" : "Mute voice"}
              </button>
            )}
            <button className="btn btn-soft min-h-10 px-4 py-1.5 text-base" onClick={close}>
              Skip tour
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1.1fr_1fr]" style={{ perspective: 1400 }}>
          {/* 3D stage */}
          <div className="relative p-4 sm:p-6" onPointerMove={tilt} onPointerLeave={() => { px.set(0); py.set(0); }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={slide.id} {...flip} transition={{ duration: reduce ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }} style={{ transformStyle: "preserve-3d" }}>
                <motion.div
                  style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
                  className={`relative mx-auto aspect-[4/3] w-full max-w-md rounded-[2rem] border-2 border-forest/15 bg-gradient-to-br ${slide.tone} shadow-[0_30px_60px_-20px_rgba(36,69,42,0.55)]`}
                >
                  {/* soft hills, back to front */}
                  <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full rounded-[2rem]" aria-hidden style={{ transform: "translateZ(0px)" }}>
                    <path d="M0 210 C 90 170, 190 180, 260 205 C 320 185, 370 185, 400 195 L 400 300 L 0 300 Z" fill="#b7d79a" opacity="0.8" />
                    <path d="M0 250 C 120 228, 280 236, 400 246 L 400 300 L 0 300 Z" fill="#8fbf6a" />
                    <circle cx="335" cy="60" r="26" fill="#f6d77a" />
                  </svg>
                  <Layer z={20} className="left-[6%] top-[14%] w-[34%]" delay={0}><Creature slug={slide.creatures[0]} /></Layer>
                  <Layer z={60} className="right-[8%] top-[10%] w-[30%]" delay={0.6}><Creature slug={slide.creatures[1]} /></Layer>
                  <Layer z={140} className="bottom-[4%] left-[34%] w-[34%]" delay={1.2}><Creature slug={slide.creatures[2]} /></Layer>
                  <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-bold text-forest" style={{ transform: "translateZ(90px)" }}>
                    {slide.kicker}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* text */}
          <div className="flex flex-col justify-center px-5 pb-5 sm:px-8 md:py-8">
            <AnimatePresence mode="wait">
              <motion.div key={slide.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <p className="chip bg-leaf-soft text-forest">{slide.kicker}</p>
                <h2 id="tour-title" className="mt-3 text-3xl font-semibold sm:text-4xl">{slide.title}</h2>
                <p className="mt-3 text-lg text-ink-soft">{slide.body}</p>
                {slide.href && (
                  <button className="btn-ghost mt-3 inline-flex font-bold" onClick={() => { close(); router.push(slide.href!); }}>
                    {slide.cta} →
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* bottom controls */}
        <div className="flex items-center justify-between gap-3 border-t-2 border-forest/10 px-4 py-3">
          <button className="btn btn-ghost" onClick={() => go(i - 1)} disabled={i === 0}>Back</button>
          <ol className="hidden gap-1.5 sm:flex" aria-label="Tour steps">
            {tourSlides.map((t, k) => (
              <li key={t.id}>
                <button
                  onClick={() => { setStarted(true); go(k); }}
                  aria-label={`Go to ${t.kicker}`}
                  aria-current={k === i ? "step" : undefined}
                  className={`h-2.5 cursor-pointer rounded-full transition-all ${k === i ? "w-7 bg-leaf" : "w-2.5 bg-forest/20 hover:bg-forest/40"}`}
                />
              </li>
            ))}
          </ol>
          {!started ? (
            <button className="btn btn-primary" onClick={() => setStarted(true)}>Show me around</button>
          ) : last ? (
            <button className={`btn btn-primary ${showCue ? "ring-4 ring-butter" : ""}`} onClick={() => { close(); router.push("/garden"); }}>
              Let&apos;s explore!{showCue && <Arrow />}
            </button>
          ) : (
            <button className={`btn btn-primary ${showCue ? "ring-4 ring-butter" : ""}`} onClick={() => go(i + 1)}>
              Next{showCue && <Arrow />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="anim-nudge h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Layer({ z, className, delay, children }: { z: number; className: string; delay: number; children: React.ReactNode }) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div className="anim-bob" style={{ animationDelay: `${delay}s` }}>{children}</div>
    </div>
  );
}

/** Replays the tour (footer, home page). */
export function TourButton({ className = "btn btn-soft" }: { className?: string }) {
  return (
    <button className={className} onClick={openTour}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z" />
      </svg>
      Take the tour
    </button>
  );
}
