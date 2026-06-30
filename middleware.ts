// FILE: middleware.ts  (project root — REPLACE your existing one)
// This is YOUR existing middleware.ts (Clerk auth gate + pro-route protection)
// with security headers added. Nothing about your auth logic changed.
//
// FIX (this version): added `worker-src 'self' blob:` — Clerk creates an
// internal web worker from a blob: URL for bot-detection. Without this
// directive, the browser falls back to script-src for workers, which
// doesn't allow blob:, so Clerk's worker gets blocked by CSP.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require a Clerk session (unchanged from your original)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/payment/success",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // ────────────────────────────────────────────────────────
  // Security headers
  // ────────────────────────────────────────────────────────
  const response = NextResponse.next();

  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://js.dodopayments.com`,
    `worker-src 'self' blob:`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https://img.clerk.com https://*.supabase.co https://www.sentinel-ai.me`,
    `connect-src 'self' https://*.clerk.accounts.dev https://*.supabase.co https://api.dodopayments.com wss://*.supabase.co`,
    `frame-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://js.dodopayments.com`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ')

  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self), usb=()')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim())

  return response
});

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

// ============================================================
// NOTE on payment CSP: DodoPayments + Supabase domains are included
// in the CSP since your package.json shows both. If checkout or
// realtime features break after deploying this, open browser
// DevTools → Console → look for "Refused to ... because it
// violates CSP" errors, then add that exact domain to the
// relevant directive above (script-src / connect-src / frame-src).
// ============================================================