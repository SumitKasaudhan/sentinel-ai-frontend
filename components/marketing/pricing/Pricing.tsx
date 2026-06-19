"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import "@/styles/marketing/pricing/pricing2.css";

const plans = [
  {
    name: "Community",
    price: "Free",
    accent: "starter",
    points: ["Basic scans", "Monthly reports", "Community support"],
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: "$49/mo",
    accent: "featured",
    points: ["Deep AI scans", "24/7 monitoring", "PDF reports", "API access"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    accent: "enterprise",
    points: [
      "Unlimited targets",
      "Custom AI training",
      "Dedicated security engineer",
      "SSO",
    ],
    cta: "Contact Sales",
  },
];

export default function Pricing() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="container pricing-container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h2>Transparent Pricing</h2>
          <p>
            Scale your security posture from community projects to enterprise
            infrastructure.
          </p>
        </motion.div>

        {/*
          FIX: Was "pricing-grid" — that class in pricing.css is defined as
          position: absolute; inset: 0; pointer-events: none; opacity: 0.25
          and was originally built as a decorative background dot-grid overlay
          for the standalone /marketing/pricing page.

          Using it here as the cards container caused:
            1. All 3 pricing cards ripped out of document flow (position: absolute)
            2. Cards container stretched via inset: 0 to the full document height,
               creating the phantom transparent space below the footer
            3. All CTA buttons (Start Free Trial, etc.) were unclickable
               because pointer-events: none was inherited by every card

          The correct class is "pricing-cards" which is also defined in
          pricing.css (line 234) with:
            position: relative; display: grid;
            grid-template-columns: repeat(3, 1fr); gap: 2rem;
          — exactly what the homepage card grid needs.

          No other changes to this file.
        */}
        <div className="pricing-cards">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              className={`pricing-card ${plan.accent} ${
                plan.popular ? "popular" : ""
              }`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {plan.popular && (
                <div className="popular-badge">MOST POPULAR</div>
              )}

              <div className="pricing-card__head">
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
              </div>

              <ul className="pricing-list">
                {plan.points.map((point) => (
                  <li key={point}>
                    <Check size={16} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/marketing/pricing"
                className={`btn ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                } pricing-cta`}
              >
                {plan.cta}
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}