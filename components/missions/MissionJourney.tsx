"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { friends, getFriend } from "@/lib/content/friends";
import { friendRules, listeningMission } from "@/lib/content/general";
import { addEntry, daysFromToday, today } from "@/lib/storage/journal";
import type { IdentifyResult } from "@/lib/ai/schemas";
import { Creature } from "@/components/illustrations/Creature";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { missionText } from "@/lib/content/narration";
import { PhotoHelper } from "./PhotoHelper";
import { Bloom } from "./Bloom";

const STEPS = ["Meet", "Discover", "Respect", "Go outside", "Reflect", "Remember"];
const KEY = "nbf.mission.v1";

type Draft = {
  step: number;
  slug: string | null;
  photo?: string;
  ai?: IdentifyResult;
  foundIt: boolean;
  noticed: string;
  surprised: string;
  learned: string;
  spot: string;
  remind: boolean;
};
const blank: Draft = { step: 0, slug: null, foundIt: true, noticed: "", surprised: "", learned: "", spot: "", remind: false };

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...blank, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

export function MissionJourney() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [d, setD] = useState<Draft>(blank);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<"no" | "yes" | "failed">("no");

  // Resume a mission in progress (the child may have closed the app while outside).
  useEffect(() => {
    const fromUrl = params.get("friend");
    const draft = loadDraft();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage once on mount
    if (fromUrl && getFriend(fromUrl) && draft?.slug !== fromUrl) setD({ ...blank, slug: fromUrl, step: 1 });
    else if (draft) setD(draft);
    setReady(true);
  }, [params]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (saved === "yes") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify(d));
    } catch {
      /* storage full or blocked: mission still works for this visit */
    }
  }, [d, ready, saved]);

  const up = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));
  const go = (step: number) => {
    up({ step });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  const friend = d.slug ? getFriend(d.slug) : undefined;
  const mission = friend
    ? friend.mission
    : d.ai
      ? { title: "Your photo mission", steps: d.ai.observationMission, ifNothingFound: listeningMission.ifNothingFound }
      : listeningMission;
  const rules = friend ? friend.dontDo : d.ai ? d.ai.safetyGuidance : friendRules;
  const who = friend ? `the ${friend.name.toLowerCase()}` : d.ai?.possibleIdentification ? `this possible ${d.ai.possibleIdentification.toLowerCase()}` : "little neighbours";

  function save() {
    const entry = addEntry({
      date: today(),
      friendSlug: d.slug,
      title: friend?.name ?? d.ai?.possibleIdentification ?? mission.title,
      spot: d.spot.trim(),
      noticed: d.noticed.trim(),
      surprised: d.surprised.trim(),
      learned: d.learned.trim(),
      foundIt: d.foundIt,
      photo: d.photo,
      revisitOn: d.remind ? daysFromToday(3) : undefined,
    });
    setSaved(entry ? "yes" : "failed");
  }

  function restart() {
    setSaved("no");
    setD(blank);
  }

  if (!ready) return <div className="card h-96 animate-pulse bg-paper-deep/50" aria-label="Loading mission" />;

  return (
    <div>
      <ol className="mb-6 flex gap-1.5" aria-label="Mission progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1" aria-current={i === d.step ? "step" : undefined}>
            <span className={`block h-2.5 rounded-full transition-colors ${i <= d.step ? "bg-leaf" : "bg-forest/10"}`} />
            <span className={`mt-1 hidden text-xs font-bold sm:block ${i === d.step ? "text-forest" : "text-ink-soft/70"}`}>{s}</span>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">Step {d.step + 1} of 6: {STEPS[d.step]}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={saved === "yes" ? "done" : d.step}
          initial={reduce ? false : { opacity: 0, x: 24, rotate: 0.4 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {saved === "yes" ? (
            <Panel>
              <Bloom />
              <h2 className="text-center text-3xl font-semibold">Nature memory saved!</h2>
              <p className="mx-auto mt-2 max-w-md text-center text-ink-soft">
                You were a good friend today. Your memory is kept on this device only.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/journal" className="btn btn-primary">Open my journal</Link>
                <button className="btn btn-soft" onClick={restart}>Another mission</button>
              </div>
            </Panel>
          ) : d.step === 0 ? (
            <Panel>
              <h2 className="text-3xl font-semibold">Who would you like to meet?</h2>
              <p className="mt-1 text-ink-soft">Pick a little neighbour. You don&apos;t need to find it — trying is what counts.</p>
              <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {friends.map((f) => (
                  <li key={f.slug}>
                    <button
                      onClick={() => { up({ slug: f.slug, ai: undefined }); go(1); }}
                      className="flex w-full cursor-pointer flex-col items-center rounded-3xl border-2 border-forest/10 bg-card p-2 font-semibold text-forest transition hover:-translate-y-0.5 hover:border-leaf hover:bg-leaf-soft/50"
                    >
                      <Creature slug={f.slug} className="h-16 w-16 sm:h-20 sm:w-20" />
                      <span className="text-sm">{f.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button onClick={() => { up({ slug: null, ai: undefined }); go(1); }} className="card cursor-pointer p-5 text-left hover:bg-sky-soft">
                  <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-forest">Surprise me outside</p>
                  <p className="text-ink-soft">A listening mission that works anywhere.</p>
                </button>
                <PhotoHelper
                  photo={d.photo}
                  onPhoto={(photo) => up({ photo, ai: undefined })}
                  onResult={(ai) => {
                    const match = ai.matchedSlug && getFriend(ai.matchedSlug) && ai.confidenceLabel === "likely" ? ai.matchedSlug : null;
                    up({ ai, slug: match });
                  }}
                  onUse={() => go(1)}
                />
              </div>
            </Panel>
          ) : d.step === 1 ? (
            <Panel>
              <div className="flex flex-col items-start gap-5 sm:flex-row">
                <Creature slug={friend?.slug ?? "dandelion"} className="anim-bob h-28 w-28 shrink-0" />
                <div>
                  <p className="chip bg-butter text-forest">Your mission</p>
                  <h2 className="mt-2 text-3xl font-semibold">{mission.title}</h2>
                  <ol className="mt-4 space-y-3">
                    {mission.steps.map((s, i) => (
                      <li key={s} className="flex gap-3 text-lg">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-leaf-soft font-bold text-forest">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-5"><AudioPlayer text={missionText(mission)} label="Listen to your mission" /></div>
                </div>
              </div>
              <Nav back={() => go(0)} next={() => go(2)} nextLabel="Got it" />
            </Panel>
          ) : d.step === 2 ? (
            <Panel tone="bg-leaf-soft/50">
              <h2 className="text-3xl font-semibold">How to be a good friend to {who}</h2>
              <p className="mt-1 text-ink-soft">Friends give each other space. Their home stays their home.</p>
              <ul className="mt-5 space-y-3">
                {rules.map((r) => (
                  <li key={r} className="flex gap-3 rounded-2xl bg-card p-3 text-lg">
                    <svg viewBox="0 0 24 24" className="mt-1 h-6 w-6 shrink-0 text-moss" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" /></svg>
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-2xl border-2 border-coral/40 bg-coral-soft/60 p-3 font-semibold">
                If something might sting or bite, or an animal seems upset: stop the mission, step away and tell a trusted adult.
              </p>
              <Nav back={() => go(1)} next={() => go(3)} nextLabel="I promise to be a friend" />
            </Panel>
          ) : d.step === 3 ? (
            <Panel tone="bg-forest text-paper">
              <div className="flex flex-col items-center py-6 text-center">
                <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
                  <rect x="38" y="20" width="44" height="76" rx="10" fill="#cfe5b4" stroke="#fbf5e6" strokeWidth="3" />
                  <path d="M50 58 q 10 12 20 0" fill="none" stroke="#24452a" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="52" cy="46" r="3" fill="#24452a" /><circle cx="68" cy="46" r="3" fill="#24452a" />
                  <path className="anim-sway" d="M26 108 q 34 -14 68 0" stroke="#f6d77a" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
                <h2 className="mt-3 text-4xl font-semibold text-butter">Phone down. Eyes up.</h2>
                <p className="mt-3 max-w-md text-lg text-paper/90">
                  Go outside with a trusted adult. Take your time — there&apos;s no timer. You can close the app; your mission will be waiting.
                </p>
                <ul className="mt-5 space-y-1 text-left text-paper/90">
                  <li>• {mission.steps[0]}</li>
                  <li>• Watch quietly from a respectful distance.</li>
                  <li>• Come back and tell your journal what you noticed.</li>
                </ul>
                <button className="btn mt-8 bg-butter text-forest shadow-[0_4px_0_#c9a440]" onClick={() => go(4)}>I&apos;m back!</button>
                <button className="btn btn-ghost mt-2 text-paper/80" onClick={() => go(2)}>Back</button>
              </div>
            </Panel>
          ) : d.step === 4 ? (
            <Panel>
              <h2 className="text-3xl font-semibold">Welcome back! How did it go?</h2>
              <div className="mt-4 flex flex-wrap gap-3" role="group" aria-label="Did you meet them?">
                <button aria-pressed={d.foundIt} onClick={() => up({ foundIt: true })} className={`btn ${d.foundIt ? "btn-primary" : "btn-soft"}`}>I saw something!</button>
                <button aria-pressed={!d.foundIt} onClick={() => up({ foundIt: false })} className={`btn ${!d.foundIt ? "btn-primary" : "btn-soft"}`}>Not this time</button>
              </div>
              {!d.foundIt && (
                <p className="mt-4 rounded-2xl bg-butter-soft p-4 text-lg">
                  That&apos;s completely okay — friends don&apos;t always show up. {mission.ifNothingFound}
                </p>
              )}
              <div className="mt-5 space-y-4">
                <TextQ label="What did you notice?" value={d.noticed} onChange={(noticed) => up({ noticed })} />
                <TextQ label="What surprised you?" value={d.surprised} onChange={(surprised) => up({ surprised })} />
                <TextQ label="What did you learn by watching quietly?" value={d.learned} onChange={(learned) => up({ learned })} />
              </div>
              <p className="mt-2 text-sm text-ink-soft">All answers are optional. You can also ask a grown-up to write for you.</p>
              <Nav back={() => go(3)} next={() => go(5)} nextLabel="Next" />
            </Panel>
          ) : (
            <Panel>
              <h2 className="text-3xl font-semibold">Save a nature memory</h2>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="font-bold text-forest">Give your spot a nickname (optional)</span>
                  <input className="field mt-1" maxLength={60} value={d.spot} onChange={(e) => up({ spot: e.target.value })} placeholder="e.g. the big tree, Grandma's flower pot" />
                  <span className="mt-1 block text-sm text-ink-soft">Just a fun name — please don&apos;t write an address.</span>
                </label>
                {d.photo && (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
                    <img src={d.photo} alt="Your observation photo" className="h-20 w-20 rounded-2xl object-cover" />
                    <button className="btn btn-ghost" onClick={() => up({ photo: undefined })}>Don&apos;t save the photo</button>
                  </div>
                )}
                <label className="flex items-start gap-3 rounded-2xl bg-sky-soft p-3">
                  <input type="checkbox" className="mt-1.5 h-5 w-5 accent-[var(--color-moss)]" checked={d.remind} onChange={(e) => up({ remind: e.target.checked })} />
                  <span>
                    <span className="font-bold text-forest">Plan a return visit in 3 days</span>
                    <span className="block text-sm text-ink-soft">A grown-up can turn this on. It only shows a note in your journal — no notifications.</span>
                  </span>
                </label>
              </div>
              {saved === "failed" && (
                <p role="alert" className="mt-4 rounded-2xl bg-coral-soft p-3 font-semibold">
                  This device&apos;s storage is full, so the memory wasn&apos;t saved. Try removing the photo, or delete an old journal page.
                </p>
              )}
              <Nav back={() => go(4)} next={save} nextLabel="Save to my journal" />
            </Panel>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Panel({ children, tone = "bg-card" }: { children: React.ReactNode; tone?: string }) {
  return <section className={`card p-5 sm:p-8 ${tone}`}>{children}</section>;
}

function Nav({ back, next, nextLabel }: { back: () => void; next: () => void; nextLabel: string }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <button className="btn btn-ghost" onClick={back}>Back</button>
      <button className="btn btn-primary" onClick={next}>{nextLabel}</button>
    </div>
  );
}

function TextQ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="font-bold text-forest">{label}</span>
      <textarea className="field mt-1 min-h-20" maxLength={600} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
