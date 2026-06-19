// lib/supabase.ts
// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-SAFE anon client only.
// Safe to import anywhere — browser, server components, API routes, hooks.
//
// ⚠️  supabaseAdmin has been moved to lib/supabase-admin.ts
//     Only import that file in server-side code (API routes, server actions).
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars.\n" +
    "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
    "are set in .env.local"
  );
}

// Respects Row Level Security (RLS). Safe to use in the browser.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);