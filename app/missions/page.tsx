import type { Metadata } from "next";
import { Suspense } from "react";
import { MissionJourney } from "@/components/missions/MissionJourney";

export const metadata: Metadata = { title: "Become a Friend" };

export default function MissionsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold">Become a Friend, <span className="text-leaf">not an Owner</span></h1>
      <p className="mt-2 text-lg text-ink-soft">A tiny outdoor mission in six steps.</p>
      <div className="mt-6">
        <Suspense fallback={<div className="card h-96 animate-pulse bg-paper-deep/50" />}>
          <MissionJourney />
        </Suspense>
      </div>
    </div>
  );
}
