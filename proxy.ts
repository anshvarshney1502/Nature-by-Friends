import { NextResponse, type NextRequest } from "next/server";
import { friends } from "@/lib/content/friends";

const slugs = new Set(friends.map((f) => f.slug));

// Streamed pages can't change their status after rendering starts, so unknown friends
// are rewritten to a missing route here and get a real 404 with the friendly not-found page.
export function proxy(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/")[2];
  if (!slugs.has(slug)) return NextResponse.rewrite(new URL("/__missing", req.url));
}

export const config = { matcher: "/friends/:slug" };
