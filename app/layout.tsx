import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel AI",
  description: "AI-powered intelligent web security platform",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

// FIX: ClerkProvider now wraps <html> instead of sitting inside <body>.
// Previously ClerkProvider was a child of <body>, which means during SSR
// Clerk's context was not available to the <html> element — causing hydration
// mismatches when Clerk's session state tried to initialize before the
// provider was fully mounted. Wrapping <html> is the correct Clerk pattern.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<ClerkProvider
  signInUrl="/auth/login"
  signUpUrl="/auth/register"
  signInFallbackRedirectUrl="/dashboard"
  signUpFallbackRedirectUrl="/dashboard"
  signInForceRedirectUrl="/dashboard"
  signUpForceRedirectUrl="/dashboard"
  afterSignOutUrl="/"
>
      {/* FIX: Removed data-scroll-behavior="smooth" — this is not a valid HTML
          attribute and has no effect on browsers. Add scroll-behavior: smooth
          to your globals.css on the html selector instead if needed. */}
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}