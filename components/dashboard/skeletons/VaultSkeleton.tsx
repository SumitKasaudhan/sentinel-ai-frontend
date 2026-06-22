"use client";

import "@/styles/dashboard/vault/vault.css";
import {
  Shield, FileText, Archive, AlertTriangle, Download, Zap,
  Activity, TrendingUp, BarChart2, Database, Clock,
} from "lucide-react";

const HERO_ACCENTS: ("cyan" | "purple" | "red" | "green" | "amber")[] = [
  "cyan", "purple", "red", "green", "amber",
];
const TABLE_ROWS = 6;
const INSIGHT_ITEMS = 4;
const FINDING_ROWS = 4;
const RISK_ROWS = 4;
const SCAN_ITEMS = 5;
const TIMELINE_ITEMS = 4;

export default function VaultSkeleton() {
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
            rgba(0,212,255,0.10)  40%,
            rgba(0,212,255,0.16)  50%,
            rgba(0,212,255,0.10)  60%,
            rgba(255,255,255,0.04) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .tis-pill { border-radius: 999px; }
      `}</style>

      <div className="vault-page">

        {/* ── Quick Actions Bar ──────────────────────────── */}
        <div className="quick-actions-bar">
          <div className="qa-left">
            <Shield size={18} style={{ opacity: 0.3 }} />
            <div className="tis-block" style={{ width: 180, height: 16 }} />
          </div>
          <div className="qa-right">
            {[0, 1, 2].map((i) => (
              <div key={i} className="tis-block" style={{ width: 120, height: 30, borderRadius: 8 }} />
            ))}
          </div>
        </div>

        {/* ── Hero Cards ─────────────────────────────────── */}
        <div className="vault-hero">
          {HERO_ACCENTS.map((accent, i) => (
            <div key={i} className={`hero-card hero-${accent}`}>
              <div className="hero-icon">
                <div className="tis-block" style={{ width: 20, height: 20, borderRadius: 5 }} />
              </div>
              <div className="hero-body">
                <div className="tis-block" style={{ width: 70, height: 9 }} />
                <div className="tis-block" style={{ width: 40, height: 20, marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Repository Health Banner ───────────────────── */}
        <div className="health-banner">
          <div className="hb-title-area">
            <Activity size={14} style={{ opacity: 0.3 }} />
            <div className="tis-block" style={{ width: 110, height: 10 }} />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="hb-metric">
              <div className="tis-block" style={{ width: 80, height: 10 }} />
              <div className="tis-block" style={{ width: 30, height: 14 }} />
            </div>
          ))}
        </div>

        {/* ── Intelligence Bar ───────────────────────────── */}
        <div className="intel-bar">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="intel-metric">
              <div className="tis-block" style={{ width: 14, height: 14, borderRadius: 3 }} />
              <div className="tis-block" style={{ width: 70, height: 9 }} />
              <div className="tis-block" style={{ width: 60, height: 12 }} />
            </div>
          ))}
        </div>

        {/* ── Main Grid ──────────────────────────────────── */}
        <div className="vault-main-grid">

          {/* Left column */}
          <div className="vault-left-col">

            {/* Repository table */}
            <div className="repo-card">
              <div className="repo-header">
                <div className="repo-title">
                  <FileText size={17} style={{ opacity: 0.3 }} />
                  <div className="tis-block" style={{ width: 160, height: 13 }} />
                  <div className="tis-block tis-pill" style={{ width: 30, height: 16 }} />
                </div>
                <div className="tis-block" style={{ width: 180, height: 28, borderRadius: 8 }} />
              </div>

              <div className="filter-strip">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="tis-block tis-pill" style={{ width: 60, height: 20 }} />
                ))}
              </div>

              <div className="table-wrapper">
                <table className="repo-table">
                  <thead>
                    <tr>
                      {["Domain", "Risk Score", "Risk Level", "SSL", "Open Ports", "Scan Date", "Actions"].map(
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
                          <div className="domain-cell">
                            <div className="tis-block" style={{ width: 13, height: 13, borderRadius: 3 }} />
                            <div className="tis-block" style={{ width: 90, height: 11 }} />
                          </div>
                        </td>
                        <td>
                          <div className="score-cell">
                            <div className="tis-block" style={{ width: 24, height: 13 }} />
                            <div className="score-bar">
                              <div className="tis-block" style={{ width: `${40 + i * 8}%`, height: "100%" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="tis-block" style={{ width: 56, height: 18, borderRadius: 5 }} />
                        </td>
                        <td>
                          <div className="tis-block" style={{ width: 16, height: 16, borderRadius: 8 }} />
                        </td>
                        <td>
                          <div className="ports-cell">
                            <div className="tis-block" style={{ width: 26, height: 16, borderRadius: 5 }} />
                            <div className="tis-block" style={{ width: 26, height: 16, borderRadius: 5 }} />
                          </div>
                        </td>
                        <td>
                          <div className="tis-block" style={{ width: 60, height: 11 }} />
                        </td>
                        <td>
                          <div className="action-cell">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <div key={j} className="tis-block" style={{ width: 28, height: 28, borderRadius: 5 }} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <div className="tis-block" style={{ width: 110, height: 11 }} />
                <div className="pagination-controls">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="tis-block" style={{ width: 30, height: 30, borderRadius: 5 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Insights + Findings */}
            <div className="insights-grid">
              <div className="insights-card">
                <div className="card-header">
                  <TrendingUp size={15} style={{ opacity: 0.3 }} />
                  <div className="tis-block" style={{ width: 150, height: 12 }} />
                </div>
                <div className="insights-body">
                  {Array.from({ length: INSIGHT_ITEMS }).map((_, i) => (
                    <div key={i} className="insight-item">
                      <div className="insight-icon">
                        <div className="tis-block" style={{ width: 15, height: 15, borderRadius: 4 }} />
                      </div>
                      <div className="insight-text">
                        <div className="tis-block" style={{ width: 80, height: 9 }} />
                        <div className="tis-block" style={{ width: 60, height: 12 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="findings-card">
                <div className="card-header">
                  <Shield size={15} style={{ opacity: 0.3 }} />
                  <div className="tis-block" style={{ width: 140, height: 12 }} />
                </div>
                <div className="findings-body">
                  {Array.from({ length: FINDING_ROWS }).map((_, i) => (
                    <div key={i} className="finding-row">
                      <div className="finding-meta">
                        <div className="tis-block" style={{ width: 100, height: 10 }} />
                        <div className="tis-block" style={{ width: 30, height: 11 }} />
                      </div>
                      <div className="finding-track">
                        <div className="tis-block" style={{ width: `${30 + i * 15}%`, height: "100%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="vault-sidebar">

            <div className="analytics-card">
              <div className="card-header">
                <BarChart2 size={15} style={{ opacity: 0.3 }} />
                <div className="tis-block" style={{ width: 130, height: 12 }} />
              </div>
              <div className="stat-grid">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="stat-item">
                    <div className="tis-block" style={{ width: 70, height: 9 }} />
                    <div className="tis-block" style={{ width: 40, height: 16 }} />
                  </div>
                ))}
              </div>
              <div className="risk-distribution">
                <div className="tis-block" style={{ width: 100, height: 9, marginBottom: 10 }} />
                {Array.from({ length: RISK_ROWS }).map((_, i) => (
                  <div key={i} className="risk-bar-row">
                    <div className="risk-bar-meta">
                      <div className="tis-block" style={{ width: 50, height: 10 }} />
                      <div className="tis-block" style={{ width: 20, height: 10 }} />
                    </div>
                    <div className="risk-bar-track">
                      <div className="tis-block" style={{ width: `${25 + i * 15}%`, height: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-header">
                <Database size={15} style={{ opacity: 0.3 }} />
                <div className="tis-block" style={{ width: 110, height: 12 }} />
              </div>
              <div className="dq-body">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="dq-row">
                    <div className="dq-meta">
                      <div className="tis-block" style={{ width: 90, height: 10 }} />
                      <div className="tis-block" style={{ width: 30, height: 11 }} />
                    </div>
                    <div className="dq-track">
                      <div className="tis-block" style={{ width: `${50 + i * 15}%`, height: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="archive-card">
              <div className="card-header">
                <Archive size={15} style={{ opacity: 0.3 }} />
                <div className="tis-block" style={{ width: 110, height: 12 }} />
              </div>
              <div className="scan-list">
                {Array.from({ length: SCAN_ITEMS }).map((_, i) => (
                  <div key={i} className="scan-item">
                    <div className="scan-item-left">
                      <div className="scan-domain">
                        <div className="tis-block" style={{ width: 12, height: 12, borderRadius: 3 }} />
                        <div className="tis-block" style={{ width: 80, height: 10 }} />
                      </div>
                      <div className="scan-item-tags">
                        <div className="tis-block" style={{ width: 40, height: 14, borderRadius: 3 }} />
                        <div className="tis-block" style={{ width: 40, height: 14, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div className="scan-meta">
                      <div className="tis-block" style={{ width: 24, height: 13 }} />
                      <div className="tis-block" style={{ width: 40, height: 9 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="archive-card">
              <div className="card-header">
                <Clock size={15} style={{ opacity: 0.3 }} />
                <div className="tis-block" style={{ width: 130, height: 12 }} />
              </div>
              <div className="timeline-list">
                {Array.from({ length: TIMELINE_ITEMS }).map((_, i) => (
                  <div key={i} className="timeline-item">
                    <div className="tl-dot-wrap">
                      <div className="tis-block" style={{ width: 8, height: 8, borderRadius: "50%" }} />
                      <div className="tl-line" />
                    </div>
                    <div className="tl-content">
                      <div className="tis-block" style={{ width: 110, height: 10 }} />
                      <div className="tis-block" style={{ width: 70, height: 10 }} />
                      <div className="tis-block" style={{ width: 50, height: 9 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}