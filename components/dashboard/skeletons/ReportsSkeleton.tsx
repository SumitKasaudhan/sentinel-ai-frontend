"use client";

import "@/styles/dashboard/reports/report2.css";
import {
  ClipboardList, FileText, AlertTriangle, Shield, Activity,
  CalendarClock, History, Clock, Database, Archive,
} from "lucide-react";

const HERO_STAT_ICONS = [
  { Icon: CalendarClock, accent: "cyan" },
  { Icon: History, accent: "purple" },
  { Icon: Clock, accent: "orange" },
  { Icon: Database, accent: "blue" },
  { Icon: Archive, accent: "green" },
];
const KPI_ICONS = [
  { Icon: FileText, accent: "cyan" },
  { Icon: AlertTriangle, accent: "red" },
  { Icon: Shield, accent: "green" },
  { Icon: Activity, accent: "orange" },
];
const TABLE_ROWS = 6;

export default function ReportsSkeleton() {
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
        .tis-pill { border-radius: 999px; }
      `}</style>

      <div className="reports-page">
        <main className="rp-content">

          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="rp-hero">
            <div className="rp-hero__bg" aria-hidden="true">
              <div className="rp-hero__grid" />
            </div>
            <div className="rp-hero__inner">
              <div className="rp-hero__top">
                <div className="rp-hero__heading">
                  <div className="rp-hero__icon">
                    <ClipboardList size={22} style={{ opacity: 0.3 }} />
                  </div>
                  <div className="rp-hero__heading-text">
                    <div className="tis-block" style={{ width: 200, height: 22 }} />
                    <div className="tis-block" style={{ width: 280, height: 13, marginTop: 6 }} />
                  </div>
                </div>
                <div className="rp-hero__action">
                  <div className="tis-block" style={{ width: 36, height: 36, borderRadius: 10 }} />
                  <div className="tis-block" style={{ width: 80, height: 11 }} />
                </div>
              </div>

              <div className="rp-hero__divider" />

              <div className="rp-hero__status">
                <div className="tis-block" style={{ width: 130, height: 10 }} />
                <div className="tis-block" style={{ width: 180, height: 22, marginTop: 8 }} />
                <div className="tis-block" style={{ width: 220, height: 11, marginTop: 6 }} />
              </div>

              <div className="rp-hero__stats">
                {HERO_STAT_ICONS.map(({ Icon }, i) => (
                  <div key={i} className="rp-hero__stat">
                    <div className="rp-hero__stat-top">
                      <div className="tis-block" style={{ width: 70, height: 9 }} />
                      <div className="rp-hero__stat-icon">
                        <Icon size={14} style={{ opacity: 0.25 }} />
                      </div>
                    </div>
                    <div className="tis-block" style={{ width: 60, height: 18, marginTop: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── KPIs ─────────────────────────────────────────── */}
          <section className="rp-kpis">
            {KPI_ICONS.map(({ Icon }, i) => (
              <div key={i} className="rp-kpi">
                <div className="rp-kpi__inner">
                  <div className="rp-kpi__top">
                    <div className="rp-kpi__meta">
                      <div className="tis-block" style={{ width: 110, height: 10 }} />
                      <div className="tis-block" style={{ width: 60, height: 26 }} />
                    </div>
                    <div className="rp-kpi__icon-badge" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <Icon size={20} style={{ opacity: 0.3 }} />
                    </div>
                  </div>
                  <div className="rp-kpi__foot">
                    <div className="tis-block" style={{ width: 40, height: 11 }} />
                    <div className="tis-block" style={{ width: 70, height: 11 }} />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* ── Charts ───────────────────────────────────────── */}
          <div className="rp-charts">

            <div className="rp-panel">
              <div className="rp-panel__inner">
                <div className="rp-panel__header">
                  <div>
                    <div className="tis-block" style={{ width: 160, height: 10 }} />
                    <div className="tis-block" style={{ width: 180, height: 14, marginTop: 6 }} />
                  </div>
                  <div className="rp-legend">
                    <div className="tis-block" style={{ width: 60, height: 11 }} />
                    <div className="tis-block" style={{ width: 60, height: 11 }} />
                  </div>
                </div>
                <div className="rp-chart-wrap">
                  <div className="tis-block" style={{ width: "100%", height: 260, borderRadius: 10 }} />
                </div>
              </div>
            </div>

            <div className="rp-panel">
              <div className="rp-panel__inner">
                <div className="rp-panel__header">
                  <div>
                    <div className="tis-block" style={{ width: 140, height: 10 }} />
                    <div className="tis-block" style={{ width: 100, height: 14, marginTop: 6 }} />
                  </div>
                  <Activity size={16} style={{ opacity: 0.2 }} />
                </div>
                <div className="rp-pie-section">
                  <div className="tis-block" style={{ width: 210, height: 210, borderRadius: "50%" }} />
                  <div className="rp-pie-legend">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="rp-pie-legend__row">
                        <div className="rp-pie-legend__left">
                          <div className="tis-block" style={{ width: 8, height: 8, borderRadius: "50%" }} />
                          <div className="tis-block" style={{ width: 70, height: 10 }} />
                        </div>
                        <div className="tis-block" style={{ width: 24, height: 10 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rp-panel">
              <div className="rp-panel__inner">
                <div className="rp-panel__header rp-panel__header--col">
                  <div className="tis-block" style={{ width: 130, height: 10 }} />
                  <div className="tis-block" style={{ width: 80, height: 26, marginTop: 4 }} />
                </div>
                <div className="rp-chart-wrap rp-chart-wrap--sm">
                  <div className="tis-block" style={{ width: "100%", height: 160, borderRadius: 10 }} />
                </div>
              </div>
            </div>

            <div className="rp-panel">
              <div className="rp-panel__inner">
                <div className="rp-panel__header">
                  <div>
                    <div className="tis-block" style={{ width: 140, height: 10 }} />
                    <div className="tis-block" style={{ width: 120, height: 14, marginTop: 6 }} />
                  </div>
                </div>
                <div className="rp-chart-wrap">
                  <div className="tis-block" style={{ width: "100%", height: 220, borderRadius: 10 }} />
                </div>
              </div>
            </div>

          </div>

          {/* ── Reports Table ────────────────────────────────── */}
          <div className="rp-panel rp-panel--table">
            <div className="rp-panel__inner">
              <div className="rp-panel__header">
                <div>
                  <div className="tis-block" style={{ width: 150, height: 10 }} />
                  <div className="tis-block" style={{ width: 130, height: 14, marginTop: 6 }} />
                </div>
              </div>

              <div className="rp-filter-tabs">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="tis-block tis-pill" style={{ width: 70, height: 24 }} />
                ))}
              </div>

              <div className="rp-table-outer">
                <table className="rp-table">
                  <thead>
                    <tr>
                      {["REPORT", "TYPE", "SEVERITY", "GENERATED", "SIZE", "ACTIONS"].map((_, i) => (
                        <th key={i} className="rp-table__th">
                          <div className="tis-block" style={{ width: 50, height: 8 }} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: TABLE_ROWS }).map((_, i) => (
                      <tr key={i} className="rp-table__row">
                        <td className="rp-table__td">
                          <div className="rp-report-cell">
                            <div className="tis-block" style={{ width: 36, height: 36, borderRadius: 10 }} />
                            <div className="rp-report-cell__info">
                              <div className="tis-block" style={{ width: 140, height: 12 }} />
                              <div className="tis-block" style={{ width: 80, height: 10 }} />
                            </div>
                          </div>
                        </td>
                        <td className="rp-table__td">
                          <div className="tis-block" style={{ width: 60, height: 11 }} />
                        </td>
                        <td className="rp-table__td">
                          <div className="tis-block tis-pill" style={{ width: 60, height: 18 }} />
                        </td>
                        <td className="rp-table__td">
                          <div className="tis-block" style={{ width: 70, height: 11 }} />
                        </td>
                        <td className="rp-table__td">
                          <div className="tis-block" style={{ width: 50, height: 11 }} />
                        </td>
                        <td className="rp-table__td">
                          <div className="rp-table__actions">
                            {[0, 1, 2].map((j) => (
                              <div key={j} className="tis-block" style={{ width: 32, height: 32, borderRadius: 8 }} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}