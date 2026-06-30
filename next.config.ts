// FILE: next.config.ts  (project root — REPLACE your existing one)
// Your original config (eslint ignore, reactStrictMode false, optimizePackageImports)
// kept exactly as-is. Added: security headers, image domains, poweredByHeader off.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },

  // ──────────────────────────────────────────────
  // NEW: Additional security headers (backup layer
  // alongside middleware.ts — Next.js applies both)
  // ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
        ],
      },
    ]
  },

  // ──────────────────────────────────────────────
  // NEW: Restrict remote image domains to known sources
  // Add more here if you load images from elsewhere
  // ──────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'www.sentinel-ai.me' },
    ],
  },

  // NEW: Hides "X-Powered-By: Next.js" header (minor info disclosure fix)
  poweredByHeader: false,
};

export default nextConfig;