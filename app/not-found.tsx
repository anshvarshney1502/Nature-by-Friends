import Link from "next/link";
import { Creature } from "@/components/illustrations/Creature";

export default function NotFound() {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center p-10 text-center">
      <Creature slug="snail" className="h-32 w-32" />
      <h1 className="mt-4 text-3xl font-semibold">This path wandered off</h1>
      <p className="mt-2 text-ink-soft">Even snails take wrong turns. Let&apos;s head back to the garden.</p>
      <Link href="/garden" className="btn btn-primary mt-6">Back to the garden</Link>
    </div>
  );
}
