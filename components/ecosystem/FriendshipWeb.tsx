"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { WEB_H, WEB_W, webLinks, webNodes } from "@/lib/content/web";

// Padding around the layout so edge nodes and labels fit.
const PAD = 7;
const VW = WEB_W + PAD * 2, VH = WEB_H + PAD * 2;
import { Creature } from "@/components/illustrations/Creature";

const node = (id: string) => webNodes.find((n) => n.id === id)!;
const linkId = (l: { from: string; to: string }) => `${l.from}-${l.to}`;

export function FriendshipWeb() {
  const reduce = useReducedMotion();
  const [focus, setFocus] = useState<string>("earthworm");
  const [link, setLink] = useState<string | null>(null);
  const connected = webLinks.filter((l) => l.from === focus || l.to === focus);
  const active = webLinks.find((l) => linkId(l) === link);
  const focusNode = node(focus);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card relative mx-auto w-full max-w-xl overflow-hidden bg-sky-soft/60" style={{ aspectRatio: `${VW} / ${VH}` }}>
        <svg viewBox={`${-PAD} ${-PAD} ${VW} ${VH}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {webLinks.map((l) => {
            const a = node(l.from), b = node(l.to);
            const on = l.from === focus || l.to === focus;
            return (
              <motion.path key={linkId(l)} d={`M${a.x} ${a.y} Q ${(a.x + b.x) / 2 + (b.y - a.y) * 0.15} ${(a.y + b.y) / 2 - (b.x - a.x) * 0.15} ${b.x} ${b.y}`}
                fill="none" strokeLinecap="round" strokeDasharray={on ? "0" : "1.5 2"}
                animate={{ stroke: linkId(l) === link ? "#d0654c" : on ? "#3f6e2c" : "#9fb59a", strokeWidth: on ? 1.1 : 0.45, opacity: on ? 1 : 0.6 }}
                transition={{ duration: reduce ? 0 : 0.3 }} />
            );
          })}
        </svg>
        {webNodes.map((n) => {
          const on = n.id === focus || connected.some((l) => l.from === n.id || l.to === n.id);
          return (
            <button key={n.id} onClick={() => { setFocus(n.id); setLink(null); }} aria-pressed={n.id === focus}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center rounded-2xl p-0.5 transition-all ${on ? "opacity-100" : "opacity-55 hover:opacity-100"}`}
              style={{ left: `${((n.x + PAD) / VW) * 100}%`, top: `${((n.y + PAD) / VH) * 100}%` }}>
              <span className={`grid h-10 w-10 place-items-center rounded-full border-2 bg-card sm:h-14 sm:w-14 ${n.id === focus ? "border-coral ring-4 ring-coral/25" : "border-forest/25"}`}>
                {n.slug ? <Creature slug={n.slug} className="h-8 w-8 sm:h-12 sm:w-12" /> : <Thing id={n.id} />}
              </span>
              <span className="mt-0.5 whitespace-nowrap rounded-full bg-card/90 px-1 text-[10px] font-bold leading-tight text-forest sm:px-1.5 sm:text-xs">{n.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-semibold">{focusNode.label}&apos;s friendships</h2>
        <p className="text-ink-soft">Tap a connection to learn how they help each other.</p>
        <ul className="mt-3 space-y-2">
          {connected.map((l) => {
            const other = node(l.from === focus ? l.to : l.from);
            const open = link === linkId(l);
            return (
              <li key={linkId(l)}>
                <button onClick={() => setLink(open ? null : linkId(l))} aria-expanded={open}
                  className={`w-full cursor-pointer rounded-2xl border-2 p-3 text-left transition-colors ${open ? "border-coral bg-coral-soft/50" : "border-forest/10 bg-card hover:bg-butter-soft"}`}>
                  <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest">{l.title}</span>
                  <span className="block text-sm text-ink-soft">with {other.label}</span>
                  {open && <span className="mt-2 block">{l.explain}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        {active && <p className="sr-only" aria-live="polite">{active.title}: {active.explain}</p>}
        {focusNode.slug && <Link href={`/friends/${focusNode.slug}`} className="btn btn-soft mt-4">Meet the {focusNode.label.toLowerCase()}</Link>}
      </div>
    </div>
  );
}

function Thing({ id }: { id: string }) {
  const art: Record<string, React.ReactNode> = {
    sun: <><circle cx="20" cy="20" r="9" fill="#f6d77a" stroke="#2d2a22" strokeWidth="2" />{[0, 45, 90, 135, 180, 225, 270, 315].map((d) => <path key={d} d="M20 4v4" stroke="#e0b64a" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${d} 20 20)`} />)}</>,
    leaves: <><path d="M8 28C8 16 16 10 26 10c0 10-8 18-18 18Z" fill="#d8a46a" stroke="#2d2a22" strokeWidth="2" /><path d="M16 32c0-8 6-12 16-12-2 8-8 12-16 12Z" fill="#e0785f" stroke="#2d2a22" strokeWidth="2" /></>,
    pond: <><ellipse cx="20" cy="24" rx="16" ry="9" fill="#a9d3e8" stroke="#2d2a22" strokeWidth="2" /><path d="M10 24 q 5 -3 10 0 t 10 0" stroke="#5aa0b8" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M30 18 q 2 -8 0 -12 M33 19 q 3 -6 4 -9" stroke="#3f6e2c" strokeWidth="2" fill="none" strokeLinecap="round" /></>,
    soil: <><path d="M4 26q16-10 32 0v8H4Z" fill="#8a5a3b" stroke="#2d2a22" strokeWidth="2" /><circle cx="14" cy="29" r="1.5" fill="#d8a46a" /><circle cx="25" cy="31" r="1.5" fill="#d8a46a" /></>,
  };
  return <svg viewBox="0 0 40 40" className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden>{art[id]}</svg>;
}
