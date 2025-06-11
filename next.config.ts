import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/maps/api/staticmap',
      },
    ],
  },
  turbopack: {
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/api/be/:path*",
        destination: "https://uaqcp-lai25-rm094.up.railway.app/api/:path*",
      },
      {
        source: "/openapi.json",
        destination: "https://uaqcp-lai25-rm094.up.railway.app/openapi.json",
      },
      {
        source: "/redoc",
        destination: "https://uaqcp-lai25-rm094.up.railway.app/redoc",
      },
    ];
  },
};

export default nextConfig;
