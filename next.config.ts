import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pre-generated narration is read from disk by /api/audio; make sure serverless bundles include it.
  outputFileTracingIncludes: { "/api/audio": ["./public/audio/**"] },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
