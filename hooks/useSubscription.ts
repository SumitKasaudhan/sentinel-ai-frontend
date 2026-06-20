"use client";

// hooks/useSubscription.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fetches subscription state from /api/subscription/status.
//
// KEY FIX: previously, ANY fetch failure (network blip, transient backend
// error, Clerk session not yet hydrated) reset isPro to false — causing
// Pro users to flash "Free" intermittently. Now: errors are tracked
// separately and the last KNOWN GOOD state is retained until a confirmed
// fresh result arrives. A failed fetch automatically retries once after a
// short delay before giving up.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback, useRef } from "react";

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
  isLoading:  boolean;   // true only on the very first fetch
  hasError:   boolean;   // true when the latest attempt failed (state below is stale)
  refetch:    () => Promise<void>;
}

const RETRY_DELAY_MS = 1200;

export function useSubscription(): UseSubscriptionReturn {
  const [isPro,     setIsPro]     = useState(false);
  const [status,    setStatus]    = useState<SubscriptionStatus>(null);
  const [plan,      setPlan]      = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  const hasLoadedOnce = useRef(false);

  const fetchOnce = useCallback(async (): Promise<boolean> => {
    const res = await fetch("/api/subscription/status", { cache: "no-store" });

    if (!res.ok) {
      return false; // signal failure, caller decides what to do
    }

    const data = await res.json();
    setIsPro(data.isPro   ?? false);
    setStatus(data.status ?? null);
    setPlan(data.plan     ?? null);
    return true;
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!hasLoadedOnce.current) setIsLoading(true);

    try {
      const ok = await fetchOnce();
      if (ok) {
        setHasError(false);
      } else {
        // One quick retry before surfacing an error — covers transient
        // blips (cold start, momentary 502, etc.) without ever showing
        // a false "Free" state.
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        const retryOk = await fetchOnce();
        setHasError(!retryOk);
        // NOTE: on failure we deliberately do NOT touch isPro/status/plan —
        // the last known-good values stay on screen.
      }
    } catch (err) {
      console.error("[useSubscription] fetch error:", err);
      setHasError(true);
      // Again: do not reset isPro/status/plan here.
    } finally {
      hasLoadedOnce.current = true;
      setIsLoading(false);
    }
  }, [fetchOnce]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Re-validate when the tab regains focus — catches the case where the
  // session finished hydrating, or a payment completed in another tab.
  useEffect(() => {
    const onFocus = () => fetchStatus();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchStatus]);

  return { isPro, status, plan, isLoading, hasError, refetch: fetchStatus };
}