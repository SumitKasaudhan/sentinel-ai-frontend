// lib/requirePro.ts
import "server-only";
import { auth }     from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubscription, isPro } from "@/lib/subscriptions";

export async function requirePro() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let sub;
  try {
    sub = await getSubscription(userId!);
  } catch (err) {
    console.error("[requirePro] DB error:", err);
    redirect("/dashboard?error=subscription_check_failed");
  }

  if (!isPro(sub ?? null)) {
    redirect("/dashboard/pricing?required=pro");
  }
}