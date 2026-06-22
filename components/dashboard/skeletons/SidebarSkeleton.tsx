"use client";

export default function SidebarSkeleton() {
  return (
    <>
      <style>{`
        @keyframes tis-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .ss-block {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(0,211,243,0.08)   40%,
            rgba(0,211,243,0.13)   50%,
            rgba(0,211,243,0.08)   60%,
            rgba(255,255,255,0.03) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          flex-shrink: 0;
          border-radius: 4px;
        }
        @media (prefers-reduced-motion: reduce) { .ss-block { animation: none; } }
      `}</style>

      <aside className="dashboard-sidebar" style={{ pointerEvents: "none", userSelect: "none" }}>

        {/* ── TOP — brand ── */}
        <div className="sidebar-top">
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <div className="ss-block" style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0 }} />
            <div className="ss-block" style={{ width: 88, height: 15, borderRadius: 4 }} />
          </div>
        </div>

        {/* ── SYSTEM STATUS box ── */}
        <div
          className="system-box"
          style={{ opacity: 0.5 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div className="ss-block" style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0 }} />
            <div>
              <div className="ss-block" style={{ width: 80, height: 11, marginBottom: 6 }} />
              <div className="ss-block" style={{ width: 60, height: 10 }} />
            </div>
          </div>
          <div className="ss-block" style={{ width: 9, height: 9, borderRadius: "50%" }} />
        </div>

        {/* ── NAV ITEMS ── */}
        <nav className="sidebar-nav">
          {[72, 90, 78, 84, 68, 58, 64].map((w, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                height: 44,
                padding: "0 0.85rem",
                borderRadius: 12,
              }}
            >
              <div className="ss-block" style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0 }} />
              <div className="ss-block" style={{ width: w, height: 13 }} />
            </div>
          ))}
        </nav>

        {/* ── FOOTER — deploy btn ── */}
        <div className="sidebar-footer">
          <div className="ss-block" style={{ width: "100%", height: 44, borderRadius: 13 }} />
        </div>

      </aside>
    </>
  );
}