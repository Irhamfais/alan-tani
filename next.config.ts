import type { NextConfig } from "next";
import config from "./data/config.json";

// Same rule as lib/env.ts: NEXT_PUBLIC_SITE_URL wins, data/config.json is the fallback.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || config.siteUrl).replace(/\/+$/, "");
const siteHost = new URL(siteUrl).host;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [70, 75],
  },
  // Serve the site from one address only: www.<domain> permanently redirects to <domain>.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${siteHost}` }],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
