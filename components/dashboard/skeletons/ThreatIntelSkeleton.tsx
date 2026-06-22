"use client";

import "@/styles/dashboard/threat-intelligence/threat-intelligence.css";

export default function ThreatIntelSkeleton() {
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
            rgba(34,211,238,0.10)  40%,
            rgba(34,211,238,0.16)  50%,
            rgba(34,211,238,0.10)  60%,
            rgba(255,255,255,0.04) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .tis-root { pointer-events: none; user-select: none; }
        .tis-scanbox { display: flex; gap: 0.6rem; align-items: center; }
        .tis-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .tis-stat-list { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.75rem; }
        .tis-stat-row { display: flex; justify-content: space-between; align-items: center; }
        .tis-trend { margin-top: 0.5rem; }
        .tis-summary-body { display: flex; gap: 1.25rem; align-items: flex-start; margin-top: 0.25rem; }
        .tis-donut-shell { position: relative; width: 116px; height: 116px; flex-shrink: 0; }
        .tis-donut-bg {
          width: 116px !important; height: 116px !important; border-radius: 50% !important;
          background: linear-gradient(90deg,
            rgba(255,255,255,0.04) 0%,
            rgba(34,211,238,0.08)  50%,
            rgba(255,255,255,0.04) 100%
          ) !important;
        }
        .tis-donut-center-skel {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .tis-summary-right { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
        .tis-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
        .tis-mini-box {
          border-radius: 8px; padding: 0.5rem 0.6rem;
          display: flex; flex-direction: column; align-items: flex-start;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .tis-prog-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .tis-prog-item { display: flex; flex-direction: column; }
        .tis-prog-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
        .tis-prog-fill { height: 100%; border-radius: 99px; }
        .tis-tabs { display: flex; gap: 0.4rem; margin-bottom: 0.6rem; }
        .tis-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .tis-intel-row {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 0.5rem; border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .tis-history-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.65rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .tis-history-row:last-child { border-bottom: none; }
        @media (prefers-reduced-motion: reduce) { .tis-block { animation: none; } }
      `}</style>

      <main className="ti-page tis-root">

        {/* HERO */}
        <section className="ti-hero">
          <div className="ti-hero-content">
            <div className="tis-block" style={{ width: 220, height: 22, borderRadius: 99, marginBottom: "0.75rem" }} />
            <div className="tis-block" style={{ width: "55%", height: 38, borderRadius: 6, marginBottom: "0.5rem" }} />
            <div className="tis-block" style={{ width: "75%", height: 14, borderRadius: 4, marginBottom: "0.4rem" }} />
            <div className="tis-block" style={{ width: "60%", height: 14, borderRadius: 4, marginBottom: "1.25rem" }} />
            <div className="tis-scanbox">
              <div className="tis-block" style={{ flex: 1, height: 44, borderRadius: 8 }} />
              <div className="tis-block" style={{ width: 90, height: 44, borderRadius: 8 }} />
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="ti-main-grid">

          {/* LEFT */}
          <div className="ti-left-col">

            {/* Perimeter */}
            <div className="ti-card">
              <div className="tis-card-header">
                <div className="tis-block" style={{ width: 120, height: 16, borderRadius: 4 }} />
                <div className="tis-block" style={{ width: 70, height: 14, borderRadius: 4 }} />
              </div>
              <div className="tis-stat-list">
                {[80, 95, 75, 90, 70].map((w, i) => (
                  <div className="tis-stat-row" key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="tis-block" style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0 }} />
                      <div className="tis-block" style={{ width: w + "%", maxWidth: 130, height: 13, borderRadius: 3 }} />
                    </div>
                    <div className="tis-block" style={{ width: 36, height: 13, borderRadius: 3 }} />
                  </div>
                ))}
              </div>
              <div className="tis-trend">
                <div className="tis-block" style={{ width: 80, height: 11, borderRadius: 3, marginBottom: "0.5rem" }} />
                <div className="tis-block" style={{ width: "100%", height: 52, borderRadius: 6 }} />
              </div>
            </div>

            {/* AI Threat Summary */}
            <div className="ti-card">
              <div className="tis-card-header">
                <div className="tis-block" style={{ width: 160, height: 16, borderRadius: 4 }} />
              </div>
              <div className="tis-block" style={{ width: "90%", height: 13, borderRadius: 3, marginBottom: "0.35rem" }} />
              <div className="tis-block" style={{ width: "70%", height: 13, borderRadius: 3, marginBottom: "1rem" }} />

              <div className="tis-summary-body">
                <div className="tis-donut-shell">
                  <div className="tis-block tis-donut-bg" />
                  <div className="tis-donut-center-skel">
                    <div className="tis-block" style={{ width: 28, height: 22, borderRadius: 4, marginBottom: 4 }} />
                    <div className="tis-block" style={{ width: 48, height: 10, borderRadius: 3 }} />
                  </div>
                </div>

                <div className="tis-summary-right">
                  <div className="tis-mini-grid">
                    {["#EF444433","#F9731633","#22D3EE22","#10B98133"].map((bg, i) => (
                      <div key={i} className="tis-mini-box" style={{ background: bg }}>
                        <div className="tis-block" style={{ width: 28, height: 20, borderRadius: 3, marginBottom: 4 }} />
                        <div className="tis-block" style={{ width: 44, height: 10, borderRadius: 3 }} />
                      </div>
                    ))}
                  </div>
                  <div className="tis-prog-list">
                    {[["28%","#EF4444"],["22%","#F97316"],["50%","#22D3EE"]].map(([w, c], i) => (
                      <div key={i} className="tis-prog-item">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <div className="tis-block" style={{ width: 50, height: 11, borderRadius: 3 }} />
                          <div className="tis-block" style={{ width: 28, height: 11, borderRadius: 3 }} />
                        </div>
                        <div className="tis-prog-track">
                          <div className="tis-prog-fill" style={{ width: w, background: c + "55" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tis-block" style={{ width: "100%", height: 36, borderRadius: 6, marginTop: "1rem" }} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="ti-right-col">

            {/* Recent Intel */}
            <div className="ti-card">
              <div className="tis-card-header">
                <div className="tis-block" style={{ width: 110, height: 16, borderRadius: 4 }} />
                <div className="tis-block" style={{ width: 70, height: 14, borderRadius: 4 }} />
              </div>
              <div className="tis-tabs">
                {[60, 70, 72, 55].map((w, i) => (
                  <div key={i} className="tis-block" style={{ width: w, height: 28, borderRadius: 6 }} />
                ))}
              </div>
              <div className="tis-block" style={{ width: "100%", height: 36, borderRadius: 6, marginBottom: "0.75rem" }} />
              <div className="tis-list">
                {[0,1,2].map((i) => (
                  <div key={i} className="tis-intel-row">
                    <div className="tis-block" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="tis-block" style={{ width: "65%", height: 13, borderRadius: 3, marginBottom: 5 }} />
                      <div className="tis-block" style={{ width: "45%", height: 11, borderRadius: 3 }} />
                    </div>
                    <div className="tis-block" style={{ width: 64, height: 22, borderRadius: 6, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Scan History */}
            <div className="ti-card ti-card-flush">
              <div className="tis-card-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.75rem" }}>
                <div className="tis-block" style={{ width: 110, height: 16, borderRadius: 4 }} />
                <div className="tis-block" style={{ width: 70, height: 14, borderRadius: 4 }} />
              </div>
              <div className="tis-list" style={{ marginTop: "0.25rem" }}>
                {[0,1,2,3].map((i) => (
                  <div key={i} className="tis-history-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="tis-block" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
                      <div>
                        <div className="tis-block" style={{ width: 130, height: 13, borderRadius: 3, marginBottom: 5 }} />
                        <div className="tis-block" style={{ width: 70, height: 11, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div className="tis-block" style={{ width: 76, height: 22, borderRadius: 6, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}