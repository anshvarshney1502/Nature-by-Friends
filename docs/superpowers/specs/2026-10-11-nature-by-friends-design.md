# Nature by Friends — Design (hackathon slice plan)

MLH Global Hack Week: Hacktoberfest, "Touch Grass" theme. Core idea: **Become a Friend, Not an Owner.**
Kids 6–10 receive a short outdoor observation mission, put the phone away, then come back and reflect.

## Decisions
- Next.js 16 App Router, TypeScript, Tailwind v4, `motion`, `zod`, `vitest`. No 3D (cut for time).
- Palette from brief (cream paper, leaf, moss, forest, sky, butter, coral, ink). Fonts: Fredoka (display) + Nunito (body).
- All factual content is curated in `lib/content/` (12 profiles). Model output never adds facts or safety advice.
- Journal lives in `localStorage` only. Photos downscaled on device; never uploaded unless the child taps "Ask about this photo" (sent once to `/api/identify`, not stored server-side).
- No accounts, no location, no streaks, no social.
- Every external service is optional; each has a labelled fallback ("Demo mode" / "Read-aloud unavailable").

## Slices (TASKS)
1. [x] Core: tokens, illustrations, 12 profiles, Home, Garden, Profile, Mission journey, Journal (+ Return Visit compare), Stories, Friendship Web, Parents.
2. [x] Photo helper: `lib/ai/*`, `/api/identify` via Google Gemini API (`GEMINI_API_KEY`); switched from self-hosted Gemma because free self-hosting (HF Spaces) now needs PRO. Zod schema, safety filter, curated fallback.
3. [x] ElevenLabs: `lib/audio/elevenlabs.ts`, `/api/audio` with disk cache, `AudioPlayer` (play/pause/replay/speed), text fallback.
4. [x] MongoDB Atlas: optional `MONGODB_URI`; `/api/content` reads `nature_profiles`, seeds from curated JSON, falls back to bundled content.
5. [x] Ship: `/api/health`, rate limit + size limits, `render.yaml`, Vercel notes, `.env.example`, GitHub Actions (lint, typecheck, test, build), README.

## Safety rules (enforced in `lib/safety/validate.ts`, tested)
Reject guidance that tells a child to touch, hold, pick up, catch, chase, keep, feed, dig up, poke, or approach nests/eggs/hives.
Identifications below "likely" are shown as "might be" with "ask a trusted adult".
