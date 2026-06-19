// middleware.ts  (project root)
// ─────────────────────────────────────────────────────────────────────────
// Edge runtime — Clerk auth gate ONLY.
//
// Pro-subscription checks have been moved OUT of middleware because they
// rely on supabaseAdmin (Node-only, env vars not reliably available in the
// Edge runtime). Premium route protection now happens at the page/layout
// level via `lib/requirePro.ts` (Node runtime, server components).
// ─────────────────────────────────────────────────────────────────────────

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require a Clerk session
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/payment/success",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};