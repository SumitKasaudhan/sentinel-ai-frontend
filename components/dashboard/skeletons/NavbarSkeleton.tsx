"use client";

export default function NavbarSkeleton() {
  return (
    <>
      <style>{`
        @keyframes tis-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .ns-block {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(0,211,243,0.09)   40%,
            rgba(0,211,243,0.14)   50%,
            rgba(0,211,243,0.09)   60%,
            rgba(255,255,255,0.03) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @media (prefers-reduced-motion: reduce) { .ns-block { animation: none; } }
      `}</style>

      <header className="dashboard-navbar" style={{ pointerEvents: "none", userSelect: "none" }}>

        {/* ── LEFT ── */}
        <div className="navbar-left">

          {/* Mobile menu btn */}
          <div className="ns-block" style={{ width: 40, height: 40, borderRadius: 12 }} />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            <div className="ns-block" style={{ width: 36, height: 36, borderRadius: 11 }} />
            <div className="ns-block" style={{ width: 90, height: 16, borderRadius: 4 }} />
          </div>

          {/* Search box */}
          <div
            className="ns-block"
            style={{
              flex: 1,
              maxWidth: 480,
              height: 42,
              borderRadius: 12,
            }}
          />
        </div>

        {/* ── RIGHT ── */}
        <div className="navbar-right">
          {/* Upgrade btn / pro badge */}
          <div className="ns-block" style={{ width: 90, height: 40, borderRadius: 12 }} />
          {/* Bell */}
          <div className="ns-block" style={{ width: 40, height: 40, borderRadius: 12 }} />
          {/* Settings */}
          <div className="ns-block" style={{ width: 40, height: 40, borderRadius: 12 }} />
          {/* Avatar */}
          <div className="ns-block" style={{ width: 40, height: 40, borderRadius: 12 }} />
        </div>

      </header>
    </>
  );
}