"use client";

import { useState } from "react";

import Link from "next/link";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/pricing/pricing.css";

import {
  Check,
  Shield,
  Zap,
  Crown,
} from "lucide-react";

const plans = [
  {
    name: "Community",

    monthlyPrice: "$0",

    yearlyPrice: "$0",

    monthlyPeriod: "/mo",

    yearlyPeriod: "/yr",

    description:
      "Essential telemetry for individual operators and small nodes.",

    features: [
      "Basic AI-Powered Scanning",
      "Standard Threat Intel",
      "Community Support",
    ],

    button: "Initialize Free",

    href: "/auth/register",

    featured: false,

    icon: Shield,
  },

  {
    name: "Professional",

    monthlyPrice: "$49",

    yearlyPrice: "$39",

    monthlyPeriod: "/mo",

    yearlyPeriod: "/mo",

    description:
      "Advanced tactical neutralization for scaling infrastructures.",

    features: [
      "Real-time Neutralization Engine",
      "Global Intel Network Access",
      "Automated Incident Response",
      "Priority Encrypted Support",
    ],

    button: "Deploy Professional",

    href: "/auth/register",

    featured: true,

    icon: Zap,
  },

  {
    name: "Enterprise",

    monthlyPrice: "Custom",

    yearlyPrice: "Custom",

    monthlyPeriod: "/contract",

    yearlyPeriod: "/contract",

    description:
      "Bespoke defensive matrices for global sovereign entities.",

    features: [
      "Dedicated Neural Cluster",
      "Custom AI Model Training",
      "On-Premise Deployment Ops",
      "24/7 Dedicated Ops Commander",
    ],

    button: "Contact Command",

    href: "/marketing/contact",

    featured: false,

    icon: Crown,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] =
    useState(true);

  return (
    <>
      {/* NAVBAR */}

      <Navbar />

      {/* MAIN PAGE */}

      <main className="pricing-page">
        {/* BACKGROUND GRID */}

        <div className="pricing-grid" />

        {/* HERO */}

        <section className="pricing-hero">
          <div className="pricing-badge">
            <span className="pricing-badge-dot" />

            PRICING PROTOCOLS
          </div>

          <h1>
            Predictable Security.
            <br />

            <span>
              Infinite Scale.
            </span>
          </h1>

          <p>
            Mission-critical protection engineered for elite operations.
            Deploy autonomous defense matrices tailored to your
            infrastructure's exact parameters.
          </p>

          {/* TOGGLE */}

          <div className="billing-toggle">
            <span
              className={
                !isYearly
                  ? "billing-active"
                  : ""
              }
            >
              Monthly
            </span>

            <button
              className={`toggle-switch ${
                isYearly
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setIsYearly(
                  !isYearly
                )
              }
              aria-label="Toggle Billing"
            >
              <span className="toggle-ball" />
            </button>

            <span
              className={
                isYearly
                  ? "billing-active"
                  : ""
              }
            >
              Annually
            </span>

            <div className="save-badge">
              SAVE 20%
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}

        <section className="pricing-cards">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`pricing-card ${
                  plan.featured
                    ? "featured"
                    : ""
                }`}
              >
                {/* FEATURED BADGE */}

                {plan.featured && (
                  <div className="featured-badge">
                    ⚡ OPTIMAL
                    SELECTION
                  </div>
                )}

                {/* ICON */}

                <div className="plan-icon">
                  <Icon size={22} />
                </div>

                {/* PLAN TITLE */}

                <h3>
                  {plan.name}
                </h3>

                {/* DESCRIPTION */}

                <p className="plan-description">
                  {plan.description}
                </p>

                {/* PRICE */}

                <div className="price-row">
                  <span className="price">
                    {isYearly
                      ? plan.yearlyPrice
                      : plan.monthlyPrice}
                  </span>

                  <span className="period">
                    {isYearly
                      ? plan.yearlyPeriod
                      : plan.monthlyPeriod}
                  </span>
                </div>

                {/* DIVIDER */}

                <div className="divider" />

                {/* FEATURES */}

                <ul className="features-list">
                  {plan.features.map(
                    (feature) => (
                      <li
                        key={feature}
                      >
                        <Check size={16} />

                        <span>
                          {feature}
                        </span>
                      </li>
                    )
                  )}
                </ul>

                {/* BUTTON */}

                <Link
                  href={plan.href}
                  className={`pricing-btn ${
                    plan.featured
                      ? "primary"
                      : "secondary"
                  }`}
                >
                  {plan.button}
                </Link>
              </div>
            );
          })}
        </section>
      </main>

      {/* FOOTER */}

      <Footer />
    </>
  );
}