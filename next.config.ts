import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: false,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
    ],
  },
};

export default nextConfig;