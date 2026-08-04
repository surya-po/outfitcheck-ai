import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  turbopack: {
    root: path.resolve(__dirname),
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // Hide the "Rendering..." dev indicator in bottom-left corner
  devIndicators: false,

  // Compress responses
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
};

export default nextConfig;