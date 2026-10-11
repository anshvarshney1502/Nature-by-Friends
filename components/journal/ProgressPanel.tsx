"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { friends } from "@/lib/content/friends";
import { safariRounds } from "@/lib/content/creatureSounds";
import { loadProgress, markMet, onProgress, type Progress } from "@/lib/storage/progress";
import { loadEntries } from "@/lib/storage/journal";
import { Creature } from "@/components/illustrations/Creature";

/** Records that a friend's page was opened. Renders nothing. */
export function MarkMet({ slug }: { slug: string }) {
  useEffect(() => { markMet(slug); }, [slug]);
  return null;
}

/** Small "You've met" badge for garden cards. */
export function MetBadge({ slug }: { slug: string }) {
  const [met, setMet] = useState(false);
  useEffect(() => {
    const read = () => setMet(loadProgress().met.includes(slug));
    read();
    return onProgress(read);
  }, [slug]);
  if (!met) return null;
  return <span className="chip absolute right-3 top-3 bg-butter text-xs text-forest">Met</span>;
}

/** "My nature progress": kept in this browser only. Encouraging, never a score. */
export function ProgressPanel() {
  const [p, setP] = useState<Progress | null>(null);
  const [missions, setMissions] = useState({ saved: 0, revisits: 0 });

  useEffect(() => {
    const read = () => {
      setP(loadProgress());
      const e = loadEntries();
      setMissions({ saved: e.filter((x) => !x.revisitOf).length, revisits: e.filter((x) => x.revisitOf).length });
    };
    read();
    return onProgress(read);
  }, []);

  if (!p) return <div className="card h-40 animate-pulse bg-paper-deep/50" aria-label="Loading progress" />;
  const stats = [
    { n: p.met.length, of: friends.length, label: "friends met", href: "/garden" },
    { n: missions.saved, label: "missions saved", href: "/missions" },
    { n: missions.revisits, label: "return visits", href: "/journal" },
    { n: p.sounds.length, of: safariRounds.length, label: "sounds learned", href: "/listen#safari" },
    { n: p.quietMinutes, label: "quiet minutes", href: "/listen#quiet" },
  ];

  return (
    <section aria-labelledby="progress-h" className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="progress-h" className="text-2xl font-semibold">My nature progress</h2>
        <p className="text-xs text-ink-soft">Saved only in this browser.</p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="block rounded-2xl bg-leaf-soft/50 p-3 text-center hover:bg-leaf-soft">
              <span className="block font-[family-name:var(--font-display)] text-3xl font-semibold text-forest">
                {s.n}{s.of ? <span className="text-lg text-ink-soft">/{s.of}</span> : null}
              </span>
              <span className="text-sm font-semibold text-ink-soft">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h3 className="mt-5 text-lg font-semibold">Friends you&apos;ve met</h3>
      <ul className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {friends.map((f) => {
          const met = p.met.includes(f.slug);
          return (
            <li key={f.slug}>
              <Link
                href={`/friends/${f.slug}`}
                aria-label={`${f.name}${met ? " (met)" : " (not met yet)"}`}
                className={`grid aspect-square place-items-center rounded-2xl border-2 ${met ? "border-leaf/40 bg-card" : "border-dashed border-forest/15 bg-paper-deep/40"}`}
              >
                <Creature slug={f.slug} className={`h-4/5 w-4/5 ${met ? "" : "opacity-25 grayscale"}`} />
              </Link>
            </li>
          );
        })}
      </ul>
      {p.met.length < friends.length && (
        <p className="mt-3 text-sm text-ink-soft">Tap a faded friend to meet them. There&apos;s no hurry: the best meetings happen outside.</p>
      )}
    </section>
  );
}
