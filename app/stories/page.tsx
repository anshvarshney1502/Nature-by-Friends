import type { Metadata } from "next";
import Link from "next/link";
import { friends } from "@/lib/content/friends";
import { Creature } from "@/components/illustrations/Creature";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { FadeIn } from "@/components/motion/FadeIn";
import { storyText } from "@/lib/content/narration";

export const metadata: Metadata = { title: "Tiny Nature Stories" };

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold">Tiny Nature Stories</h1>
      <p className="mt-2 text-lg text-ink-soft">Short stories about our neighbours. Look for the leaf: those parts are real facts.</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <span className="chip bg-leaf-soft text-forest"><Leaf /> Real fact</span>
        <span className="chip bg-butter-soft text-forest"><Spark /> Story imagination</span>
      </div>
      <nav aria-label="Stories" className="mt-6 flex flex-wrap gap-2">
        {friends.map((f) => (
          <a key={f.slug} href={`#${f.slug}`} className="chip min-h-11 border-2 border-forest/10 bg-card px-3 text-forest hover:bg-butter-soft">{f.nickname}</a>
        ))}
      </nav>
      <div className="mt-8 space-y-8">
        {friends.map((f) => (
          <FadeIn key={f.slug}>
            <article id={f.slug} className="card scroll-mt-24 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <Creature slug={f.slug} className="h-24 w-24 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-ink-soft">A story about a {f.name.toLowerCase()}</p>
                  <h2 className="text-3xl font-semibold">{f.story.title}</h2>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-lg">
                {f.story.parts.map((p) => (
                  <p key={p.text} className={`flex gap-3 rounded-2xl p-3 ${p.kind === "fact" ? "bg-leaf-soft/50" : "bg-butter-soft/50 italic"}`}>
                    <span className="mt-1.5 shrink-0">{p.kind === "fact" ? <Leaf label="Real fact" /> : <Spark label="Imagination" />}</span>
                    {p.text}
                  </p>
                ))}
              </div>
              <p className="mt-5 rounded-2xl border-2 border-dashed border-leaf/40 p-4 font-semibold text-forest">
                Next time you&apos;re outside: {f.story.question}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <AudioPlayer text={storyText(f)} label="Listen to the story" />
                <Link href={`/missions?friend=${f.slug}`} className="btn btn-ghost">Go on a mission</Link>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function Leaf({ label }: { label?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-moss" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Zm0 0 9-9" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function Spark({ label }: { label?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#c9a440]" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" fill="currentColor" />
    </svg>
  );
}
