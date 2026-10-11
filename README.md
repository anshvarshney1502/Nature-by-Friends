# Nature by Friends

**Become a Friend, Not an Owner.** Meet the little lives that share your world.

A storybook-style web app for children aged 6–10, built for MLH Global Hack Week: Hacktoberfest ("Touch Grass" theme).
Kids pick a little neighbour, get a short outdoor mission, learn its boundaries, put the phone away, then come back and save a nature memory.

## What's in it

| Route | What it does |
|---|---|
| `/` | Illustrated garden welcome, the "how friends behave" promises, and a preview of the journey |
| `/garden` | 20 curated friends with search, category filters, category activities, "Surprise me" |
| `/friends/[slug]` | Profile: facts, habitat, why it matters, safe watching, what not to do, mission, related friends, read-aloud |
| `/missions` | 6-step journey: Meet, Discover, Respect, Go outside, Reflect, Remember. Optional photo helper. Progress survives closing the app |
| `/journal` | Local timeline, return visits with a "Then and now" comparison, opt-in revisit notes, text export |
| `/stories` | 20 tiny stories that mark real facts (leaf) apart from imagination (spark), with read-aloud |
| `/listen` | Listening Corner: Sound Safari (hear a creature, guess who, narrator reveals a fact) and the Quiet Minute guided listening |
| `/ecosystem` | Friendship Web: SVG node graph with 16 curated relationships |
| `/parents` | Purpose, safety, AI limits, privacy, and what hasn't been reviewed |
| `/api/identify` | Photo, then Google Gemini API, then zod schema, then safety sanitizer, then a designed result |
| `/api/audio` | ElevenLabs narration of curated text only, cached; the client falls back to the device voice |
| `/api/content` | Curated profiles from MongoDB Atlas, or the bundled copy if Atlas is unset or down |
| `/api/health` | Shows which optional services are configured |

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # vitest: safety, journal, AI sanitizer, API routes (external services mocked)
npm run lint && npm run typecheck && npm run build
```

No environment variables are needed. See `.env.example` for the optional services.

### Gemini photo helper (optional)
Create a key at https://aistudio.google.com/apikey and put `GEMINI_API_KEY=...` in `.env.local` (and in Render's env vars). Default model is **Gemma 4** (`gemma-4-26b-a4b-it`, open weights) served by the Gemini API; if it errors, the request is retried once on `gemini-flash-lite-latest`. Override with `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL`. On Google's free tier, submitted content may be used by Google to improve its services; the Parents page says so.

### ElevenLabs (optional)
Put `ELEVENLABS_API_KEY` in `.env.local` (git-ignored). The narrator voice defaults to `EeQEodFZVtBkjtgK3HBc`; override with `ELEVENLABS_VOICE_ID`. To pre-generate the ~37 clips (about 12k characters) into `public/audio/` so visitors don't spend credits:
```bash
npm run audio:generate   # reads .env.local
```

### ElevenLabs sound (all pre-generated, zero runtime credits)
- **Nature soundscape:** 3 looping scenes (chirpy garden, rain on soil, evening crickets) from the Sound Effects API. On by default; it starts at the first tap (browsers block earlier audio), matches the page, and ducks under the narrator.
- **Hear me:** 20 creature clips. Real calls for animals that make sounds; for quiet ones, the sound of where they live (labelled honestly).
- **Sound Safari:** 7 creature calls plus narrator reveals in the same voice.
- **Quiet Minute:** about 40 s of guided outdoor listening in the narrator voice, using ElevenLabs break tags for pauses.
- **Narration:** profiles, missions and stories (`npm run audio:generate`). Everything else: `npm run sounds:generate`. Both skip files that already exist.

### MongoDB Atlas (optional)
```bash
npm run seed:mongo   # reads MONGODB_URI from .env.local;   # creates nature_profiles with a $jsonSchema validator, upserts all curated profiles
```
Give the deployed app a **read-only** database user. Pages are statically rendered from the bundled content. Atlas backs `/api/content` so profiles can be edited without a redeploy. Vector Search is not used.

## Safety design
- All facts, safety advice, stories and ecosystem links are hand-written in `lib/content/`.
- Model output is never trusted (`lib/ai/safety.ts`):
  - It is schema-validated.
  - Slugs we have no curated content for are dropped.
  - An identification without a name is downgraded to "unsure".
  - Risky names (wasp, spider, mushroom…) trigger "ask a trusted adult".
  - Any instruction to touch, catch, chase, feed, dig or approach a nest (`lib/safety/validate.ts`) swaps in a curated mission.
  - Safety guidance always comes from curated content.
- There is no free-text AI chat for children.
- The journal stays in `localStorage`. Photos are downscaled on-device, and re-encoding strips EXIF and GPS data. A photo is sent once, only when the child taps "Ask about this photo", and is never stored on the server.
- There are no accounts, location, streaks, points or social features.

## Deploy

**Render:** New, then Blueprint, then select this repo (`render.yaml`). Set secrets in the dashboard. The health check is `/api/health`. The default plan in the blueprint is `starter`, which is paid. Switch it to `free` if you accept cold starts.

**Vercel:** Import the repo. The framework preset is Next.js and needs no config. Add the same env vars. Runtime audio caching is ephemeral on both hosts, so commit pre-generated `public/audio/*.mp3` for the demo.

## Services that may cost money
Render (paid plans), Gemini API usage above the free tier, ElevenLabs characters, and MongoDB Atlas above the free tier. Free tiers change, so check them before the demo.

## Honest status
- Integrations are tested with **mocked** HTTP only. ElevenLabs and MongoDB Atlas have been verified live; the Gemini photo helper still needs a key and a live test.
- In-memory rate limiting is per instance.
- Content has not been reviewed by an ecologist, and the app has had no legal or privacy compliance review.
- English only. Content is plain TypeScript data, ready to be split per locale.
