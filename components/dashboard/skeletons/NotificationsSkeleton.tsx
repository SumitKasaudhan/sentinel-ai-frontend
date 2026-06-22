"use client";

export default function NotificationsSkeleton() {
  return (
    <>
      <style>{`
        @keyframes tis-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .ns2-block {
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
          border-radius: 4px;
          flex-shrink: 0;
        }
        @media (prefers-reduced-motion: reduce) { .ns2-block { animation: none; } }
      `}</style>

      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="notification-item"
          style={{
            pointerEvents: "none",
            userSelect: "none",
            display: "flex",        /* ← CSS class pe depend mat karo */
            alignItems: "flex-start",
            gap: "0.75rem",
            padding: "0.85rem 1rem",
          }}
        >
          {/* Icon box */}
          <div
            className="ns2-block"
            style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0 }}
          />

          {/* Content lines */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ns2-block" style={{ width: "70%", height: 13, marginBottom: 6 }} />
            <div className="ns2-block" style={{ width: "90%", height: 11 }} />
            <div className="ns2-block" style={{ width: 50,    height: 10, marginTop: 6 }} />
          </div>
        </div>
      ))}
    </>
  );
}