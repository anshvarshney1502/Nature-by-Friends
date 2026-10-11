import type { Metadata } from "next";
import { friendRules } from "@/lib/content/general";
import { DeleteMyData } from "@/components/journal/DeleteMyData";

export const metadata: Metadata = { title: "For parents & educators" };

const sections: { h: string; p: React.ReactNode }[] = [
  {
    h: "What this is for",
    p: "Nature by Friends helps children aged roughly 6–10 build a caring relationship with the living things around them. Instead of collecting or catching, children practise patient observation, respect for boundaries, and noticing how living things depend on each other.",
  },
  {
    h: "How a mission works",
    p: "A child picks a creature or plant (or a listening mission), reads or hears a short mission, learns the boundaries, then puts the device away and goes outside with a trusted adult. Afterwards they can write a short reflection. Missions never require finding a particular animal, touching anything, uploading a photo, or spending a minimum time on screen. There are no streaks, points or leaderboards.",
  },
  {
    h: "Safety principles",
    p: (
      <>
        Every mission repeats these rules:
        <ul className="mt-2 list-disc space-y-1 pl-6">{friendRules.map((r) => <li key={r}>{r}</li>)}</ul>
        <p className="mt-2">Please supervise outdoor exploration, especially near roads, water, or animals that may sting or bite.</p>
      </>
    ),
  },
  {
    h: "Where facts come from",
    p: "All creature facts, safety guidance, stories and ecosystem connections are written in advance and kept in the app. Stories clearly separate real facts from imaginative parts, and never claim to know what an animal is thinking or feeling.",
  },
  {
    h: "Photos and the nature helper (AI)",
    p: (
      <>
        Photos are optional. When a child chooses a photo, it is shrunk on the device (which also strips location data embedded in the file). It is only sent to our nature helper — Google’s Gemma 4 open model, served through the Gemini API (with Gemini as a backup) — if the child taps “Ask about this photo”. It is not stored on our server. On Google’s free tier, Google may use submitted content to improve its services, so please only send photos of plants and animals, never of people.
        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li>The helper can be wrong. Its answer is shown as “might be” or “not sure”, never as a confirmed identification.</li>
          <li>Its confidence label is the model&apos;s own estimate, not a measured accuracy.</li>
          <li>Its suggestions are checked automatically; any instruction to touch, catch, feed or disturb wildlife is removed and replaced with a pre-written mission. Safety advice always comes from our own written content, never from the model.</li>
          <li>There is no open chat. Children cannot type questions to the AI.</li>
          <li>If the helper isn&apos;t set up, the app says so (“Demo mode”) and offers a safe mission instead.</li>
        </ul>
      </>
    ),
  },
  {
    h: "Privacy and storage",
    p: (
      <ul className="list-disc space-y-1 pl-6">
        <li>No accounts, names, emails, schools or locations are collected.</li>
        <li>The Nature Journal is saved only in this browser (localStorage). Clearing browser data deletes it. You can download it as a text file.</li>
        <li>“Spot nicknames” are free text — please help children avoid writing addresses.</li>
        <li>Read-aloud sends only the app&apos;s own written text to a voice service, never anything a child typed.</li>
        <li>Gentle background nature sounds start after the first tap. Turn them off with the “Nature sounds” button at the top; the app remembers. They are pre-made audio files, so playing them sends nothing anywhere.</li>
        <li>Progress (friends met, sounds learned, quiet minutes) and the guided-tour status are also kept only in this browser.</li>
        <li>No advertising or third-party tracking.</li>
        <li className="list-none pt-2"><DeleteMyData /></li>
        <li>Return-visit reminders are opt-in and only appear inside the journal. The app never sends notifications.</li>
      </ul>
    ),
  },
  {
    h: "Good to know",
    p: "Nature by Friends has not had a formal legal or child-privacy compliance review, and its nature content has not been reviewed by a professional ecologist. Please use it as a companion to, not a replacement for, adult guidance.",
  },
];

export default function ParentsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold">For parents &amp; educators</h1>
      <p className="mt-2 text-lg text-ink-soft">How Nature by Friends works, what it does with information, and its limits.</p>
      <div className="mt-8 space-y-5">
        {sections.map((s) => (
          <section key={s.h} className="card p-6">
            <h2 className="text-2xl font-semibold">{s.h}</h2>
            <div className="mt-2 text-ink">{s.p}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
