import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Sentinel AI",
    template: "%s — Sentinel AI",
  },
  description: "AI-powered intelligent web security platform",
  metadataBase: new URL("https://www.sentinel-ai.me"),  // ← ADD THIS
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  // ← ADD ALL OF THIS BELOW
  openGraph: {
    title: "Sentinel AI",
    description: "AI-powered intelligent web security platform",
    url: "https://www.sentinel-ai.me",
    siteName: "Sentinel AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentinel AI",
    description: "AI-powered intelligent web security platform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.sentinel-ai.me",
  },
};

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
      <html lang="en" style={{ background: "#000000" }}>
        <body style={{ background: "#000000" }}>
          {children}
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  );
}
