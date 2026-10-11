import Link from "next/link";
import type { Friend } from "@/lib/content/types";
import { Creature } from "@/components/illustrations/Creature";

export function FriendCard({ friend }: { friend: Friend }) {
  return (
    <Link
      href={`/friends/${friend.slug}`}
      className="card group flex h-full flex-col p-4 transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-0.5deg]"
    >
      <div className="grid aspect-square place-items-center rounded-[1.5rem] bg-paper-deep/60">
        <Creature slug={friend.slug} className="h-3/4 w-3/4 transition-transform duration-300 group-hover:scale-105" />
      </div>
      <h3 className="mt-3 text-xl font-semibold">{friend.name}</h3>
      <p className="mb-auto text-sm text-ink-soft">{friend.tagline}</p>
      <p className="chip mt-3 self-start whitespace-nowrap bg-leaf-soft text-xs text-forest sm:text-sm">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
        Look-only friend
      </p>
    </Link>
  );
}
