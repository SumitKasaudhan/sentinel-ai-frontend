"use client";

import "@/styles/dashboard/ai-terminal/ai-terminal.css";
import {
  Terminal, BrainCircuit, ShieldCheck, AlertTriangle, Cpu,
} from "lucide-react";

const SCRIPT_BUTTONS = 4;
const FEED_ITEMS = 5;

export default function AITerminalSkeleton() {
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
            rgba(0,183,255,0.10)  40%,
            rgba(0,183,255,0.16)  50%,
            rgba(0,183,255,0.10)  60%,
            rgba(255,255,255,0.04) 100%
          );
          background-size: 600px 100%;
          animation: tis-shimmer 2s ease-in-out infinite;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .tis-pill { border-radius: 999px; }
      `}</style>

      <div className="terminal-page">

        {/* ── Models Panel (left) ───────────────────────────── */}
        <div className="models-panel">
          <div className="panel-header">
            <div className="tis-block" style={{ width: 110, height: 13 }} />
            <div className="live-dot" style={{ opacity: 0.3 }} />
          </div>

          {[
            { Icon: BrainCircuit, accent: "oracle" },
            { Icon: ShieldCheck, accent: "guard" },
          ].map(({ Icon, accent }, i) => (
            <div key={i} className="model-card">
              <div className="model-top">
                <div className="model-title">
                  <div className={`model-icon ${accent}`} style={{ opacity: 0.4 }}>
                    <Icon size={15} />
                  </div>
                  <div className="tis-block" style={{ width: 90, height: 15 }} />
                </div>
                <div className="tis-block tis-pill" style={{ width: 60, height: 20 }} />
              </div>

              <div className="tis-block" style={{ width: 140, height: 12, marginTop: 10 }} />

              <div className="metric">
                <div className="metric-row">
                  <div className="tis-block" style={{ width: 110, height: 10 }} />
                  <div className="tis-block" style={{ width: 30, height: 10 }} />
                </div>
                <div className="bar">
                  <div className="tis-block" style={{ width: `${50 + i * 10}%`, height: "100%" }} />
                </div>
              </div>

              <div className="metric">
                <div className="metric-row">
                  <div className="tis-block" style={{ width: 100, height: 10 }} />
                  <div className="tis-block" style={{ width: 30, height: 10 }} />
                </div>
                <div className="bar">
                  <div className="tis-block" style={{ width: `${35 + i * 15}%`, height: "100%" }} />
                </div>
              </div>

              <div className="model-footer">
                <div className="tis-block" style={{ width: 100, height: 11 }} />
                <div className="tis-block" style={{ width: 30, height: 16 }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Terminal (center) ─────────────────────────────── */}
        <div className="terminal-wrapper">
          <div className="terminal-header">
            <div className="terminal-left">
              <Terminal size={16} style={{ opacity: 0.3 }} />
              <div className="tis-block" style={{ width: 140, height: 13 }} />
            </div>
            <div className="tis-block" style={{ width: 70, height: 28, borderRadius: 10 }} />
          </div>

          <div className="terminal-body">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div
                  className="tis-block"
                  style={{ width: `${30 + (i % 4) * 15}%`, height: 14 }}
                />
              </div>
            ))}
          </div>

          <div className="terminal-input">
            <span style={{ opacity: 0.3 }}>{">"}</span>
            <div className="tis-block" style={{ width: "60%", height: 16 }} />
            <div className="tis-block" style={{ width: 46, height: 46, borderRadius: 14 }} />
          </div>
        </div>

        {/* ── Right Panel ────────────────────────────────────── */}
        <div className="right-panel">
          <div className="script-card">
            <div className="script-header">
              <AlertTriangle size={16} style={{ opacity: 0.3 }} />
              <div className="tis-block" style={{ width: 130, height: 13 }} />
            </div>

            {Array.from({ length: SCRIPT_BUTTONS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "calc(100% - 24px)",
                  margin: 12,
                  minHeight: 56,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                }}
              >
                <div className="tis-block" style={{ width: "60%", height: 12 }} />
              </div>
            ))}
          </div>

          <div className="feed-card">
            <div className="feed-header">
              <Cpu size={16} style={{ opacity: 0.3 }} />
              <div className="tis-block" style={{ width: 140, height: 13 }} />
            </div>

            <div className="feed-list">
              {Array.from({ length: FEED_ITEMS }).map((_, i) => (
                <div key={i} className="feed-item info">
                  <div className="feed-line" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ flex: 1 }}>
                    <div className="tis-block" style={{ width: 50, height: 9 }} />
                    <div
                      className="tis-block"
                      style={{ width: `${70 + (i % 3) * 10}%`, height: 11, marginTop: 6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}