import { connection, NextResponse } from "next/server";
import { elevenlabsConfigured } from "@/lib/audio/elevenlabs";

// Reports which optional services are configured. Does not call them (keeps health checks free).
export async function GET() {
  await connection(); // read env at request time, not build time
  return NextResponse.json({
    ok: true,
    services: {
      gemini: process.env.GEMINI_API_KEY ? "configured" : "demo",
      elevenlabs: elevenlabsConfigured() ? "configured" : "device-voice-fallback",
      mongodb: process.env.MONGODB_URI ? "configured" : "bundled-content",
    },
  });
}
