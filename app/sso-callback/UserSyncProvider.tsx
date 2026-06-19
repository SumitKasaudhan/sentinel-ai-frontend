// Silent background component — renders nothing.
// Syncs Clerk user to Supabase once per mount.
// Uses a ref guard to prevent double-firing from React StrictMode.

"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { syncUserToSupabase } from "@/lib/syncUser";

export default function UserSyncProvider() {
  const { user, isLoaded } = useUser();
  const hasSynced = useRef(false); // ← prevents double-fire from StrictMode

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (hasSynced.current) return; // already ran in this component instance

    hasSynced.current = true;
    syncUserToSupabase(user);
  }, [isLoaded, user]);

  return null;
}