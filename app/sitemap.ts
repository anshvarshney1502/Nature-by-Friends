import type { MetadataRoute } from "next";
import { friends } from "@/lib/content/friends";
import { SITE_URL } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/garden", "/missions", "/listen", "/journal", "/stories", "/ecosystem", "/parents"];
  return [...pages, ...friends.map((f) => `/friends/${f.slug}`)].map((p) => ({ url: `${SITE_URL}${p}` }));
}
