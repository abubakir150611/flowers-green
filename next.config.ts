import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Seed/demo artwork ships as local SVG placeholders (see scripts/generate-placeholders.mjs).
    // Real product photography uploaded later can be JPEG/PNG/WebP without any config change.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
