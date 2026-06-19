"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Calendar, Clock, RefreshCw, XCircle } from "lucide-react";
import { useNotify } from "@/components/dashboard/context/NotificationContext";

type SubscriptionStatus =
  | "active"
  | "inactive"
  | "past_due"
  | "cancelled"
  | "expired";

type Subscription = {
  plan: string;
  status: SubscriptionStatus;
  billing_cycle: string | null;
  current_period_end: string | null;
  payment_verified: boolean;
  cancel_at_period_end: boolean;
  created_at: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysBetween(a: Date, b: Date) {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function SubscriptionSection() {
  const notify = useNotify();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"cancel" | "resume" | null>(
    null
  );

  useEffect(() => {
    fetch("/api/subscription/details")
      .then((res) => res.json())
      .then((json) => setSubscription(json.subscription ?? null))
      .catch((err) => console.error("Failed to load subscription:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Cancel your subscription? You'll keep Pro access until the current billing period ends, then it won't renew."
    );
    if (!confirmed) return;

    setActionLoading("cancel");
    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      if (!res.ok) throw new Error("Cancel failed");
      setSubscription((prev) =>
        prev ? { ...prev, cancel_at_period_end: true } : prev
      );
      notify(
        "Cancellation Scheduled",
        "Your plan won't renew after the current period ends",
        "success"
      );
    } catch {
      notify("Cancel Failed", "Could not cancel your subscription", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async () => {
    setActionLoading("resume");
    try {
      const res = await fetch("/api/subscription/resume", { method: "POST" });
      if (!res.ok) throw new Error("Resume failed");
      setSubscription((prev) =>
        prev ? { ...prev, cancel_at_period_end: false } : prev
      );
      notify("Subscription Resumed", "Auto-renew has been turned back on", "success");
    } catch {
      notify("Resume Failed", "Could not resume your subscription", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="sp-card">
        <p className="sp-section-desc">Loading subscription…</p>
      </div>
    );
  }

  const isFree = !subscription || subscription.plan === "free";

  /* ── FREE / NEVER SUBSCRIBED / FULLY ENDED ─────────────── */
  if (isFree) {
    const hasEnded =
      subscription?.status === "cancelled" || subscription?.status === "expired";

    return (
      <div className="sp-card">
        <div className="sp-card-header">
          <div className="sp-card-header-left">
            <h2 className="sp-section-title">Subscription &amp; Billing</h2>
            <p className="sp-section-desc">
              {hasEnded
                ? "Your Pro subscription has ended."
                : "You're currently on the Free plan."}
            </p>
          </div>
        </div>

        <div className="sp-divider" />

        <div className="sp-sub-plan-row">
          <div className="sp-sub-plan-badge">
            <Crown size={16} />
            <span>Free Plan</span>
          </div>
          <Link
            href="/dashboard/pricing"
            className="sp-btn-save"
            style={{ textDecoration: "none" }}
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  /* ── PRO: active, cancelling-soon, or past_due ─────────── */
  const expiry = subscription!.current_period_end;
  const daysLeft = expiry ? daysBetween(new Date(), new Date(expiry)) : null;
  const cycleDays = subscription!.billing_cycle === "yearly" ? 365 : 30;
  const isPastDue = subscription!.status === "past_due";
  const isCancelling = subscription!.cancel_at_period_end;
  const periodExpired = !!expiry && new Date(expiry).getTime() < Date.now();

  let statusLabel = "Active";
  let statusClass = "sp-sub-status--active";
  if (isPastDue) {
    statusLabel = "Payment Failed";
    statusClass = "sp-sub-status--cancelled";
  } else if (isCancelling) {
    statusLabel = "Cancels Soon";
    statusClass = "sp-sub-status--soon";
  } else if (periodExpired) {
    statusLabel = "Expired";
    statusClass = "sp-sub-status--expired";
  }

  return (
    <div className="sp-card">
      <div className="sp-card-header">
        <div className="sp-card-header-left">
          <h2 className="sp-section-title">Subscription &amp; Billing</h2>
          <p className="sp-section-desc">
            Manage your plan, billing cycle, and renewal settings.
          </p>
        </div>
        <span className={`sp-sub-status ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="sp-divider" />

      <div className="sp-sub-plan-row">
        <div className="sp-sub-plan-badge">
          <Crown size={16} />
          <span>Pro Plan</span>
        </div>
        <span className="sp-sub-cycle">
          Billed {subscription!.billing_cycle === "yearly" ? "Yearly" : "Monthly"}
        </span>
      </div>

      {isPastDue && (
        <p className="sp-security-hint" style={{ paddingBottom: 12 }}>
          Your last payment failed. Update your payment method to keep Pro
          access — otherwise your plan will be paused.
        </p>
      )}

      <div className="sp-form-grid">
        <div className="sp-field">
          <label className="sp-label">Subscribed Since</label>
          <div className="sp-sub-value">
            <Calendar size={13} />
            {formatDate(subscription!.created_at)}
          </div>
        </div>

        <div className="sp-field">
          <label className="sp-label">
            {isCancelling ? "Access Ends On" : "Next Renewal"}
          </label>
          <div className="sp-sub-value">
            <Clock size={13} />
            {formatDate(expiry)}
          </div>
        </div>
      </div>

      {!periodExpired && daysLeft !== null && (
        <div className="sp-sub-progress-wrap">
          <div className="sp-sub-progress-track">
            <div
              className="sp-sub-progress-fill"
              style={{
                width: `${Math.max(4, Math.min(100, (daysLeft / cycleDays) * 100))}%`,
              }}
            />
          </div>
          <span className="sp-sub-progress-label">
            {daysLeft > 0
              ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining in this cycle`
              : "Renews today"}
          </span>
        </div>
      )}

      <div className="sp-inner-section">
        <div className="sp-security-row">
          <div className="sp-security-text">
            <p className="sp-security-label">Auto-Renew</p>
            <p className="sp-security-hint">
              {isCancelling
                ? "Auto-renew is off — your plan won't renew after the current period."
                : "Your plan renews automatically on the date above."}
            </p>
          </div>
        </div>
      </div>

      <div className="sp-actions">
        {isCancelling ? (
          <button
            className="sp-btn-save"
            onClick={handleResume}
            disabled={actionLoading !== null}
          >
            <RefreshCw size={13} />
            {actionLoading === "resume" ? "Resuming…" : "Resume Subscription"}
          </button>
        ) : (
          <button
            className="sp-btn-logout"
            onClick={handleCancel}
            disabled={actionLoading !== null}
          >
            <XCircle size={13} />
            {actionLoading === "cancel" ? "Cancelling…" : "Cancel Subscription"}
          </button>
        )}
      </div>
    </div>
  );
}