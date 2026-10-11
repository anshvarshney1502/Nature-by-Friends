"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { addEntry, deleteEntry, loadEntries, today, type Entry } from "@/lib/storage/journal";
import { getFriend } from "@/lib/content/friends";
import { Creature } from "@/components/illustrations/Creature";

const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

export function JournalView() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [revisiting, setRevisiting] = useState<Entry | null>(null);
  const [compare, setCompare] = useState<[Entry, Entry] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- read localStorage after mount
  useEffect(() => setEntries(loadEntries()), []);
  const refresh = () => setEntries(loadEntries());

  if (!entries) return <div className="card h-64 animate-pulse bg-paper-deep/50" aria-label="Loading journal" />;

  if (entries.length === 0)
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <Creature slug="caterpillar" className="h-32 w-32" />
        <h2 className="mt-3 text-2xl font-semibold">Your journal is waiting for its first page</h2>
        <p className="mt-1 max-w-md text-ink-soft">Finish a friendship mission and your nature memory will appear here. It stays on this device.</p>
        <Link href="/missions" className="btn btn-primary mt-5">Start a mission</Link>
      </div>
    );

  const due = entries.filter((e) => e.revisitOn && e.revisitOn <= today() && !entries.some((x) => x.revisitOf === e.id));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s.slice(-1), id]));

  function exportJournal() {
    const text = entries!
      .map((e) => [`# ${e.title} — ${e.date}`, e.spot && `Spot: ${e.spot}`, e.noticed && `Noticed: ${e.noticed}`, e.surprised && `Surprised: ${e.surprised}`, e.learned && `Learned: ${e.learned}`, e.changed && `Changed: ${e.changed}`, e.same && `Stayed the same: ${e.same}`].filter(Boolean).join("\n"))
      .join("\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = `nature-journal-${today()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-6">
      {due.map((e) => (
        <div key={e.id} className="card flex flex-col gap-3 bg-butter-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-forest">It&apos;s been a few days since you visited {e.spot || e.title}. Want to see what changed?</p>
          <button className="btn btn-primary" onClick={() => setRevisiting(e)}>Return visit</button>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-soft" disabled={selected.length !== 2} onClick={() => {
          const [a, b] = selected.map((id) => entries.find((e) => e.id === id)!).sort((x, y) => x.date.localeCompare(y.date));
          setCompare([a, b]);
        }}>
          Compare {selected.length}/2 pages
        </button>
        <button className="btn btn-ghost" onClick={exportJournal}>Download my journal</button>
      </div>

      <ol className="relative space-y-5 border-l-4 border-dashed border-leaf/30 pl-6">
        <AnimatePresence>
          {entries.map((e) => {
            const f = e.friendSlug ? getFriend(e.friendSlug) : undefined;
            return (
              <motion.li key={e.id} layout initial={{ opacity: 0, y: 10, rotate: -0.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, x: -20 }} className="relative">
                <span className="absolute -left-[2.15rem] top-6 h-4 w-4 rounded-full border-4 border-paper bg-leaf" aria-hidden />
                <article className="card p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    {e.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- local data URL
                      <img src={e.photo} alt={`Photo of ${e.title}`} className="h-24 w-24 rounded-2xl object-cover" />
                    ) : (
                      <Creature slug={f?.slug ?? "dandelion"} className="h-20 w-20" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink-soft">{fmt(e.date)}{e.spot && ` · ${e.spot}`}</p>
                      <h3 className="text-2xl font-semibold">{e.revisitOf ? "Return visit: " : ""}{e.title}</h3>
                      {!e.foundIt && <p className="chip mt-1 bg-sky-soft text-forest">Looked carefully — friend was elsewhere today</p>}
                      <dl className="mt-2 space-y-1">
                        {([["Noticed", e.noticed], ["Surprised by", e.surprised], ["Learned", e.learned], ["What changed", e.changed], ["Stayed the same", e.same]] as const)
                          .filter(([, v]) => v)
                          .map(([k, v]) => <div key={k}><dt className="inline font-bold text-forest">{k}: </dt><dd className="inline">{v}</dd></div>)}
                      </dl>
                      {f && <p className="mt-2 text-sm text-ink-soft"><strong>Fact to remember:</strong> {f.facts[0]}</p>}
                      {e.revisitOn && !e.revisitOf && <p className="mt-1 text-sm text-moss">Return visit planned for {fmt(e.revisitOn)}</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-forest/10 pt-3">
                    <label className="flex min-h-11 cursor-pointer items-center gap-2 font-semibold text-forest">
                      <input type="checkbox" className="h-5 w-5 accent-[var(--color-moss)]" checked={selected.includes(e.id)} onChange={() => toggle(e.id)} />
                      Compare
                    </label>
                    {!e.revisitOf && <button className="btn btn-ghost" onClick={() => setRevisiting(e)}>Visit again</button>}
                    <button className="btn btn-ghost ml-auto text-coral" onClick={() => {
                      if (confirm("Remove this page from your journal? This can't be undone.")) { deleteEntry(e.id); setSelected((s) => s.filter((x) => x !== e.id)); refresh(); }
                    }}>Remove</button>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      {revisiting && (
        <RevisitForm
          of={revisiting}
          onClose={() => setRevisiting(null)}
          onSaved={(n) => { refresh(); setRevisiting(null); setCompare([revisiting, n]); }}
        />
      )}
      {compare && <Compare a={compare[0]} b={compare[1]} onClose={() => setCompare(null)} />}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-forest/40 p-3" onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0, scale: 0.95, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
        className="card max-h-[90dvh] w-full max-w-3xl overflow-y-auto p-5 sm:p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button className="btn btn-ghost" onClick={onClose} autoFocus>Close</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function RevisitForm({ of, onClose, onSaved }: { of: Entry; onClose: () => void; onSaved: (e: Entry) => void }) {
  const [v, setV] = useState({ changed: "", same: "", noticed: "" });
  const [failed, setFailed] = useState(false);
  return (
    <Modal title={`Return visit: ${of.spot || of.title}`} onClose={onClose}>
      <p className="mt-1 text-ink-soft">Go back to the same spot and look again. Plants grow, flowers open and close, visitors come and go.</p>
      <div className="mt-4 space-y-3">
        {([["changed", "What changed since last time?"], ["same", "What stayed the same?"], ["noticed", "Anything new you noticed?"]] as const).map(([k, l]) => (
          <label key={k} className="block">
            <span className="font-bold text-forest">{l}</span>
            <textarea className="field mt-1 min-h-16" maxLength={600} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      {failed && <p role="alert" className="mt-3 rounded-xl bg-coral-soft p-2 font-semibold">Storage is full — the visit wasn&apos;t saved.</p>}
      <button className="btn btn-primary mt-5" onClick={() => {
        const n = addEntry({ date: today(), friendSlug: of.friendSlug, title: of.title, spot: of.spot, noticed: v.noticed, surprised: "", learned: "", foundIt: true, revisitOf: of.id, changed: v.changed, same: v.same });
        if (n) onSaved(n); else setFailed(true);
      }}>Save return visit</button>
    </Modal>
  );
}

function Compare({ a, b, onClose }: { a: Entry; b: Entry; onClose: () => void }) {
  const f = getFriend(b.friendSlug ?? a.friendSlug ?? "");
  const days = Math.round((new Date(b.date).getTime() - new Date(a.date).getTime()) / 864e5);
  return (
    <Modal title="Then and now" onClose={onClose}>
      <p className="mt-1 text-ink-soft">{days === 0 ? "Same day" : `${days} day${days === 1 ? "" : "s"} apart`}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[a, b].map((e, i) => (
          <div key={e.id} className={`rounded-3xl p-4 ${i ? "bg-leaf-soft/60" : "bg-sky-soft"}`}>
            <p className="font-bold text-forest">{i ? "Later" : "First"} · {fmt(e.date)}</p>
            {e.photo
              // eslint-disable-next-line @next/next/no-img-element -- local data URL
              ? <img src={e.photo} alt={`Photo from ${e.date}`} className="mt-2 aspect-square w-full rounded-2xl object-cover" />
              : <Creature slug={e.friendSlug ?? "dandelion"} className="mx-auto mt-2 h-28 w-28" />}
            <p className="mt-2"><strong>Noticed:</strong> {e.noticed || "—"}</p>
          </div>
        ))}
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Box t="What changed" v={b.changed || "Look at both pages — what's different?"} />
        <Box t="What stayed similar" v={b.same || "What is the same in both?"} />
        <Box t="Still a mystery" v="Some changes happen when nobody is watching — at night, or underground. We can't know everything, and that's okay." />
        <Box t="A new question to explore" v={f?.story.question ?? "What might be different if you visit again next week?"} />
      </dl>
    </Modal>
  );
}
const Box = ({ t, v }: { t: string; v: string }) => (
  <div className="rounded-2xl bg-paper-deep/60 p-3"><dt className="font-bold text-forest">{t}</dt><dd>{v}</dd></div>
);
