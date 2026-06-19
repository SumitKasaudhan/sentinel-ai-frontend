"use client";

// hooks/useSubscription.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight client-side hook that fetches the current user's subscription
// state from /api/subscription/status.
//
// Returns:
//   isPro       — true only when status=active + payment_verified + not expired
//   status      — raw SubscriptionStatus string | null
//   plan        — "pro" | "free" | null
//   isLoading   — true while the first fetch is in flight
//   refetch     — call this after a payment to re-validate immediately
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from "react";

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "past_due"
  | "cancelled"
  | "expired"
  | null;

export interface UseSubscriptionReturn {
  isPro:      boolean;
  status:     SubscriptionStatus;
  plan:       string | null;
  isLoading:  boolean;
  refetch:    () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [isPro,     setIsPro]     = useState(false);
  const [status,    setStatus]    = useState<SubscriptionStatus>(null);
  const [plan,      setPlan]      = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res  = await fetch("/api/subscription/status");
      if (!res.ok) throw new Error("Failed to fetch subscription status");
      const data = await res.json();

      setIsPro(data.isPro     ?? false);
      setStatus(data.status   ?? null);
      setPlan(data.plan       ?? null);
    } catch (err) {
      console.error("[useSubscription] fetch error:", err);
      // Fail safe: treat as free on error
      setIsPro(false);
      setStatus(null);
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { isPro, status, plan, isLoading, refetch: fetchStatus };
}