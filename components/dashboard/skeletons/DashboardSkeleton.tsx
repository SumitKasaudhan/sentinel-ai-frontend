"use client";

import "@/styles/dashboard/layout/dashboard.css";
import "@/styles/dashboard/layout/dashboardv2.css";

const MINI_BAR_HEIGHTS = [11, 18, 10, 22, 15, 19, 13, 17, 11, 20];
const COUNTRY_WIDTHS = [85, 70, 60, 50, 40, 30];
const FLOW_BOXES = 4;
const TELEMETRY_VARIANTS: ("cyan" | "orange" | "purple" | "red")[] = [
  "cyan",
  "orange",
  "purple",
  "red",
];
const STAT_VARIANTS: ("cyan" | "blue" | "red" | "purple")[] = [
  "cyan",
  "blue",
  "red",
  "purple",
];
const COMPLEXITY_VARIANTS: ("critical" | "high" | "medium" | "low")[] = [
  "critical",
  "high",
  "medium",
  "low",
  "medium",
  "low",
];
const STATUS_VARIANTS: ("blocked" | "investigating" | "resolved" | "default")[] = [
  "blocked",
  "investigating",
  "resolved",
  "default",
  "blocked",
  "resolved",
];
const SEVERITY_LEGEND = [
  { color: "var(--red)" },
  { color: "var(--orange)" },
  { color: "var(--yellow)" },
  { color: "var(--cyan)" },
];

export default function DashboardSkeleton() {
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
          border-radius: 4px;
          flex-shrink: 0;
        }
        .tis-circle { border-radius: 50%; }
        .tis-pill { border-radius: 999px; }
      `}</style>

      <div className="dv2-page">
        {/* ── Top Bar ─────────────────────────────────────────────── */}
        <div className="dv2-topbar">
          <div className="dv2-topbar-left">
            <div className="tis-block" style={{ width: 160, height: 18 }} />
            <div className="tis-block" style={{ width: 240, height: 12, marginTop: 6 }} />
          </div>
          <div className="dv2-topbar-right">
            <div className="tis-block tis-pill" style={{ width: 150, height: 22 }} />
            <div className="tis-block tis-pill" style={{ width: 110, height: 22 }} />
            <div className="tis-block" style={{ width: 120, height: 28, borderRadius: 8 }} />
          </div>
        </div>

        <div className="dv2-content">
          {/* ── Row 1 — Stats + Quick Actions ────────────────────── */}
          <div className="dv2-stats-grid">
            {STAT_VARIANTS.map((variant, i) => (
              <div key={i} className={`dv2-stat-card dv2-stat-card--${variant}`}>
                <div className="dv2-stat-header-row">
                  <div className="tis-block" style={{ width: 70, height: 10 }} />
                  <div className="tis-block tis-circle" style={{ width: 14, height: 14 }} />
                </div>
                <div className="tis-block" style={{ width: 90, height: 32, marginTop: 8, borderRadius: 6 }} />
                <div className="dv2-stat-bar-wrap">
                  <div className="tis-block" style={{ width: `${40 + i * 12}%`, height: "100%" }} />
                </div>
                <div className="tis-block" style={{ width: 80, height: 10, marginTop: 8 }} />
                <div className="dv2-mini-bars">
                  {MINI_BAR_HEIGHTS.map((h, j) => (
                    <div key={j} className="dv2-mini-bar tis-block" style={{ height: h }} />
                  ))}
                </div>
              </div>
            ))}

            <div className="dv2-quick-card">
              <div className="tis-block" style={{ width: 90, height: 10 }} />
              <div className="dv2-quick-grid">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="dv2-quick-btn"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="tis-block" style={{ width: 14, height: 14, borderRadius: 4 }} />
                    <div className="tis-block" style={{ width: 50, height: 10 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 2 — Threat Trend + Countries ─────────────────── */}
          <div className="dv2-row dv2-row-2">
            <div className="dv2-col dv2-col-58">
              <div className="dv2-trend-card">
                <div className="dv2-trend-header">
                  <div className="dv2-trend-meta">
                    <div className="tis-block" style={{ width: 130, height: 12 }} />
                    <div className="tis-block" style={{ width: 90, height: 10, marginTop: 6 }} />
                  </div>
                  <div className="dv2-trend-controls">
                    <div className="tis-block tis-pill" style={{ width: 100, height: 20 }} />
                  </div>
                </div>
                <div className="dv2-trend-chart tis-block" style={{ borderRadius: 10 }} />
              </div>
            </div>

            <div className="dv2-col dv2-col-42">
              <div className="dv2-country-card">
                <div className="tis-block" style={{ width: 130, height: 12 }} />
                <div className="dv2-country-list">
                  {COUNTRY_WIDTHS.map((w, i) => (
                    <div key={i} className="dv2-country-row">
                      <div className="dv2-country-info">
                        <div className="tis-block" style={{ width: 90, height: 10 }} />
                        <div className="tis-block" style={{ width: 24, height: 10 }} />
                      </div>
                      <div className="dv2-country-bar-track">
                        <div className="tis-block" style={{ width: `${w}%`, height: "100%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 3 — AI Insights + Severity + Exploit Flow ────── */}
          <div className="dv2-row dv2-row-3">
            <div className="dv2-col dv2-col-33">
              <div className="dv2-insights-card">
                <div className="dv2-insights-header">
                  <div className="dv2-insights-icon">
                    <div className="tis-block" style={{ width: 12, height: 12, borderRadius: 3 }} />
                  </div>
                  <div className="tis-block" style={{ width: 110, height: 12 }} />
                </div>
                <div className="dv2-insights-list">
                  {(["critical", "warning", "info"] as const).map((kind, i) => (
                    <div key={i} className={`dv2-insight-item dv2-insight-item--${kind}`}>
                      <div className="dv2-insight-icon-wrap">
                        <div className="tis-block" style={{ width: 14, height: 14, borderRadius: 4 }} />
                      </div>
                      <div className="dv2-insight-body">
                        <div className="tis-block" style={{ width: "90%", height: 10 }} />
                        <div className="tis-block" style={{ width: "60%", height: 10 }} />
                        <div className={`dv2-insight-badge dv2-insight-badge--${kind}`} style={{ width: 50, height: 12 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dv2-col dv2-col-33">
              <div className="dv2-severity-card">
                <div className="tis-block" style={{ width: 130, height: 12 }} />
                <div className="dv2-sev-chart-wrap">
                  <div className="tis-block tis-circle" style={{ width: 140, height: 140 }} />
                </div>
                <div className="dv2-sev-legend">
                  {SEVERITY_LEGEND.map((s, i) => (
                    <div key={i} className="dv2-sev-legend-row">
                      <div className="dv2-sev-legend-left">
                        <div className="dv2-sev-dot" style={{ background: s.color }} />
                        <div className="tis-block" style={{ width: 50, height: 9 }} />
                      </div>
                      <div className="tis-block" style={{ width: 20, height: 9 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dv2-col dv2-col-33">
              <div className="dv2-flow-card">
                <div className="tis-block" style={{ width: 150, height: 12 }} />
                <div className="dv2-flow-stat-grid">
                  {Array.from({ length: FLOW_BOXES }).map((_, i) => (
                    <div key={i} className="dv2-flow-stat-box">
                      <div className="tis-block tis-circle" style={{ width: 18, height: 18 }} />
                      <div className="tis-block" style={{ width: 36, height: 14 }} />
                      <div className="tis-block" style={{ width: 50, height: 9 }} />
                    </div>
                  ))}
                </div>
                <div className="dv2-flow-resolution">
                  <div className="dv2-flow-res-header">
                    <div className="tis-block" style={{ width: 80, height: 9 }} />
                    <div className="tis-block" style={{ width: 30, height: 9 }} />
                  </div>
                  <div className="dv2-flow-res-bar-track">
                    <div className="tis-block" style={{ width: "65%", height: "100%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 4 — Security Process Overview (Telemetry) ────── */}
          <div className="dv2-telemetry-card">
            <div className="dv2-telemetry-header">
              <div className="tis-block" style={{ width: 160, height: 12 }} />
              <div className="tis-block" style={{ width: 60, height: 10 }} />
            </div>
            <div className="dv2-telemetry-items">
              {TELEMETRY_VARIANTS.map((variant, i) => (
                <div key={i} className="dv2-telemetry-item">
                  <div className={`dv2-tel-icon-box dv2-tel-icon-box--${variant}`}>
                    <div className="tis-block" style={{ width: 16, height: 16, borderRadius: 4 }} />
                  </div>
                  <div className="dv2-tel-text">
                    <div className="tis-block" style={{ width: 40, height: 16 }} />
                    <div className="tis-block" style={{ width: 70, height: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Row 5 — Activity Table ────────────────────────────── */}
          <div className="dv2-activity-card">
            <div className="dv2-activity-header">
              <div className="tis-block" style={{ width: 110, height: 12 }} />
              <div className="dv2-activity-controls">
                <div className="dv2-filter-tabs">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="tis-block tis-pill" style={{ width: 60, height: 22 }} />
                  ))}
                </div>
                <div className="tis-block" style={{ width: 26, height: 26, borderRadius: 6 }} />
              </div>
            </div>

            <div className="dv2-table-wrap">
              <table className="dv2-table">
                <thead>
                  <tr>
                    {["", "Hostname", "OS", "Malware", "Threat", "Complexity", "Time", "Status", ""].map(
                      (_, i) => (
                        <th key={i}>
                          <div className="tis-block" style={{ width: 40, height: 8 }} />
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {COMPLEXITY_VARIANTS.map((complexity, i) => (
                    <tr key={i}>
                      <td>
                        <div className="dv2-checkbox" />
                      </td>
                      <td>
                        <div className="dv2-hostname-cell">
                          <div className="dv2-host-icon">
                            <div className="tis-block" style={{ width: 12, height: 12, borderRadius: 3 }} />
                          </div>
                          <div className="tis-block" style={{ width: 90, height: 10 }} />
                        </div>
                      </td>
                      <td>
                        <div className="tis-block" style={{ width: 50, height: 10 }} />
                      </td>
                      <td>
                        <div className="tis-block" style={{ width: 70, height: 10 }} />
                      </td>
                      <td>
                        <div className="tis-block" style={{ width: 100, height: 10 }} />
                      </td>
                      <td>
                        <div className="dv2-complexity">
                          <div className={`dv2-complexity-dot dv2-complexity-dot--${complexity}`} />
                          <div className="tis-block" style={{ width: 50, height: 10 }} />
                        </div>
                      </td>
                      <td>
                        <div className="tis-block" style={{ width: 60, height: 10 }} />
                      </td>
                      <td>
                        <div
                          className={`dv2-status-badge dv2-status-badge--${STATUS_VARIANTS[i]}`}
                          style={{ width: 56, height: 15, display: "inline-block" }}
                        />
                      </td>
                      <td>
                        <div className="dv2-row-action">
                          <div className="tis-block" style={{ width: 14, height: 14, borderRadius: 3 }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dv2-table-footer">
              <div className="tis-block" style={{ width: 120, height: 10 }} />
              <div className="dv2-pagination">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="tis-block" style={{ width: 24, height: 24, borderRadius: 4 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}