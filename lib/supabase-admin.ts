// lib/supabase-admin.ts
// ─────────────────────────────────────────────────────────────────────────────
// SERVER-ONLY admin client. Bypasses Row Level Security (RLS).
//
// ✅ Import in:  API routes, server actions, webhooks, middleware
// ❌ NEVER in:  client components, hooks, or any file with "use client"
//
// The `server-only` package makes Next.js throw a build-time error
// if this file is accidentally imported client-side.
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl        = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey     = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase admin env vars.\n" +
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
    "are set in .env.local (SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix)"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
});