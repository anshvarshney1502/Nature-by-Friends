"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { categories, friends } from "@/lib/content/friends";
import type { CategoryId } from "@/lib/content/types";
import { FriendCard } from "./FriendCard";
import { Creature } from "@/components/illustrations/Creature";

export function GardenBrowser() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const term = q.trim().toLowerCase();
  const shown = friends.filter(
    (f) => (cat === "all" || f.category === cat) && (!term || `${f.name} ${f.nickname} ${f.tagline}`.toLowerCase().includes(term)),
  );
  const current = categories.find((c) => c.id === cat);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search nature friends</span>
          <input className="field" type="search" placeholder="Search… try “bee” or “leaf”" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <button
          className="btn btn-soft"
          onClick={() => router.push(`/friends/${friends[Math.floor(Math.random() * friends.length)].slug}`)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M12 2l2.4 6.6L21 9l-5 4.6L17.6 21 12 17.3 6.4 21 8 13.6 3 9l6.6-.4Z" /></svg>
          Surprise me
        </button>
      </div>

      <div role="group" aria-label="Filter by kind" className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {[{ id: "all" as const, name: "Everyone" }, ...categories].map((c) => (
          <button
            key={c.id}
            aria-pressed={cat === c.id}
            onClick={() => setCat(c.id)}
            className={`chip min-h-11 shrink-0 cursor-pointer border-2 px-4 ${cat === c.id ? "border-moss bg-moss text-white" : "border-forest/15 bg-card text-forest hover:bg-butter-soft"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {current && (
        <div className="card mt-4 flex flex-col gap-1 bg-butter-soft/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-forest">{current.intro}</p>
          <p className="text-sm text-ink-soft"><strong>Try this:</strong> {current.activity}</p>
        </div>
      )}

      {shown.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center p-10 text-center">
          <Creature slug="snail" className="h-28 w-28" />
          <p className="mt-3 text-lg font-semibold text-forest">No friends by that name in our garden yet.</p>
          <p className="text-ink-soft">But there might be one outside! Try another word, or look at everyone.</p>
          <button className="btn btn-soft mt-4" onClick={() => { setQ(""); setCat("all"); }}>Show everyone</button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((f) => (
              <motion.li key={f.slug} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.2 }}>
                <FriendCard friend={f} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
