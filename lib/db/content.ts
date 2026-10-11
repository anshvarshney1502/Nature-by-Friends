import { MongoClient } from "mongodb";
import { z } from "zod";
import { friends as bundled } from "@/lib/content/friends";
import type { Friend } from "@/lib/content/types";

// Curated profiles can be edited in MongoDB Atlas (collection `nature_profiles`) without a redeploy.
// The bundled copy is always the fallback, so the app never depends on the database being up.

const friendSchema = z.object({
  slug: z.string(), name: z.string(), nickname: z.string(),
  category: z.enum(["tiny", "birds", "pollinators", "plants", "trees", "soil"]),
  tagline: z.string(), description: z.string(), facts: z.array(z.string()), habitat: z.string(),
  mightBeDoing: z.array(z.string()), whyItMatters: z.string(), safeWatching: z.array(z.string()), dontDo: z.array(z.string()),
  mission: z.object({ title: z.string(), steps: z.array(z.string()), ifNothingFound: z.string() }),
  related: z.array(z.string()),
  story: z.object({ title: z.string(), parts: z.array(z.object({ kind: z.enum(["fact", "imagine"]), text: z.string() })), question: z.string() }),
});

let client: Promise<MongoClient> | null = null;
function db() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  client ??= new MongoClient(uri, { serverSelectionTimeoutMS: 2500, connectTimeoutMS: 2500, maxPoolSize: 5 })
    .connect()
    .catch((e) => { client = null; throw e; });
  return client.then((c) => c.db(process.env.MONGODB_DATABASE || "nature_by_friends"));
}

export async function getProfiles(): Promise<{ source: "mongodb" | "bundled"; friends: Friend[] }> {
  const conn = db();
  if (!conn) return { source: "bundled", friends: bundled };
  try {
    const docs = await (await conn).collection("nature_profiles").find({ published: true }, { projection: { _id: 0, published: 0 } }).limit(100).maxTimeMS(2000).toArray();
    const valid = docs.flatMap((d) => { const p = friendSchema.safeParse(d); return p.success ? [p.data] : []; });
    return valid.length ? { source: "mongodb", friends: valid } : { source: "bundled", friends: bundled };
  } catch (e) {
    console.error("[content] MongoDB unavailable, using bundled content:", e instanceof Error ? e.message : e);
    return { source: "bundled", friends: bundled };
  }
}

export { friendSchema };
