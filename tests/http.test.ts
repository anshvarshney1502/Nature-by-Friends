import { describe, expect, it } from "vitest";
import { clientIp, originAllowed, rateLimited } from "@/lib/http";

// Render forwards https://app.onrender.com to an internal http://localhost:10000 URL.
const proxied = (origin: string | null, method = "POST") =>
  new Request("http://localhost:10000/api/audio", {
    method,
    headers: { host: "nature-by-friends.onrender.com", ...(origin ? { origin } : {}) },
  });

describe("originAllowed", () => {
  it("allows the site's own origin behind a proxy", () => {
    expect(originAllowed(proxied("https://nature-by-friends.onrender.com"))).toBe(true);
  });
  it("allows GET requests with no Origin header", () => {
    expect(originAllowed(proxied(null, "GET"))).toBe(true);
  });
  it("rejects other sites", () => {
    expect(originAllowed(proxied("https://evil.example"))).toBe(false);
    expect(originAllowed(proxied("not a url"))).toBe(false);
  });
});

describe("clientIp", () => {
  const r = (h: Record<string, string>) => new Request("http://x/", { headers: h });
  it("on Render uses Cloudflare's unspoofable header, ignoring a forged X-Forwarded-For", () => {
    expect(clientIp(r({ "x-forwarded-for": "6.6.6.6, 1.2.3.4", "cf-connecting-ip": "1.2.3.4" }), { RENDER: "true" })).toBe("1.2.3.4");
  });
  it("on Vercel uses x-real-ip", () => {
    expect(clientIp(r({ "x-forwarded-for": "6.6.6.6", "x-real-ip": "5.5.5.5" }), { VERCEL: "1" })).toBe("5.5.5.5");
  });
});

describe("rateLimited", () => {
  it("global cap stops many different IPs", () => {
    let blocked = 0;
    for (let i = 0; i < 20; i++) if (rateLimited(new Request("http://x/", { headers: { "x-forwarded-for": `9.9.9.${i}` } }), "t-global", 100, 10)) blocked++;
    expect(blocked).toBe(10);
  });
});

describe("originAllowed for POST", () => {
  it("rejects a POST with no Origin (not a browser)", () => {
    expect(originAllowed(new Request("http://localhost:10000/api/identify", { method: "POST", headers: { host: "nature-by-friends.onrender.com" } }))).toBe(false);
  });
});
