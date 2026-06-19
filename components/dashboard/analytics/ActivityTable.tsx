"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Monitor, Trash2, Filter, Loader2 } from "lucide-react";


interface Threat {
  id: string;
  scan_id?: string;          // ← ADD THIS
  threat_type: string;
  severity: string;
  status: string;
  country?: string;
  device?: string;
  created_at?: string;
}

interface ActivityTableProps {
  threats: Threat[];
  token: string | null;
  onDeleteThreat: (id: string) => Promise<void>;
}

const ROWS_PER_PAGE = 10;
const TABS = ["all", "blocked", "investigating", "resolved", "active"] as const;
type Tab = (typeof TABS)[number];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getOsLabel(device?: string): string {
  if (!device) return "Linux";
  const d = device.toLowerCase();
  if (d.includes("mac") || d.includes("mbp")) return "macOS 14";
  if (d.includes("win") || d.includes("ws"))  return "Windows 11";
  if (d.includes("rh")  || d.includes("rhel")) return "RHEL 9";
  if (d.includes("deb"))                        return "Debian 11";
  return "Linux";
}

function getMalwareType(t?: string): string {
  if (!t) return "Unknown";
  const s = t.toLowerCase();
  if (s.includes("ransom"))                     return "Ransomware";
  if (s.includes("trojan"))                     return "Trojan";
  if (s.includes("phish"))                      return "Phishing";
  if (s.includes("ddos") || s.includes("botnet")) return "Botnet";
  if (s.includes("spy"))                        return "Spyware";
  if (s.includes("root"))                       return "Rootkit";
  if (s.includes("back"))                       return "Backdoor";
  if (s.includes("worm"))                       return "Worm";
  if (s.includes("miner") || s.includes("crypto")) return "Cryptominer";
  if (s.includes("key"))                        return "Keylogger";
  if (s.includes("adware"))                     return "Adware";
  return t;
}

function getThreatName(id: string, type?: string): string {
  const MAP: Record<string, string> = {
    ransomware:  "LockBit 3.0",
    trojan:      "Emotet.Gen",
    phishing:    "QakBot.C2",
    ddos:        "MiraiBot.v4",
    botnet:      "Threat." + id.slice(0, 6).toUpperCase(),
    spyware:     "AgentTesla",
    rootkit:     "Necurs.V2",
    backdoor:    "DarkComet",
    worm:        "Conficker.D",
    cryptominer: "XMRig.v2",
    keylogger:   "HawkEye.R",
  };
  const key = type?.toLowerCase().split(/[\s_-]/)[0] ?? "";
  return MAP[key] ?? `Threat.${id.slice(0, 6).toUpperCase()}`;
}

function getTimeAgo(ts?: string): string {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function getSevLabel(sev: string): string {
  const s = sev?.toLowerCase();
  if (s === "critical") return "Critical";
  if (s === "high")     return "High";
  if (s === "medium")   return "Medium";
  return "Low";
}

function getSevDot(sev: string): string {
  const s = sev?.toLowerCase();
  if (s === "critical") return "dv2-complexity-dot--critical";
  if (s === "high")     return "dv2-complexity-dot--critical";
  if (s === "medium")   return "dv2-complexity-dot--high";
  return "dv2-complexity-dot--medium";
}

function getStatusClass(status: string): string {
  const s = status?.toLowerCase();
  if (s === "blocked")      return "dv2-status-badge--blocked";
  if (s === "investigating") return "dv2-status-badge--investigating";
  if (s === "resolved")     return "dv2-status-badge--resolved";
  return "dv2-status-badge--default";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ActivityTable({
  threats,
  token,
  onDeleteThreat,
}: ActivityTableProps) {
  const [activeTab, setActiveTab]   = useState<Tab>("all");
  const [page, setPage]             = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Derive filtered list from the threats prop passed down from the parent.
  // threats is the single source of truth — this component never mutates it.
  const filtered = useMemo(() => {
    if (activeTab === "all") return threats;
    return threats.filter((t) => t.status?.toLowerCase() === activeTab);
  }, [activeTab, threats]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));

  // ── Pagination guard ───────────────────────────────────────────────────────
  // When the parent removes a threat (optimistic delete), `filtered` shrinks.
  // If the current page no longer exists (e.g. you were on page 2 and now
  // there is only 1 page), snap back to page 1 so the table is never blank.
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  const pageData = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token || deletingId) return;
    setDeletingId(id);
    try {
      await onDeleteThreat(id);
    } finally {
      // Always clear the spinner — on success the row is gone from threats prop
      // so it disappears from the table; on failure it remains with no spinner.
      setDeletingId(null);
    }
  };

  // Show at most 5 page buttons; for very large sets a "…" indicator can be
  // added later without touching this component's delete logic.
  const pageNums = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, i) => i + 1
  );

  return (
    <div className="dv2-activity-card">

      {/* Header */}
      <div className="dv2-activity-header">
        <span className="dv2-activity-title">Recent Security Activity</span>

        <div className="dv2-activity-controls">
          <div className="dv2-filter-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`dv2-filter-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button className="dv2-filter-icon-btn" title="Filter">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="dv2-table-wrap">
        <table className="dv2-table">
          <thead>
            <tr>
              <th><input type="checkbox" className="dv2-checkbox" /></th>
              <th className="th-hostname">Hostname</th>
              <th>OS</th>
              <th>Malware Type</th>
              <th>Threat Name</th>
              <th>Complexity</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#62748E",
                    fontSize: 12,
                  }}
                >
                  No threats found
                </td>
              </tr>
            )}

            {pageData.map((item) => {
              const isDeleting = deletingId === item.id;
              return (
                <tr
                  key={item.id}
                  style={{ opacity: isDeleting ? 0.4 : 1, transition: "opacity 0.2s" }}
                >
                  {/* Checkbox */}
                  <td>
                    <input
                      type="checkbox"
                      className="dv2-checkbox"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  {/* Hostname */}
                  <td>
                    <Link
                     href={`/dashboard/threat-intelligence/${item.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="dv2-hostname-cell">
                        <div className="dv2-host-icon">
                          <Monitor size={12} />
                        </div>
                        <span className="dv2-host-name">
                          {item.device ?? `HOST-${item.id.slice(0, 6).toUpperCase()}`}
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* OS */}
                  <td>{getOsLabel(item.device)}</td>

                  {/* Malware Type */}
                  <td style={{ color: "#CAD5E2" }}>{getMalwareType(item.threat_type)}</td>

                  {/* Threat Name */}
                  <td>
                    <span className="dv2-threat-name">
                      {getThreatName(item.id, item.threat_type)}
                    </span>
                  </td>

                  {/* Complexity */}
                  <td>
                    <div className="dv2-complexity">
                      <div className={`dv2-complexity-dot ${getSevDot(item.severity)}`} />
                      {getSevLabel(item.severity)}
                    </div>
                  </td>

                  {/* Time */}
                  <td>{getTimeAgo(item.created_at)}</td>

                  {/* Status */}
                  <td>
                    <span className={`dv2-status-badge ${getStatusClass(item.status)}`}>
                      {item.status
                        ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                        : "Active"}
                    </span>
                  </td>

                  {/* Delete */}
                  <td>
                    <button
                      className="dv2-row-action"
                      title="Delete threat"
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={!!deletingId}
                      style={{ cursor: deletingId ? "not-allowed" : "pointer" }}
                    >
                      {isDeleting
                        ? <Loader2 size={14} style={{ animation: "dv2-spin 0.8s linear infinite" }} />
                        : <Trash2 size={14} />
                      }
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="dv2-table-footer">
        <span className="dv2-showing-text">
          Showing {Math.min(ROWS_PER_PAGE, filtered.length)} of {filtered.length} events
        </span>
        <div className="dv2-pagination">
          {pageNums.map((n) => (
            <button
              key={n}
              className={`dv2-page-btn${page === n ? " active" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}