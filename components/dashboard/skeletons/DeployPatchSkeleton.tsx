"use client";

export default function DeployPatchSkeleton() {
  return (
    <>
      <style>{`
        @keyframes tis-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .dp-skel {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(88,229,255,0.10)  40%,
            rgba(88,229,255,0.16)  50%,
            rgba(88,229,255,0.10)  60%,
            rgba(255,255,255,0.03) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .dp-skel-grid {
          display: grid;
          grid-template-columns: 1.5fr 0.75fr;
          gap: 24px;
          padding: 24px;
          flex: 1;
          overflow: hidden;
        }
        .dp-skel-col { display: flex; flex-direction: column; gap: 24px; }
        .dp-skel-card {
          background: linear-gradient(180deg, rgba(15,18,28,0.96), rgba(11,14,22,0.96));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          overflow: hidden;
        }
        .dp-skel-card-header {
          height: 58px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .dp-skel-card-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .dp-skel-vuln-item {
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .dp-skel-pills { display: flex; gap: 8px; margin-top: 10px; }
        .dp-skel-risk-box { padding: 20px; display: flex; flex-direction: column; gap: 18px; }
        .dp-skel-risk-row { display: flex; justify-content: space-between; align-items: center; }
        .dp-skel-logs {
          flex: 1;
          min-height: 200px;
          padding: 18px;
          background: #050811;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .dp-skel-impact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 4px; }
        .dp-skel-impact-box {
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        @media (max-width: 1200px) {
          .dp-skel-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) { .dp-skel { animation: none; } }
      `}</style>

      <div className="dp-skel-grid">

        {/* ── LEFT COL ── */}
        <div className="dp-skel-col">

          {/* Threat Groups card */}
          <div className="dp-skel-card">
            <div className="dp-skel-card-header">
              <div className="dp-skel" style={{ width: 110, height: 15 }} />
              <div className="dp-skel" style={{ width: 80, height: 13 }} />
            </div>
            <div className="dp-skel-card-body">
              {[0, 1, 2].map((i) => (
                <div key={i} className="dp-skel-vuln-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <div className="dp-skel" style={{ width: 160, height: 18, borderRadius: 4 }} />
                      <div className="dp-skel" style={{ width: 60, height: 22, borderRadius: 8 }} />
                    </div>
                    <div className="dp-skel-pills">
                      <div className="dp-skel" style={{ width: 72, height: 22, borderRadius: 6 }} />
                      <div className="dp-skel" style={{ width: 58, height: 22, borderRadius: 6 }} />
                    </div>
                  </div>
                  {/* count badge */}
                  <div className="dp-skel" style={{ width: 42, height: 42, borderRadius: 12 }} />
                </div>
              ))}
            </div>
          </div>

          {/* AI Remediation Plan card */}
          <div className="dp-skel-card">
            <div className="dp-skel-card-header">
              <div className="dp-skel" style={{ width: 160, height: 15 }} />
              <div className="dp-skel" style={{ width: 80, height: 22, borderRadius: 8 }} />
            </div>
            <div className="dp-skel-card-body">
              {/* summary lines */}
              <div className="dp-skel" style={{ width: "100%", height: 13, borderRadius: 3 }} />
              <div className="dp-skel" style={{ width: "85%", height: 13, borderRadius: 3 }} />
              <div className="dp-skel" style={{ width: "70%", height: 13, borderRadius: 3, marginBottom: 6 }} />
              {/* action items */}
              {[0, 1].map((i) => (
                <div key={i} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="dp-skel" style={{ width: 120, height: 13 }} />
                    <div className="dp-skel" style={{ width: 60, height: 13 }} />
                  </div>
                  <div className="dp-skel" style={{ width: "100%", height: 12, borderRadius: 3 }} />
                  <div className="dp-skel" style={{ width: "75%", height: 12, borderRadius: 3 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COL ── */}
        <div className="dp-skel-col">

          {/* Simulated Impact card */}
          <div className="dp-skel-card">
            <div className="dp-skel-card-header">
              <div className="dp-skel" style={{ width: 130, height: 15 }} />
            </div>
            <div className="dp-skel-risk-box">
              <div className="dp-skel-risk-row">
                <div className="dp-skel" style={{ width: 120, height: 13 }} />
                <div className="dp-skel" style={{ width: 70, height: 54, borderRadius: 6 }} />
              </div>
              <div className="dp-skel-risk-row">
                <div className="dp-skel" style={{ width: 140, height: 13 }} />
                <div className="dp-skel" style={{ width: 70, height: 54, borderRadius: 6 }} />
              </div>
              {/* risk bar */}
              <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div className="dp-skel" style={{ width: "46%", height: "100%", borderRadius: 999 }} />
              </div>
              <div className="dp-skel" style={{ width: 160, height: 13, borderRadius: 3, alignSelf: "flex-end" }} />
              <div className="dp-skel-impact-grid">
                {[0, 1].map((i) => (
                  <div key={i} className="dp-skel-impact-box">
                    <div className="dp-skel" style={{ width: 80, height: 11 }} />
                    <div className="dp-skel" style={{ width: 50, height: 20 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Logs card */}
          <div className="dp-skel-card" style={{ flex: 1 }}>
            <div className="dp-skel-card-header">
              <div className="dp-skel" style={{ width: 100, height: 14 }} />
            </div>
            <div className="dp-skel-logs">
              {[180, 220, 160, 200, 140].map((w, i) => (
                <div key={i} className="dp-skel" style={{ width: w, height: 13, borderRadius: 3 }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}