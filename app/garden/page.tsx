import type { Metadata } from "next";
import { GardenBrowser } from "@/components/nature/GardenBrowser";

export const metadata: Metadata = { title: "Nature Garden" };

export default function GardenPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">The Nature Garden</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">Twenty little neighbours you might meet outside. Tap one to learn how to be a good friend to it.</p>
      <div className="mt-6"><GardenBrowser /></div>
    </div>
  );
}
