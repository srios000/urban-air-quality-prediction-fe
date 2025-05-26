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
        destination: "http://127.0.0.1:8001/api/:path*",
      },
      {
        source: "/openapi.json",
        destination: "http://127.0.0.1:8001/openapi.json",
      },
      {
        source: "/redoc",
        destination: "http://127.0.0.1:8001/redoc",
      },
    ];
  },
};

export default nextConfig;
