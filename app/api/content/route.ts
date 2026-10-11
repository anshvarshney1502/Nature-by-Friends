import { connection, NextResponse } from "next/server";
import { getProfiles } from "@/lib/db/content";
import { fail, rateLimited } from "@/lib/http";

// Read-only curated content feed (MongoDB Atlas when configured, bundled copy otherwise).
export async function GET(req: Request) {
  await connection();
  if (rateLimited(req, "content", 60)) return fail(429, "rate_limited", "Too many requests");
  const { source, friends } = await getProfiles();
  const slug = new URL(req.url).searchParams.get("slug");
  if (slug) {
    const f = friends.find((x) => x.slug === slug);
    return f ? NextResponse.json({ source, friend: f }) : fail(404, "not_found", "No such friend");
  }
  return NextResponse.json({ source, friends });
}
