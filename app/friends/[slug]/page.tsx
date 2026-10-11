import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { friends, getCategory, getFriend } from "@/lib/content/friends";
import { Creature } from "@/components/illustrations/Creature";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { FadeIn } from "@/components/motion/FadeIn";
import { profileText } from "@/lib/content/narration";
import { HearMe } from "@/components/audio/HearMe";

export const generateStaticParams = () => friends.map((f) => ({ slug: f.slug }));
// Every profile is prebuilt, so blocking on params is instant in practice.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/friends/[slug]">): Promise<Metadata> {
  const f = getFriend((await params).slug);
  return { title: f?.name ?? "Friend" };
}

function Section({ title, children, tone = "bg-card" }: { title: string; children: React.ReactNode; tone?: string }) {
  return (
    <FadeIn>
      <section className={`card h-full p-5 ${tone}`}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="mt-2">{children}</div>
      </section>
    </FadeIn>
  );
}

export default async function FriendPage({ params }: PageProps<"/friends/[slug]">) {
  const f = getFriend((await params).slug);
  if (!f) notFound();
  const cat = getCategory(f.category);

  return (
    <article className="space-y-6">
      <Link href="/garden" className="btn-ghost inline-flex items-center font-bold">← Back to the garden</Link>
      <header className="grid items-center gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="card grid aspect-square place-items-center bg-sky-soft">
          <Creature slug={f.slug} className="anim-bob h-4/5 w-4/5" label={`Illustration of a ${f.name.toLowerCase()}`} />
        </div>
        <div>
          <p className="chip bg-leaf-soft text-forest">{cat?.name}</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{f.name}</h1>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-moss">{f.tagline}</p>
          <p className="mt-4 max-w-2xl text-lg">{f.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href={`/missions?friend=${f.slug}`} className="btn btn-primary">Start an observation</Link>
            <AudioPlayer text={profileText(f)} label="Listen" />
          </div>
          <div className="mt-3"><HearMe slug={f.slug} name={f.name} /></div>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Interesting facts">
          <ul className="space-y-2">{f.facts.map((x) => <li key={x} className="flex gap-2"><Dot />{x}</li>)}</ul>
        </Section>
        <Section title="Where it lives" tone="bg-sky-soft">
          <p>{f.habitat}</p>
          <h3 className="mt-4 text-lg font-semibold">It might be…</h3>
          <ul className="mt-1 flex flex-wrap gap-2">{f.mightBeDoing.map((x) => <li key={x} className="chip bg-card text-forest">{x}</li>)}</ul>
        </Section>
        <Section title="Why it matters" tone="bg-butter-soft">
          <p>{f.whyItMatters}</p>
        </Section>
        <Section title="Being a good friend" tone="bg-leaf-soft/70">
          <ul className="space-y-2">{f.safeWatching.map((x) => <li key={x} className="flex gap-2"><Check />{x}</li>)}</ul>
          <h3 className="mt-4 text-lg font-semibold text-coral-ink">Please don&apos;t</h3>
          <ul className="mt-1 space-y-1.5">{f.dontDo.map((x) => <li key={x} className="flex gap-2"><Cross />{x}</li>)}</ul>
        </Section>
      </div>

      <FadeIn>
        <section className="card flex flex-col gap-4 bg-paper-deep/70 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="chip bg-butter text-forest">Mission</p>
            <h2 className="mt-2 text-2xl font-semibold">{f.mission.title}</h2>
            <p className="text-ink-soft">{f.mission.steps[0]}</p>
          </div>
          <Link href={`/missions?friend=${f.slug}`} className="btn btn-primary shrink-0">Try this mission</Link>
        </section>
      </FadeIn>

      <section>
        <h2 className="text-2xl font-semibold">Neighbours of the {f.name.toLowerCase()}</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {f.related.map((s) => getFriend(s)).filter(Boolean).map((r) => (
            <li key={r!.slug}>
              <Link href={`/friends/${r!.slug}`} className="card flex items-center gap-2 py-2 pl-2 pr-4 font-semibold text-forest hover:bg-butter-soft">
                <Creature slug={r!.slug} className="h-12 w-12" />{r!.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-x-6">
          <Link href={`/stories#${f.slug}`} className="btn-ghost inline-flex font-bold">Read “{f.story.title}” →</Link>
          <Link href={`/ecosystem#${f.slug}`} className="btn-ghost inline-flex font-bold">See who the {f.name.toLowerCase()} helps →</Link>
        </div>
      </section>
    </article>
  );
}

const Dot = () => <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-leaf" />;
const Check = () => (
  <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-moss" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden><path d="m5 12 5 5 9-10" /></svg>
);
const Cross = () => (
  <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-coral-ink" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
);
