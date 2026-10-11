import type { Metadata } from "next";
import { SoundSafari } from "@/components/audio/SoundSafari";
import { QuietMinute } from "@/components/audio/QuietMinute";

export const metadata: Metadata = { title: "Listening Corner" };

export default function ListenPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">The Listening Corner</h1>
        <p className="mt-2 text-lg text-ink-soft">Nature is full of sounds. Train your ears here, then go and hear the real thing outside.</p>
      </div>
      <section id="safari" aria-labelledby="safari-h" className="card scroll-mt-24 p-5 sm:p-8">
        <h2 id="safari-h" className="text-3xl font-semibold">Sound Safari</h2>
        <div className="mt-4"><SoundSafari /></div>
      </section>
      <section id="quiet" aria-labelledby="quiet-h" className="card scroll-mt-24 bg-sky-soft p-5 sm:p-8">
        <h2 id="quiet-h" className="text-center text-3xl font-semibold">The Quiet Minute</h2>
        <div className="mt-4"><QuietMinute /></div>
      </section>
      <p className="text-center text-sm text-ink-soft">All sounds and the narrator&apos;s voice were made with ElevenLabs.</p>
    </div>
  );
}
