import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone for Docker, remove for Vercel
  // output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimize for Vercel free plan
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
