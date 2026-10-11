"use client";
import { useState } from "react";
import type { IdentifyResponse, IdentifyResult } from "@/lib/ai/schemas";
import { downscale } from "@/lib/image";

const wording = {
  likely: "This looks like it could be",
  maybe: "This might be",
  unsure: "We're not sure what this is.",
} as const;

export function PhotoHelper({
  photo,
  onPhoto,
  onResult,
  onUse,
}: {
  photo?: string;
  onPhoto: (p: string | undefined) => void;
  onResult: (r: IdentifyResult) => void;
  onUse: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<IdentifyResponse | null>(null);

  async function pick(file?: File) {
    setError(null);
    setRes(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("That doesn't look like a photo. Try a picture file.");
    try {
      onPhoto(await downscale(file));
    } catch {
      setError("We couldn't open that photo. Try another one.");
    }
  }

  async function ask() {
    if (!photo) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/identify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ image: photo }) });
      if (r.status === 429) throw new Error("Lots of explorers right now. Try again in a minute.");
      if (!r.ok) throw new Error("Our helper couldn't look at the photo. You can still pick a friend above.");
      const data = (await r.json()) as IdentifyResponse;
      setRes(data);
      onResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const r = res?.result;
  return (
    <div className="card p-5">
      <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-forest">Have a photo? (optional)</p>
      <p className="text-sm text-ink-soft">A grown-up can help. The photo is shrunk on this device first.</p>
      <label className="btn btn-soft mt-3 cursor-pointer">
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        {photo ? "Choose a different photo" : "Choose a photo"}
      </label>

      {photo && (
        <div className="mt-4 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
          <img src={photo} alt="Your chosen photo" className="h-24 w-24 rounded-2xl object-cover" />
          {!r && (
            <div>
              <button className="btn btn-primary" onClick={ask} disabled={busy} aria-busy={busy}>
                {busy ? "Looking closely…" : "Ask about this photo"}
              </button>
              <p className="mt-1 text-xs text-ink-soft">Sends this small photo once to our nature helper. It isn&apos;t stored on a server.</p>
            </div>
          )}
        </div>
      )}

      {error && <p role="alert" className="mt-3 rounded-xl bg-coral-soft p-2 text-sm font-semibold">{error}</p>}

      {r && res && (
        <div className="mt-4 rounded-2xl bg-sky-soft p-4" role="status">
          {res.mode !== "live" && (
            <p className="chip mb-2 bg-butter text-forest">{res.mode === "demo" ? "Demo mode — not a real identification" : "Helper unavailable — using a safe mission"}</p>
          )}
          <p className="text-lg font-semibold text-forest">
            {r.possibleIdentification && r.confidenceLabel !== "unsure"
              ? `${wording[r.confidenceLabel]} a ${r.possibleIdentification.toLowerCase()}.`
              : wording.unsure}
          </p>
          <p className="mt-1">{r.childFriendlyExplanation}</p>
          {r.visibleEvidence.length > 0 && (
            <p className="mt-1 text-sm text-ink-soft">Clues: {r.visibleEvidence.join(", ")}</p>
          )}
          {(r.needsAdultHelp || r.confidenceLabel !== "likely") && (
            <p className="mt-2 font-semibold text-coral">Not sure? Ask a trusted adult before getting any closer.</p>
          )}
          {res.notice && <p className="mt-1 text-xs text-ink-soft">{res.notice}</p>}
          <button className="btn btn-primary mt-3" onClick={onUse}>Use this mission</button>
        </div>
      )}
    </div>
  );
}
