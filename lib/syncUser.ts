import { supabase } from "@/lib/supabase";

// ── Session-level dedup — prevents multiple syncs per browser session ──────────
// Stops 4x firing caused by React StrictMode + multiple UserSyncProvider mounts
const syncedInSession = new Set<string>();

export const syncUserToSupabase = async (user: any) => {
  try {
    if (!user) return;

    // Already synced this user this session — skip completely
    if (syncedInSession.has(user.id)) return;

    const clerkId   = user.id;
    const email     = user.primaryEmailAddress?.emailAddress || "";
    const fullName  = user.fullName || "";
    const username  = user.username || "";
    const avatarUrl = user.imageUrl || "";
    const provider  = user.externalAccounts?.[0]?.provider || "email";
    const now       = new Date().toISOString();

    // Guard: email is NOT NULL in your schema — don't sync without it
    if (!email) {
      console.warn("UserSync: skipping — no email address on user yet.");
      return;
    }

    // ── Payload matches your EXACT schema columns ──────────────────────────────
    // public.users: id, clerk_id, email, full_name, username, avatar_url,
    //               provider, role (default 'user'), created_at, updated_at
    const payload: Record<string, any> = {
      clerk_id:   clerkId,
      email:      email,
      full_name:  fullName,
      username:   username,
      avatar_url: avatarUrl,
      provider:   provider,   // requires ALTER TABLE above to be run first
      updated_at: now,
      // role: not sent → uses DB default 'user'
      // created_at: not sent → uses DB default NOW()
    };

    // ── UPSERT on clerk_id ─────────────────────────────────────────────────────
    const { error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "clerk_id" });

    if (!error) {
      syncedInSession.add(clerkId); // ✅ mark synced for this session
      console.log("USER SYNCED TO SUPABASE ✅");
      return;
    }

    // ── ERROR HANDLING ─────────────────────────────────────────────────────────

    // provider column still missing → sync without it (temporary fallback)
    if (
      error.message?.includes("provider") &&
      error.message?.includes("schema cache")
    ) {
      console.warn(
        "UserSync: 'provider' column missing in Supabase.\n" +
        "Run this in SQL Editor:\n" +
        "  ALTER TABLE public.users ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';"
      );

      const { full_name, username, avatar_url, updated_at } = payload;
      const { error: fallbackError } = await supabase
        .from("users")
        .upsert(
          { clerk_id: clerkId, email, full_name, username, avatar_url, updated_at },
          { onConflict: "clerk_id" }
        );

      if (!fallbackError) {
        syncedInSession.add(clerkId);
        console.log("USER SYNCED TO SUPABASE (without provider) ✅");
      } else {
        console.error("SUPABASE FALLBACK ERROR:", fallbackError);
      }
      return;
    }

    // email conflict (23505) → row exists with same email but different clerk_id
    // Update the existing row to claim this clerk_id
    if (error.code === "23505") {
      console.warn("UserSync: email conflict — updating existing row by email.");
      const { error: updateError } = await supabase
        .from("users")
        .update({ clerk_id: clerkId, full_name: fullName, username, avatar_url: avatarUrl, provider, updated_at: now })
        .eq("email", email);

      if (!updateError) {
        syncedInSession.add(clerkId);
        console.log("USER SYNCED TO SUPABASE (email update) ✅");
      } else {
        console.error("SUPABASE UPDATE ERROR:", updateError);
      }
      return;
    }

    console.error("SUPABASE SYNC ERROR:", error);

  } catch (err) {
    console.error("SYNC USER ERROR:", err);
  }
};