"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// ✅ This file is correct and needs no changes.
//
// PATH: app/sso-callback/page.tsx  ← confirmed correct
//
// Both login and register pages now use redirectUrl: "/sso-callback"
// (standardized in Batch 1), so this single file handles all OAuth callbacks.
//
// AuthenticateWithRedirectCallback finishes the Clerk OAuth handshake and
// then redirects to /dashboard via the fallback URLs below.

export default function SSOCallback() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    />
  );
}