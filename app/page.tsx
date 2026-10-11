import Link from "next/link";
import { GardenScene } from "@/components/illustrations/GardenScene";
import { Creature } from "@/components/illustrations/Creature";
import { FadeIn } from "@/components/motion/FadeIn";
import { TourButton } from "@/components/tour/OnboardingTour";

const journey = [
  { n: 1, t: "Meet", d: "Pick a little neighbour." },
  { n: 2, t: "Discover", d: "Get a tiny mission." },
  { n: 3, t: "Respect", d: "Learn their boundaries." },
  { n: 4, t: "Go outside", d: "Phone down, eyes up." },
  { n: 5, t: "Reflect", d: "What did you notice?" },
  { n: 6, t: "Remember", d: "Save a nature memory." },
];

const promises = [
  { slug: "ladybug", t: "We look, we don't touch", d: "Friends give each other space. Watching quietly shows you the most." },
  { slug: "sparrow", t: "Their home stays their home", d: "No catching, no keeping, no peeking in nests." },
  { slug: "earthworm", t: "No finding is fine", d: "Missions are never about rare creatures. Noticing is enough." },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-8 md:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="chip mb-4 bg-leaf-soft text-forest">Become a friend, not an owner</p>
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-[3.4rem]">
            There&apos;s a whole <span className="doodle-underline">little world</span> waiting outside.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Meet tiny neighbours, discover their stories, and learn how to be a kinder friend to nature.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/missions" className="btn btn-primary">Let&apos;s explore</Link>
            <Link href="/garden" className="btn btn-soft">Meet our nature friends</Link>
            <TourButton className="btn btn-ghost" />
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-moss">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            The real discoveries happen outside. This app just points the way.
          </p>
        </div>
        <GardenScene className="drop-shadow-[0_18px_30px_rgba(63,110,44,0.25)]" />
      </section>

      <section aria-labelledby="promise">
        <h2 id="promise" className="text-3xl font-semibold">How friends behave</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {promises.map((p, i) => (
            <FadeIn key={p.slug} delay={i * 0.08}>
              <div className="card flex h-full items-start gap-4 p-5">
                <Creature slug={p.slug} className="h-20 w-20 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold">{p.t}</h3>
                  <p className="mt-1 text-ink-soft">{p.d}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section aria-labelledby="listen" className="grid items-center gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="flex justify-center gap-2">
          {["frog", "sparrow", "grasshopper"].map((s, k) => (
            <div key={s} className="anim-bob" style={{ animationDelay: `${k * 0.5}s` }}><Creature slug={s} className="h-24 w-24 sm:h-28 sm:w-28" /></div>
          ))}
        </div>
        <div>
          <h2 id="listen" className="text-3xl font-semibold">Can you guess who&apos;s singing?</h2>
          <p className="mt-2 text-ink-soft">Play Sound Safari: hear a buzz, a croak or a chirp, and guess which friend made it. Then try the Quiet Minute and listen to the real world.</p>
          <Link href="/listen" className="btn btn-soft mt-4">Open the Listening Corner</Link>
        </div>
      </section>

      <section aria-labelledby="web-h" className="card flex flex-col items-center gap-5 bg-leaf-soft/40 p-6 sm:flex-row md:p-8">
        <div className="flex shrink-0 -space-x-3">
          {["earthworm", "mushroom", "tree"].map((s) => <Creature key={s} slug={s} className="h-20 w-20" />)}
        </div>
        <div>
          <h2 id="web-h" className="text-3xl font-semibold">Nobody in nature lives alone</h2>
          <p className="mt-1 text-ink-soft">Worms feed the soil, fungi help tree roots, bees carry pollen. Explore how all 20 friends help each other.</p>
          <Link href="/ecosystem" className="btn btn-soft mt-4">Open the Friendship Web</Link>
        </div>
      </section>

      <section aria-labelledby="journey" className="card relative overflow-hidden bg-sky-soft p-6 md:p-10">
        <h2 id="journey" className="text-3xl font-semibold">Your friendship journey</h2>
        <p className="mt-2 text-ink-soft">Six small steps. Most of them happen with the phone in your pocket.</p>
        <ol className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {journey.map((s) => (
            <li key={s.n} className={`rounded-3xl border-2 border-dashed p-4 ${s.n === 4 ? "border-leaf bg-leaf-soft" : "border-forest/20 bg-card"}`}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-butter font-[family-name:var(--font-display)] font-semibold text-forest">{s.n}</span>
              <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-forest">{s.t}</p>
              <p className="text-sm text-ink-soft">{s.d}</p>
            </li>
          ))}
        </ol>
        <Link href="/missions" className="btn btn-primary mt-8">Start a mission</Link>
      </section>
    </div>
  );
}
