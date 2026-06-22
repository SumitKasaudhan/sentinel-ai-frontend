"use client";
import "@/styles/dashboard/settings/settings.css";
import { Shield } from "lucide-react";

export default function SettingsSkeleton() {
  return (
    <>
      <style>{`
        @keyframes tis-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .tis-block {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.04) 0%,
            rgba(0,211,243,0.10)  40%,
            rgba(0,211,243,0.16)  50%,
            rgba(0,211,243,0.10)  60%,
            rgba(255,255,255,0.04) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .tis-circle { border-radius: 50%; }
      `}</style>

      <div className="sp-root">

        {/* ── Page Header ── */}
        <div className="sp-header">
          <div className="tis-block" style={{ width: 100, height: 22 }} />
          <div className="tis-block" style={{ width: 260, height: 12, marginTop: 8 }} />
        </div>

        {/* ── Profile Card ── */}
        <div className="sp-card">
          <div className="sp-card-header">
            <div className="sp-card-header-left">
              <div className="tis-block" style={{ width: 70, height: 15 }} />
              <div className="tis-block" style={{ width: 220, height: 11, marginTop: 6 }} />
            </div>
            <div className="tis-block" style={{ width: 130, height: 13 }} />
          </div>

          <div className="sp-divider" />

          {/* Avatar */}
          <div className="sp-avatar-row">
            <div className="sp-avatar-wrap">
              <div className="tis-block tis-circle" style={{ width: 80, height: 80 }} />
            </div>
          </div>

          {/* Form grid */}
          <div className="sp-form-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="sp-field">
                <div className="tis-block" style={{ width: 80, height: 11 }} />
                <div className="tis-block" style={{ width: "100%", height: 41.6, borderRadius: 10, marginTop: 4 }} />
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="sp-field sp-field--full" style={{ marginTop: 4 }}>
            <div className="tis-block" style={{ width: 30, height: 11 }} />
            <div className="tis-block" style={{ width: "100%", height: 81.6, borderRadius: 10, marginTop: 4 }} />
          </div>

          {/* Security section */}
          <div className="sp-inner-section">
            <div className="sp-inner-section-title">
              <Shield size={15} strokeWidth={2} style={{ color: "#00D3F2", opacity: 0.3 }} />
              <div className="tis-block" style={{ width: 130, height: 14 }} />
            </div>
            <div className="sp-divider" />
            <div className="sp-security-row">
              <div className="sp-security-text">
                <div className="tis-block" style={{ width: 60, height: 11 }} />
                <div className="tis-block" style={{ width: 240, height: 11, marginTop: 6 }} />
              </div>
              <div className="tis-block" style={{ width: 150, height: 33.6, borderRadius: 10 }} />
            </div>
          </div>

          {/* Actions */}
          <div className="sp-actions">
            <div className="tis-block" style={{ width: 90, height: 33.6, borderRadius: 10 }} />
            <div className="tis-block" style={{ width: 130, height: 32, borderRadius: 10 }} />
          </div>
        </div>

        {/* ── Subscription Card ── */}
        <div className="sp-card">
          <div className="sp-card-header">
            <div className="sp-card-header-left">
              <div className="tis-block" style={{ width: 160, height: 15 }} />
              <div className="tis-block" style={{ width: 200, height: 11, marginTop: 6 }} />
            </div>
            {/* Status pill */}
            <div className="tis-block" style={{ width: 70, height: 22, borderRadius: 999 }} />
          </div>

          <div className="sp-divider" />

          {/* Plan name + billing cycle */}
          <div className="sp-sub-plan-row">
            <div className="tis-block" style={{ width: 140, height: 36, borderRadius: 10 }} />
            <div className="tis-block" style={{ width: 90, height: 12 }} />
          </div>

          {/* Purchase date + Expiry date */}
          <div className="sp-form-grid">
            {[0, 1].map((i) => (
              <div key={i} className="sp-field">
                <div className="tis-block" style={{ width: 90, height: 11 }} />
                <div className="tis-block" style={{ width: "100%", height: 41.6, borderRadius: 10, marginTop: 4 }} />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="sp-sub-progress-wrap">
            <div className="sp-sub-progress-track">
              <div className="tis-block" style={{ width: "60%", height: "100%", borderRadius: 999 }} />
            </div>
            <div className="tis-block" style={{ width: 180, height: 11, marginTop: 8 }} />
          </div>
        </div>

      </div>
    </>
  );
}