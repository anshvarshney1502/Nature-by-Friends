import type { Metadata } from "next";
import { FriendshipWeb } from "@/components/ecosystem/FriendshipWeb";

export const metadata: Metadata = { title: "Nature Friendship Web" };

export default function EcosystemPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">The Nature Friendship Web</h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">Nobody in nature lives alone. Tap anyone to see who they&apos;re connected to.</p>
      <div className="mt-6"><FriendshipWeb /></div>
    </div>
  );
}
