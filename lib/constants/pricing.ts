// FILE: lib/constants/pricing.ts (NEW FILE — create lib/constants/ folder)
//
// Single source of truth for all pricing. Import this everywhere instead
// of hardcoding "$39" or "$49" — fixes the homepage vs pricing-page mismatch.
//
// Usage:
//   import { PRICING } from "@/lib/constants/pricing"
//   <span>{PRICING.professional.label}</span>

export const PRICING = {
  community: {
    name: "Community",
    price: 0,
    priceAnnual: 0,
    label: "Free",
    features: [
      "Basic AI-powered scanning",
      "Up to 3 targets",
      "Monthly scan reports",
      "Community support",
      "Standard threat intel",
    ],
    cta: "Get started free",
    href: "/auth/register",
  },
  professional: {
    name: "Professional",
    price: 39,
    priceAnnual: 31,
    label: "$39/mo",
    features: [
      "Deep AI scans — unlimited frequency",
      "24/7 continuous monitoring",
      "PDF & CSV export reports",
      "API access",
      "Global intel network access",
      "Automated incident response",
      "Priority encrypted support",
    ],
    cta: "Start free trial",
    href: "/auth/register",
    badge: "Most popular",
  },
  enterprise: {
    name: "Enterprise",
    price: null,
    label: "Custom",
    features: [
      "Unlimited targets",
      "Dedicated infrastructure",
      "Custom AI model tuning",
      "On-premise deployment",
      "24/7 dedicated security engineer",
      "SSO / SAML 2.0",
      "SLA-backed uptime guarantee",
      "Data Processing Agreement (DPA)",
    ],
    cta: "Contact sales",
    href: "/marketing/contact",
  },
} as const;