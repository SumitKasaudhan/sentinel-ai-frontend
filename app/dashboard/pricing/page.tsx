"use client";
import "@/styles/dashboard/pricing/Pricing.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Building2,
  Check,
  ArrowLeft,
  Star,
  Lock,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanKey = "pro" | "enterprise";

interface Plan {
  key: PlanKey | "free";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  icon: React.ReactNode;
  color: string;
  glow: string;
  border: string;
}

// ─── Plans config ─────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    key: "free",
    name: "Community",
    price: "$0",
    period: "forever",
    description: "Essential security monitoring for indie projects.",
    features: [
      "Up to 3 scan targets",
      "Basic threat reports",
      "Community support",
      "7-day log history",
    ],
    cta: "Current Plan",
    popular: false,
    icon: <Shield size={18} />,
    color: "#94a3b8",
    glow: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.15)",
  },
  {
    key: "pro",
    name: "Professional",
    price: "$49",
    period: "/ month",
    description: "Full AI threat intelligence for growing teams.",
    features: [
      "Unlimited scan targets",
      "Deep AI vulnerability analysis",
      "Real-time threat monitoring",
      "Dark web exposure correlation",
      "PDF & JSON report export",
      "Priority support (< 4h)",
      "90-day log history",
      "API access",
    ],
    cta: "Deploy Pro",
    popular: true,
    icon: <Zap size={18} />,
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.12)",
    border: "rgba(0,212,255,0.4)",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Mission-critical infrastructure at scale.",
    features: [
      "Everything in Pro",
      "Custom AI model training",
      "Dedicated security engineer",
      "SLA guarantee (99.99%)",
      "SSO / SAML integration",
      "On-premise deployment option",
      "Unlimited log history",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
    icon: <Building2 size={18} />,
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.3)",
  },
];

// ─── Feature comparison table rows ───────────────────────────────────────────

const COMPARISON = [
  { feature: "Scan targets",       free: "3",       pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "AI analysis",        free: "Basic",   pro: "Deep",      enterprise: "Custom model" },
  { feature: "Dark web lookup",    free: false,     pro: true,        enterprise: true },
  { feature: "Report export",      free: false,     pro: true,        enterprise: true },
  { feature: "API access",         free: false,     pro: true,        enterprise: true },
  { feature: "SSO / SAML",         free: false,     pro: false,       enterprise: true },
  { feature: "Dedicated engineer", free: false,     pro: false,       enterprise: true },
  { feature: "Log retention",      free: "7 days",  pro: "90 days",   enterprise: "Unlimited" },
  { feature: "Support SLA",        free: "Community", pro: "< 4h",    enterprise: "1h + dedicated" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPricingPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [error, setError]             = useState<string | null>(null);

  // ── Subscription status ──────────────────────────────────────────────────
  // Page ko pata hona chahiye user already Pro hai ya nahi, taaki
  // already-subscribed user ko dobara "Deploy Pro" na dikhaya jaye
  // (jo backend se 409 ALREADY_SUBSCRIBED return karega).
  const [isPro, setIsPro]               = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/subscription/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const sub = data?.data;
        setIsPro(!!sub && sub.plan === "pro" && sub.status === "active");
      } catch (err) {
        console.error("[pricing] failed to load subscription status:", err);
        // Fail-open on display only — agar status check fail ho jaye,
        // button active hi rehta hai; backend duplicate-checkout guard
        // hai hi, isliye worst case ek extra click + 409 error hoga,
        // koi galat charge nahi hoga.
      } finally {
        setStatusLoaded(true);
      }
    };

    loadStatus();
  }, [getToken]);

  // ── Checkout handler ────────────────────────────────────────────────────
  // User is already authenticated here (dashboard is protected by middleware).
  // The API route grabs their Clerk email server-side — no email needed client-side.
  const handleCheckout = async (planKey: PlanKey) => {
    setLoadingPlan(planKey);
    setError(null);

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        // FIX: backend sends `message` (e.g. "Pro subscription already
        // active."), not `error` — reading data.error here always came
        // back undefined and silently swallowed the real reason.
        throw new Error(
          data.message || data.error || "Failed to create checkout session."
        );
      }

      // Redirect to Dodo checkout — user is logged in so email is pre-filled
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  const handlePlanClick = (plan: Plan) => {
    if (plan.key === "free") return;                  // already on free
    if (plan.key === "pro" && isPro) return;           // already on pro
    if (plan.key === "enterprise") {                   // sales contact
      window.open("mailto:sales@sentinelai.io?subject=Enterprise%20Inquiry", "_blank");
      return;
    }
    handleCheckout(plan.key as PlanKey);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="dash-pricing">

      {/* ── Header ── */}
      <div className="dash-pricing__header">
        <button
          className="dash-pricing__back"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="dash-pricing__title-group">
          <div className="dash-pricing__eyebrow">
            <Zap size={12} />
            UPGRADE YOUR PLAN
          </div>
          <h1 className="dash-pricing__title">
            Unlock Full <span className="dash-pricing__accent">Pro Access</span>
          </h1>
          <p className="dash-pricing__subtitle">
            {isPro
              ? "You're on the Professional plan — thanks for being a Pro member."
              : "You're signed in — one click takes you straight to checkout."}
          </p>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="dash-pricing__error"
        >
          <Lock size={14} />
          {error}
          <button onClick={() => setError(null)} className="dash-pricing__error-close">✕</button>
        </motion.div>
      )}

      {/* ── Plans grid ── */}
      <div className="dash-pricing__grid">
        {PLANS.map((plan, i) => {
          const isCurrentPlan =
            plan.key === "free" ? !isPro : plan.key === "pro" ? isPro : false;

          const ctaLabel = isCurrentPlan ? "Current Plan" : plan.cta;
          const ctaDisabled =
            isCurrentPlan ||
            !statusLoaded ||
            loadingPlan !== null;

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className={`dash-plan ${plan.popular ? "dash-plan--popular" : ""}`}
              style={{
                "--plan-color":  plan.color,
                "--plan-glow":   plan.glow,
                "--plan-border": plan.border,
              } as React.CSSProperties}
            >
              {plan.popular && (
                <div className="dash-plan__badge">
                  <Star size={10} fill="currentColor" />
                  MOST POPULAR
                </div>
              )}

              {/* Plan header */}
              <div className="dash-plan__header">
                <div className="dash-plan__icon-wrap">
                  {plan.icon}
                </div>
                <div>
                  <p className="dash-plan__name">{plan.name}</p>
                  <p className="dash-plan__desc">{plan.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="dash-plan__price-row">
                <span className="dash-plan__price">{plan.price}</span>
                {plan.period && (
                  <span className="dash-plan__period">{plan.period}</span>
                )}
              </div>

              {/* Features */}
              <ul className="dash-plan__features">
                {plan.features.map((f) => (
                  <li key={f} className="dash-plan__feature">
                    <div className="dash-plan__check">
                      <Check size={10} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`dash-plan__cta ${
                  isCurrentPlan
                    ? "dash-plan__cta--disabled"
                    : plan.popular
                    ? "dash-plan__cta--primary"
                    : "dash-plan__cta--outline"
                }`}
                onClick={() => handlePlanClick(plan)}
                disabled={ctaDisabled}
              >
                {loadingPlan === plan.key ? (
                  <>
                    <span className="dash-plan__spinner" />
                    Redirecting to checkout…
                  </>
                ) : (
                  <>
                    {!isCurrentPlan && plan.key !== "free" && plan.key !== "enterprise" && (
                      <Zap size={14} />
                    )}
                    {ctaLabel}
                  </>
                )}
              </button>

              {plan.popular && !isPro && (
                <p className="dash-plan__secure-note">
                  <Lock size={11} />
                  Secured by Dodo Payments · Cancel anytime
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Comparison table ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="dash-pricing__comparison"
      >
        <h2 className="dash-pricing__comparison-title">Full Feature Comparison</h2>
        <div className="dash-comparison-table-wrap">
          <table className="dash-comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Community</th>
                <th className="dash-comparison-table__pro-col">Professional</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  {([row.free, row.pro, row.enterprise] as (boolean | string)[]).map((val, ci) => (
                    <td
                      key={ci}
                      className={ci === 1 ? "dash-comparison-table__pro-col" : ""}
                    >
                      {typeof val === "boolean" ? (
                        val ? (
                          <span className="dash-comparison-table__check">
                            <Check size={13} />
                          </span>
                        ) : (
                          <span className="dash-comparison-table__cross">—</span>
                        )
                      ) : (
                        <span className="dash-comparison-table__text">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── FAQ strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="dash-pricing__faq"
      >
        {[
          { q: "Can I cancel anytime?", a: "Yes — cancel from your dashboard, no questions asked." },
          { q: "What card types work?",  a: "Visa, Mastercard, Amex, and most major debit cards." },
          { q: "Is my payment secure?",  a: "All payments are processed by Dodo Payments (PCI DSS Level 1)." },
        ].map((item) => (
          <div key={item.q} className="dash-pricing__faq-item">
            <p className="dash-pricing__faq-q">{item.q}</p>
            <p className="dash-pricing__faq-a">{item.a}</p>
          </div>
        ))}
      </motion.div>

    </div>
  );
}