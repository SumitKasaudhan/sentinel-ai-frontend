"use client";

// app/payment/cancel/page.tsx
// UI UPGRADED — all logic/functions unchanged

import { useSearchParams } from "next/navigation";
import Link                from "next/link";
import { motion }          from "framer-motion";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Suspense } from "react";

const REASON_MESSAGES: Record<string, { title: string; body: string }> = {
  payment_failed:        { title: "Transaction Aborted",      body: "Your card was declined or the payment could not be processed." },
  card_declined:         { title: "Card Declined",            body: "Your card issuer declined the charge. Try a different card." },
  insufficient_funds:    { title: "Insufficient Funds",       body: "Your card doesn't have enough funds. Try a different payment method." },
  webhook_not_received:  { title: "Payment Not Confirmed",    body: "We couldn't confirm your payment with Dodo. If you were charged, contact support." },
  unverified:            { title: "Payment Not Verified",     body: "Your payment could not be verified server-side. No charge was made." },
  not_authenticated:     { title: "Sign In Required",         body: "You need to be signed in to complete checkout." },
  network_error:         { title: "Connection Error",         body: "We lost connection while verifying your payment. Please try again." },
  status_past_due:       { title: "Payment Past Due",         body: "Your last payment failed. Update your billing details to restore access." },
  status_cancelled:      { title: "Subscription Cancelled",   body: "This subscription has been cancelled." },
};

const DEFAULT_MESSAGE = {
  title: "Transaction Aborted",
  body:  "Payment authorization was not completed. Your security perimeter remains on the Community tier.",
};

function CancelContent() {
  const params = useSearchParams();
  const reason = params.get("reason") ?? "cancelled";
  const msg    = REASON_MESSAGES[reason] ?? DEFAULT_MESSAGE;

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "64px 24px", background: "#10131a", position: "relative", overflow: "hidden",
    }}>
      {/* Cyber grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(to right, rgba(140,144,159,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(140,144,159,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      {/* Red/error radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 55% 38% at 50% 0%, rgba(255,180,171,0.04) 0%, transparent 70%)",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "520px" }}
      >
        {/* ── Header bar (matches cancel page screenshot) ───────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(66,71,84,0.5)",
          padding: "14px 24px",
          background: "rgba(16,19,26,0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: "8px 8px 0 0",
          marginBottom: "0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Shield logo */}
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="#adc6ff"/>
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 600, color: "#e1e2ec" }}>
              Sentinel AI
            </span>
          </div>
        </div>

        {/* ── Main glassmorphism card ────────────────────────────────────────── */}
        <div style={{
          background:    "rgba(29,32,39,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border:        "1px solid rgba(66,71,84,0.5)",
          borderTop:     "none",
          borderRadius:  "0 0 12px 12px",
          padding:       "40px 40px 36px",
          position:      "relative",
          overflow:      "hidden",
          textAlign:     "center",
        }}>
          {/* Bottom corner decorators */}
          <div style={{ position: "absolute", bottom: 14, left: 14, width: 10, height: 10, borderBottom: "1px solid rgba(66,71,84,0.5)", borderLeft: "1px solid rgba(66,71,84,0.5)" }} />
          <div style={{ position: "absolute", bottom: 14, right: 14, width: 10, height: 10, borderBottom: "1px solid rgba(66,71,84,0.5)", borderRight: "1px solid rgba(66,71,84,0.5)" }} />

          {/* Error icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 18 }}
              style={{
                width: 88, height: 88, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,180,171,0.07)",
                border:     "1px solid rgba(255,180,171,0.25)",
                boxShadow:  "0 0 30px rgba(255,180,171,0.07)",
              }}
            >
              <XCircle size={40} style={{ color: "#ffb4ab", filter: "drop-shadow(0 0 10px rgba(255,180,171,0.5))" }} />
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize:   "28px",
              fontWeight: 700,
              color:      "#ffb4ab",
              marginBottom: "10px",
              letterSpacing: "-0.01em",
              filter: "drop-shadow(0 0 12px rgba(255,180,171,0.2))",
            }}
          >
            {msg.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px", color: "#8c909f",
              marginBottom: "28px",
              lineHeight: 1.6,
              maxWidth: 360,
              margin: "0 auto 28px",
            }}
          >
            {msg.body}
          </motion.p>

          {/* "Return to Pricing" small button (matches screenshot) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ marginBottom: "32px" }}
          >
            <Link
              href="/dashboard/pricing"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: "38px", padding: "0 22px",
                borderRadius: "6px",
                border: "1px solid rgba(66,71,84,0.7)",
                background: "rgba(39,42,49,0.6)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#e1e2ec",
                textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(76,215,246,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(54,57,65,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(66,71,84,0.7)"; (e.currentTarget as HTMLElement).style.background = "rgba(39,42,49,0.6)"; }}
            >
              Return to Pricing
            </Link>
          </motion.div>

          {/* Technical issue card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "rgba(16,19,26,0.7)",
              border:     "1px solid rgba(66,71,84,0.4)",
              borderRadius: "8px",
              padding:    "20px 24px",
              marginBottom: "24px",
              position:   "relative",
              overflow:   "hidden",
              display:    "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            {/* Top shimmer */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(173,198,255,0.2), transparent)",
            }} />
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 600, color: "#e1e2ec", marginBottom: "4px" }}>
                Encountered an issue?
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#8c909f" }}>
                Let us know if you faced a technical problem.
              </p>
            </div>
            <a
              href="mailto:support@sentinelai.io"
              style={{
                display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap",
                fontFamily: "'Space Grotesk', monospace",
                fontSize: "13px", fontWeight: 500,
                color: "#4cd7f6",
                textDecoration: "none",
                transition: "filter 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 6px rgba(76,215,246,0.5))"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = "none"; }}
            >
              Contact Command
              <span style={{ fontSize: "16px", lineHeight: 1 }}>›</span>
            </a>
          </motion.div>

          {/* Account status card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{
              background: "rgba(11,14,21,0.8)",
              border:     "1px solid rgba(66,71,84,0.3)",
              borderRadius: "8px",
              padding:    "16px 20px",
              marginBottom: "24px",
              position:   "relative",
              overflow:   "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, rgba(255,180,171,0.2), rgba(255,180,171,0.5), rgba(255,180,171,0.2))" }} />
            <p style={{ fontFamily: "'Space Grotesk', monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#4cd7f6", textTransform: "uppercase", marginBottom: "12px", textAlign: "left" }}>
              Account Status
            </p>
            {[
              ["Plan",           "Free (unchanged)"],
              ["Premium Access", "Not activated"],
              ["Charge",         "None — you were not billed"],
            ].map(([label, value], i, arr) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: "13px",
                padding: "8px 0",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(66,71,84,0.15)" : "none",
              }}>
                <span style={{ fontFamily: "'Inter', sans-serif", color: "#424754" }}>{label}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", color: "#c2c6d6", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </motion.div>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: "12px" }}
          >
            {/* Try Again — gradient */}
            <Link
              href="/dashboard/pricing"
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                height: "46px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #adc6ff, #4cd7f6)",
                fontFamily: "'Space Grotesk', monospace",
                fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#0b0e15",
                textDecoration: "none",
                boxShadow: "0 0 16px rgba(173,198,255,0.12)",
                transition: "opacity 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(76,215,246,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(173,198,255,0.12)"; }}
            >
              <RotateCcw size={14} />
              Return to Pricing
            </Link>

            {/* Support Uplink — outlined */}
            <a
              href="mailto:support@sentinelai.io"
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "46px",
                borderRadius: "8px",
                border: "1px solid rgba(140,144,159,0.4)",
                background: "transparent",
                fontFamily: "'Space Grotesk', monospace",
                fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#e1e2ec",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(173,198,255,0.4)"; (e.currentTarget as HTMLElement).style.color = "#adc6ff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(140,144,159,0.4)"; (e.currentTarget as HTMLElement).style.color = "#e1e2ec"; }}
            >
              Support Uplink
            </a>
          </motion.div>

          {/* Back to dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: "14px" }}
          >
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px", color: "#424754",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#8c909f"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#424754"; }}
            >
              <ArrowLeft size={13} />
              Back to Dashboard
            </Link>
          </motion.div>
        </div>

        {/* Support note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            textAlign: "center", marginTop: "14px",
            fontFamily: "'Space Grotesk', monospace",
            fontSize: "11px", color: "#32353c",
            letterSpacing: "0.04em",
          }}
        >
          Charged in error?{" "}
          <a href="mailto:support@sentinelai.io" style={{ color: "#424754", textDecoration: "none" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#8c909f"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#424754"; }}
          >
            contact support
          </a>
        </motion.p>
      </motion.div>
    </main>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}