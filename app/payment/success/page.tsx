"use client";

// app/payment/success/page.tsx
// UI UPGRADED — all logic/functions unchanged

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams }             from "next/navigation";
import { useAuth }                                from "@clerk/nextjs";
import Link                                       from "next/link";
import { motion }                                 from "framer-motion";
import { ShieldCheck, Check, Zap, Loader2, XCircle, Terminal } from "lucide-react";

type VerifyState = "loading" | "verified" | "rejected";

const LOADING_MESSAGES = [
  "Confirming secure transaction…",
  "Verifying with Dodo Payments…",
  "Initializing subscription…",
  "Activating Pro features…",
  "Almost there…",
];

const FEATURES = [
  "Unlimited threat analysis & scanning",
  "Deep AI vulnerability detection",
  "Dark web exposure correlation",
  "Real-time perimeter monitoring",
  "PDF & JSON report export",
  "Priority support — under 4 hours",
];

// ── Inner component ────────────────────────────────────────────────────────────
function SuccessContent() {
  const router                   = useRouter();
  const params                   = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();

  const [state, setState]       = useState<VerifyState>("loading");
  const [attempt, setAttempt]   = useState(0);
  const [msgIdx, setMsgIdx]     = useState(0);
  const cancelled               = useRef(false);

  const statusParam    = params.get("status") ?? "";
  const subscriptionId = params.get("subscription_id") ?? "";
  const MAX_ATTEMPTS   = 8;

  useEffect(() => {
    if (state !== "loading") return;
    const t = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/payment/cancel?reason=not_authenticated");
      return;
    }
    if (statusParam === "failed") {
      setState("rejected");
      setTimeout(() => { router.replace("/payment/cancel?reason=payment_failed"); }, 1500);
      return;
    }
    cancelled.current = false;
    const verify = async (n: number) => {
      try {
        const url = subscriptionId
          ? `/api/verify-payment?subscription_id=${encodeURIComponent(subscriptionId)}`
          : `/api/verify-payment`;
        const res  = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (cancelled.current) return;
        if (data.verified) {
          setState("verified");
          setTimeout(() => router.push("/dashboard"), 5000);
          return;
        }
        if (n < MAX_ATTEMPTS - 1) {
          setTimeout(() => { if (!cancelled.current) { setAttempt(n + 1); verify(n + 1); } }, 2000);
        } else {
          setState("rejected");
          setTimeout(() => { router.replace(`/payment/cancel?reason=${data.reason ?? "timeout"}`); }, 3000);
        }
      } catch {
        if (cancelled.current) return;
        if (n < MAX_ATTEMPTS - 1) {
          setTimeout(() => { if (!cancelled.current) verify(n + 1); }, 2000);
        } else {
          setState("rejected");
          setTimeout(() => router.replace("/payment/cancel?reason=network_error"), 3000);
        }
      }
    };
    verify(0);
    return () => { cancelled.current = true; };
  }, [isLoaded, isSignedIn, router, subscriptionId, statusParam]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center gap-8 text-center w-full max-w-sm"
        >
          {/* Pulse ring icon */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Outer pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(76,215,246,0.4)" }}
              animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            {/* Mid ring */}
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{ border: "1.5px dashed rgba(76,215,246,0.25)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            {/* Core */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative"
              style={{
                background: "rgba(76,215,246,0.08)",
                border:     "1px solid rgba(76,215,246,0.3)",
                boxShadow:  "0 0 30px rgba(76,215,246,0.12), inset 0 0 20px rgba(76,215,246,0.04)",
              }}
            >
              <Loader2 size={32} className="animate-spin" style={{ color: "#4cd7f6" }} />
            </div>
          </div>

          {/* Message */}
          <div>
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                color: "#e1e2ec",
                marginBottom: "8px",
                letterSpacing: "0.01em",
              }}
            >
              {LOADING_MESSAGES[msgIdx]}
            </motion.p>
            <p style={{ fontSize: "12px", color: "#424754", fontFamily: "'Space Grotesk', monospace", letterSpacing: "0.08em" }}>
              ATTEMPT {attempt + 1} / {MAX_ATTEMPTS}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: i === attempt ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i < attempt + 1 ? "#4cd7f6" : "rgba(76,215,246,0.12)",
                  boxShadow: i === attempt ? "0 0 8px rgba(76,215,246,0.7)" : "none",
                  transition: "all 0.3s ease",
                }}
                animate={i === attempt ? { opacity: [1, 0.6, 1] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            ))}
          </div>

          <p style={{ fontSize: "11px", color: "#32353c", fontFamily: "'Space Grotesk', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Do not close this tab
          </p>
        </motion.div>
      </Shell>
    );
  }

  // ── Rejected ───────────────────────────────────────────────────────────────
  if (state === "rejected") {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,180,171,0.08)",
              border:     "1px solid rgba(255,180,171,0.3)",
              boxShadow:  "0 0 30px rgba(255,180,171,0.08)",
            }}
          >
            <XCircle size={40} style={{ color: "#ffb4ab" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700, color: "#e1e2ec", marginBottom: "6px" }}>
              Payment Not Confirmed
            </h2>
            <p style={{ fontSize: "14px", color: "#424754", fontFamily: "'Space Grotesk', monospace", letterSpacing: "0.06em" }}>
              REDIRECTING…
            </p>
          </div>
        </motion.div>
      </Shell>
    );
  }

  // ── Verified ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[520px]"
      >
        {/* Glassmorphism card */}
        <div
          style={{
            background:    "rgba(29,32,39,0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border:        "1px solid rgba(66,71,84,0.5)",
            borderRadius:  "12px",
            padding:       "48px 40px",
            position:      "relative",
            overflow:      "hidden",
            textAlign:     "center",
          }}
        >
          {/* Top accent line */}
          <div style={{
            position:   "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, transparent, #4cd7f6, transparent)",
            opacity:    0.5,
          }} />

          {/* Corner decorators */}
          {[
            { top: 16, left: 16, borderTop: "1px solid rgba(66,71,84,0.5)", borderLeft: "1px solid rgba(66,71,84,0.5)" },
            { top: 16, right: 16, borderTop: "1px solid rgba(66,71,84,0.5)", borderRight: "1px solid rgba(66,71,84,0.5)" },
            { bottom: 16, left: 16, borderBottom: "1px solid rgba(66,71,84,0.5)", borderLeft: "1px solid rgba(66,71,84,0.5)" },
            { bottom: 16, right: 16, borderBottom: "1px solid rgba(66,71,84,0.5)", borderRight: "1px solid rgba(66,71,84,0.5)" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 10, height: 10, ...s }} />
          ))}

          {/* Success icon with pulse ring */}
          <div className="flex justify-center mb-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
              style={{ position: "relative", width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {/* Pulse ring */}
              <motion.div
                style={{
                  position: "absolute", inset: -8, borderRadius: "50%",
                  border: "1px solid rgba(76,215,246,0.4)",
                }}
                animate={{ scale: [0.95, 1.5], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              {/* Rotating dashed ring */}
              <motion.div
                style={{
                  position: "absolute", inset: 4, borderRadius: "50%",
                  border: "1.5px dashed rgba(76,215,246,0.3)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              {/* Core glow bg */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(76,215,246,0.1)",
                boxShadow: "0 0 0 1px rgba(76,215,246,0.25)",
              }} />
              {/* Icon */}
              <ShieldCheck size={44} style={{ color: "#4cd7f6", position: "relative", zIndex: 1, filter: "drop-shadow(0 0 12px rgba(76,215,246,0.6))" }} />
            </motion.div>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "30px", fontWeight: 700, color: "#e1e2ec", marginBottom: "10px", letterSpacing: "-0.02em" }}>
            Secure Link Established
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#8c909f", marginBottom: "36px", lineHeight: 1.6, maxWidth: 340, margin: "0 auto 36px" }}>
            Your tactical upgrade is active. Command authorization granted.
          </p>

          {/* Data summary card */}
          <div style={{
            background: "rgba(11,14,21,0.8)",
            border:     "1px solid rgba(66,71,84,0.4)",
            borderRadius: "8px",
            padding:    "20px 24px",
            marginBottom: "28px",
            position:   "relative",
            overflow:   "hidden",
            textAlign:  "left",
          }}>
            {/* Left accent bar */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: "2px",
              background: "linear-gradient(180deg, rgba(173,198,255,0.2), rgba(76,215,246,0.7), rgba(173,198,255,0.2))",
            }} />
            {[
              { label: "Plan Architecture", value: "Professional Tier", valueStyle: { color: "#e1e2ec", fontWeight: 500 } },
              { label: "Resource Allocation", value: "$49.00 / Cycle",  valueStyle: { color: "#4cd7f6", fontWeight: 500, letterSpacing: "0.04em" } },
            ].map(({ label, value, valueStyle }, i, arr) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(66,71,84,0.15)" : "none",
              }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: "#8c909f", letterSpacing: "0.04em" }}>{label}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", ...valueStyle }}>{value}</span>
              </div>
            ))}
            {/* Features list */}
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(66,71,84,0.15)" }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#4cd7f6", textTransform: "uppercase", marginBottom: "12px" }}>
                Pro Features Unlocked
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(76,215,246,0.1)",
                      border: "1px solid rgba(76,215,246,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={9} style={{ color: "#4cd7f6" }} />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#8c909f" }}>{f}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA — gradient border button */}
          <Link
            href="/dashboard"
            style={{
              display: "block", width: "100%",
              background: "linear-gradient(135deg, #005ac2, #03b5d3)",
              padding:    "1px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <div style={{
              background:    "#0b0e15",
              borderRadius:  "7px",
              padding:       "13px 24px",
              display:       "flex",
              alignItems:    "center",
              justifyContent: "center",
              gap:           "10px",
              transition:    "background 0.25s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "transparent")}
              onMouseLeave={e => (e.currentTarget.style.background = "#0b0e15")}
            >
              <Terminal size={16} style={{ color: "#4cd7f6" }} />
              <span style={{
                fontFamily:    "'Space Grotesk', sans-serif",
                fontSize:      "13px",
                fontWeight:    700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "#e1e2ec",
              }}>
                Initialize Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Footer status */}
        <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", opacity: 0.55 }}>
          <motion.div
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#4cd7f6" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: "11px", color: "#8c909f", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Sys.Status: Online
          </span>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#32353c", marginTop: "10px", fontFamily: "'Space Grotesk', monospace", letterSpacing: "0.05em" }}>
          Auto-redirecting in 5 seconds…
        </p>
      </motion.div>
    </Shell>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 24px", background: "#10131a", position: "relative", overflow: "hidden" }}>
      {/* Cyber grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(to right, rgba(140,144,159,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(140,144,159,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      {/* Cyan radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(76,215,246,0.05) 0%, transparent 70%)",
      }} />
      {/* Bottom gradient */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "300px", pointerEvents: "none", zIndex: 0,
        background: "linear-gradient(to top, rgba(173,198,255,0.03), transparent)",
      }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {children}
      </div>
    </main>
  );
}

// ── Page export ────────────────────────────────────────────────────────────────
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <Shell>
        <Loader2 size={32} className="animate-spin" style={{ color: "#4cd7f6" }} />
      </Shell>
    }>
      <SuccessContent />
    </Suspense>
  );
}