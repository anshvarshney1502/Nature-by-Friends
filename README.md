# Nature by Friends

**Become a Friend, Not an Owner.** Meet the little lives that share your world.

A storybook-style web app for children aged 6–10, built for MLH Global Hack Week: Hacktoberfest ("Touch Grass" theme).
Kids pick a little neighbour, get a short outdoor mission, learn its boundaries, put the phone away, then come back and save a nature memory.

## What's in it

| Route | What it does |
|---|---|
| `/` | Illustrated garden welcome, the "how friends behave" promises, and a preview of the journey |
| `/garden` | 12 curated friends with search, category filters, category activities, "Surprise me" |
| `/friends/[slug]` | Profile: facts, habitat, why it matters, safe watching, what not to do, mission, related friends, read-aloud |
| `/missions` | 6-step journey: Meet, Discover, Respect, Go outside, Reflect, Remember. Optional photo helper. Progress survives closing the app |
| `/journal` | Local timeline, return visits with a "Then and now" comparison, opt-in revisit notes, text export |
| `/stories` | 12 tiny stories that mark real facts (leaf) apart from imagination (spark), with read-aloud |
| `/ecosystem` | Friendship Web: SVG node graph with 16 curated relationships |
| `/parents` | Purpose, safety, AI limits, privacy, and what hasn't been reviewed |
| `/api/identify` | Photo, then Gemma (OpenAI-compatible endpoint), then zod schema, then safety sanitizer, then a designed result |
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

### Gemma photo helper (optional)
```bash
ollama pull gemma4:e4b          # small Gemma 4 variant with image input, ~6 GB RAM
GEMMA_API_BASE_URL=http://localhost:11434/v1 GEMMA_MODEL=gemma4:e4b npm run dev
```
Any OpenAI-compatible endpoint serving a vision-capable Gemma works (vLLM, LM Studio, hosted). Your laptop's Ollama is **not** reachable from a Render or Vercel deployment. A public demo needs a hosted endpoint.

### ElevenLabs (optional)
Put `ELEVENLABS_API_KEY` in `.env.local` (git-ignored). The narrator voice defaults to `EeQEodFZVtBkjtgK3HBc`; override with `ELEVENLABS_VOICE_ID`. To pre-generate the ~37 clips (about 12k characters) into `public/audio/` so visitors don't spend credits:
```bash
npm run audio:generate   # reads .env.local
```

### MongoDB Atlas (optional)
```bash
npm run seed:mongo   # reads MONGODB_URI from .env.local;   # creates nature_profiles with a $jsonSchema validator, upserts 12 profiles
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
Render (paid plans), hosted Gemma inference, ElevenLabs characters, and MongoDB Atlas above the free tier. Free tiers change, so check them before the demo.

## Honest status
- Integrations are tested with **mocked** HTTP only. A live Gemma, ElevenLabs or Atlas call has not been verified in this repo, so verify with real credentials before claiming it works.
- In-memory rate limiting is per instance.
- Content has not been reviewed by an ecologist, and the app has had no legal or privacy compliance review.
- English only. Content is plain TypeScript data, ready to be split per locale.
