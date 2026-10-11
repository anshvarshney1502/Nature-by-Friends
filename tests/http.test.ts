import { describe, expect, it } from "vitest";
import { originAllowed } from "@/lib/http";

// Render forwards https://app.onrender.com to an internal http://localhost:10000 URL.
const proxied = (origin: string | null) =>
  new Request("http://localhost:10000/api/audio", {
    method: "POST",
    headers: { host: "nature-by-friends.onrender.com", ...(origin ? { origin } : {}) },
  });

describe("originAllowed", () => {
  it("allows the site's own origin behind a proxy", () => {
    expect(originAllowed(proxied("https://nature-by-friends.onrender.com"))).toBe(true);
  });
  it("allows requests with no Origin header", () => {
    expect(originAllowed(proxied(null))).toBe(true);
  });
  it("rejects other sites", () => {
    expect(originAllowed(proxied("https://evil.example"))).toBe(false);
    expect(originAllowed(proxied("not a url"))).toBe(false);
  });
});
