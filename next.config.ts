import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone for Docker, remove for Vercel
  // output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Optimize for Vercel free plan
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
