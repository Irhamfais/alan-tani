import type { NextConfig } from "next";
import config from "./data/config.json";

const siteHost = new URL(config.siteUrl).host;

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
        destination: `${config.siteUrl}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
