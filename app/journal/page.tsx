import type { Metadata } from "next";
import { JournalView } from "@/components/journal/JournalView";

export const metadata: Metadata = { title: "Nature Journal" };

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold">My Nature Journal</h1>
      <p className="mt-2 text-lg text-ink-soft">Every page is a memory of being a good friend. Saved only on this device.</p>
      <div className="mt-6"><JournalView /></div>
    </div>
  );
}
