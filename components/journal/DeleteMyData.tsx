"use client";
import { useState } from "react";
import { isAppKey } from "@/lib/storage/progress";

/** Lets a grown-up wipe everything this app stored in the browser. */
export function DeleteMyData() {
  const [done, setDone] = useState(false);
  function wipe() {
    if (!confirm("Delete the journal, progress, photos and settings saved by Nature by Friends in this browser? This can't be undone.")) return;
    try {
      Object.keys(localStorage).filter(isAppKey).forEach((k) => localStorage.removeItem(k));
      setDone(true);
    } catch {
      alert("This browser blocked access to storage, so nothing could be deleted here.");
    }
  }
  return done ? (
    <p role="status" className="font-semibold text-forest">All Nature by Friends data has been deleted from this browser.</p>
  ) : (
    <button className="btn btn-soft" onClick={wipe}>Delete all my data from this browser</button>
  );
}
