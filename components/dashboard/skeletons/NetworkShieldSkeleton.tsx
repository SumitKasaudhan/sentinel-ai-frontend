"use client";

import "@/styles/dashboard/network-shield/network-shield.css";
import { Shield, Activity, Flame, Filter, RefreshCw, Globe, AlertTriangle, Zap } from "lucide-react";

const STAT_ICONS = [Filter, Flame, Shield, AlertTriangle, Zap];
const SUMMARY_ROWS = [120, 100, 110, 100, 90];
const DIST_ROWS = [
  { label: 70, color: "#00ff9d" },
  { label: 45, color: "#f5a623" },
  { label: 20, color: "#ff4d4f" },
];
const TABLE_ROWS = 5;
const FEED_ITEMS = 6;

export default function NetworkShieldSkeleton() {
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
        .tis-pill { border-radius: 999px; }
      `}</style>

      <div className="network-page">
        {/* ── Hero ───────────────────────────────────────────── */}
        <div className="network-hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <div>
              <div className="hero-title">
                <Globe size={26} style={{ opacity: 0.3 }} />
                <h1 style={{ opacity: 0 }}>placeholder</h1>
                <div className="tis-block" style={{ width: 220, height: 22, position: "absolute" }} />
              </div>
              <div className="tis-block" style={{ width: 140, height: 13, marginTop: 4 }} />
            </div>

            <div className="sync-wrapper">
              <button className="sync-btn" disabled>
                <RefreshCw size={18} className="spin" style={{ opacity: 0.4 }} />
                Syncing
              </button>
            </div>
          </div>

          <div className="core-status">
            <span>CORE STATUS</span>
            <div className="tis-block" style={{ width: 130, height: 22, marginTop: 6 }} />
            <div className="tis-block" style={{ width: 160, height: 11, marginTop: 8 }} />
          </div>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────── */}
        <div className="stats-grid">
          {STAT_ICONS.map((Icon, i) => (
            <div key={i} className="stat-card">
              <div className="stat-top">
                <div className="tis-block" style={{ width: 90, height: 9 }} />
                <Icon size={18} style={{ opacity: 0.2 }} />
              </div>
              <div className="stat-main">
                <div className="tis-block" style={{ width: 56, height: 30 }} />
                <div className="tis-block" style={{ width: 50, height: 11 }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Exposure Summary + Risk Distribution ──────────── */}
        <div className="bottom-grid">
          <div className="table-card">
            <div className="table-header">
              <div className="tis-block" style={{ width: 170, height: 13 }} />
            </div>
            <table className="summary-table">
              <tbody>
                {SUMMARY_ROWS.map((w, i) => (
                  <tr key={i}>
                    <td>
                      <div className="tis-block" style={{ width: w, height: 11 }} />
                    </td>
                    <td>
                      <div className="tis-block" style={{ width: 30, height: 11, marginLeft: "auto" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <div className="table-header">
              <div className="tis-block" style={{ width: 140, height: 13 }} />
            </div>
            <div className="distribution-body">
              {DIST_ROWS.map((row, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div className="tis-block" style={{ width: 70, height: 11 }} />
                    <div className="tis-block" style={{ width: 20, height: 11 }} />
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 99,
                      background: "rgba(255,255,255,0.07)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="tis-block"
                      style={{ width: `${row.label}%`, height: "100%", borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Scans + Activity Feed ───────────────────── */}
        <div className="bottom-grid">
          <div className="table-card">
            <div className="table-header">
              <div className="tis-block" style={{ width: 110, height: 13 }} />
              <div className="tis-block" style={{ width: 50, height: 11 }} />
            </div>
            <div className="table-scroll-wrapper">
              <table>
                <thead>
                  <tr>
                    {["DOMAIN", "RISK SCORE", "RISK LEVEL", "SSL STATUS", "OPEN PORTS", "LAST SCAN"].map(
                      (_, i) => (
                        <th key={i}>
                          <div className="tis-block" style={{ width: 50, height: 8 }} />
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: TABLE_ROWS }).map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div className="tis-block" style={{ width: 100, height: 11 }} />
                      </td>
                      <td>
                        <div className="tis-block" style={{ width: 24, height: 13 }} />
                      </td>
                      <td>
                        <div className="tis-block tis-pill" style={{ width: 56, height: 18 }} />
                      </td>
                      <td>
                        <div className="tis-block tis-pill" style={{ width: 60, height: 18 }} />
                      </td>
                      <td>
                        <div className="tis-block" style={{ width: 50, height: 11 }} />
                      </td>
                      <td>
                        <div className="tis-block" style={{ width: 70, height: 11 }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="stream-card">
            <div className="stream-header">
              <Activity size={18} style={{ opacity: 0.3 }} />
              <div className="tis-block" style={{ width: 100, height: 13 }} />
            </div>
            <div className="logs">
              {Array.from({ length: FEED_ITEMS }).map((_, i) => (
                <div key={i} className="log-item info">
                  <div className="tis-block" style={{ width: 50, height: 9 }} />
                  <div className="tis-block" style={{ width: `${60 + (i % 3) * 15}%`, height: 11 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}