// Seeds MongoDB Atlas with the curated profiles and a $jsonSchema validator.
// Usage: MONGODB_URI=... npx tsx scripts/seed-mongo.ts
// Use a user with readWrite on this one database for seeding; give the app a read-only user.
import { MongoClient } from "mongodb";
import { friends } from "../lib/content/friends";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Set MONGODB_URI");
const client = await new MongoClient(uri).connect();
const db = client.db(process.env.MONGODB_DATABASE || "nature_by_friends");

const validator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["slug", "name", "category", "description", "facts", "safeWatching", "dontDo", "mission", "published"],
    properties: {
      slug: { bsonType: "string", pattern: "^[a-z-]+$" },
      category: { enum: ["tiny", "birds", "pollinators", "plants", "trees", "soil"] },
      facts: { bsonType: "array", items: { bsonType: "string" } },
      published: { bsonType: "bool" },
    },
  },
};
const exists = (await db.listCollections({ name: "nature_profiles" }).toArray()).length > 0;
if (exists) await db.command({ collMod: "nature_profiles", validator });
else await db.createCollection("nature_profiles", { validator });
await db.collection("nature_profiles").createIndex({ slug: 1 }, { unique: true });

for (const f of friends) {
  await db.collection("nature_profiles").updateOne({ slug: f.slug }, { $set: { ...f, published: true } }, { upsert: true });
}
await db.collection("content_versions").insertOne({ collection: "nature_profiles", count: friends.length, at: new Date() });
console.log(`Seeded ${friends.length} profiles.`);
await client.close();
