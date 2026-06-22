"use client";
import "@/styles/dashboard/pricing/Pricing.css";

export default function PricingSkeleton() {
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
            rgba(0,212,255,0.10)   40%,
            rgba(0,212,255,0.16)   50%,
            rgba(0,212,255,0.10)   60%,
            rgba(255,255,255,0.04) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          border-radius: 4px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="dash-pricing">

        {/* ── Header ── */}
        <div className="dash-pricing__header">
          {/* Back button */}
          <div className="tis-block" style={{ width: 80, height: 32, borderRadius: 6, marginBottom: 32 }} />

          {/* Title group */}
          <div className="dash-pricing__title-group">
            <div className="tis-block" style={{ width: 180, height: 26, borderRadius: 4, margin: "0 auto 16px" }} />
            <div className="tis-block" style={{ width: 420, height: 52, borderRadius: 6, margin: "0 auto 12px" }} />
            <div className="tis-block" style={{ width: 280, height: 16, borderRadius: 4, margin: "0 auto" }} />
          </div>
        </div>

        {/* ── Plans grid ── */}
        <div className="dash-pricing__grid">
          {/* Community */}
          <div className="dash-plan" style={{ "--plan-border": "rgba(148,163,184,0.15)" } as React.CSSProperties}>
            <div className="dash-plan__header">
              <div className="tis-block" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="tis-block" style={{ width: 100, height: 18 }} />
                <div className="tis-block" style={{ width: 160, height: 12 }} />
              </div>
            </div>
            <div className="tis-block" style={{ width: 80, height: 52, borderRadius: 6 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[140, 120, 110, 130].map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="tis-block" style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0 }} />
                  <div className="tis-block" style={{ width: w, height: 13 }} />
                </div>
              ))}
            </div>
            <div className="tis-block" style={{ width: "100%", height: 46, borderRadius: 8 }} />
          </div>

          {/* Professional (popular — elevated) */}
          <div
            className="dash-plan dash-plan--popular"
            style={{ "--plan-border": "rgba(0,212,255,0.4)", "--plan-glow": "rgba(0,212,255,0.12)" } as React.CSSProperties}
          >
            {/* Badge */}
            <div className="tis-block" style={{ width: 120, height: 24, borderRadius: 20, position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }} />

            <div className="dash-plan__header">
              <div className="tis-block" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="tis-block" style={{ width: 120, height: 18 }} />
                <div className="tis-block" style={{ width: 180, height: 12 }} />
              </div>
            </div>
            <div className="tis-block" style={{ width: 90, height: 52, borderRadius: 6 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[150, 200, 180, 160, 140, 170, 130, 100].map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="tis-block" style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0 }} />
                  <div className="tis-block" style={{ width: w, height: 13 }} />
                </div>
              ))}
            </div>
            <div className="tis-block" style={{ width: "100%", height: 46, borderRadius: 8 }} />
            <div className="tis-block" style={{ width: 200, height: 12, borderRadius: 4, margin: "0 auto" }} />
          </div>

          {/* Enterprise */}
          <div className="dash-plan" style={{ "--plan-border": "rgba(124,58,237,0.3)" } as React.CSSProperties}>
            <div className="dash-plan__header">
              <div className="tis-block" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="tis-block" style={{ width: 110, height: 18 }} />
                <div className="tis-block" style={{ width: 170, height: 12 }} />
              </div>
            </div>
            <div className="tis-block" style={{ width: 100, height: 52, borderRadius: 6 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[130, 190, 170, 150, 140, 160, 120, 110].map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="tis-block" style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0 }} />
                  <div className="tis-block" style={{ width: w, height: 13 }} />
                </div>
              ))}
            </div>
            <div className="tis-block" style={{ width: "100%", height: 46, borderRadius: 8 }} />
          </div>
        </div>

        {/* ── Comparison table ── */}
        <div className="dash-pricing__comparison">
          <div className="tis-block" style={{ width: 220, height: 26, borderRadius: 6, margin: "0 auto 20px" }} />
          <div className="dash-comparison-table-wrap">
            <table className="dash-comparison-table" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr>
                  {[160, 100, 140, 110].map((w, i) => (
                    <th key={i}>
                      <div className="tis-block" style={{ width: w, height: 12 }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }).map((_, ri) => (
                  <tr key={ri}>
                    {[130, 70, 90, 80].map((w, ci) => (
                      <td key={ci} className={ci === 2 ? "dash-comparison-table__pro-col" : ""}>
                        <div className="tis-block" style={{ width: w, height: 13 }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ strip ── */}
        <div className="dash-pricing__faq">
          {[0, 1, 2].map((i) => (
            <div key={i} className="dash-pricing__faq-item">
              <div className="tis-block" style={{ width: 160, height: 16, marginBottom: 10 }} />
              <div className="tis-block" style={{ width: "100%", height: 12, marginBottom: 6 }} />
              <div className="tis-block" style={{ width: "75%", height: 12 }} />
            </div>
          ))}
        </div>

      </div>
    </>
  );
}