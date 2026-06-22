"use client";

import "@/styles/dashboard/network-shield/network-shield.css";
import {
  Shield,
  Activity,
  Flame,
  Filter,
  RefreshCw,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";

import NetworkShieldSkeleton from "@/components/dashboard/skeletons/NetworkShieldSkeleton";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotify } from "@/components/dashboard/context/NotificationContext";



// ─────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface SSLInfo {
  valid: boolean;
}

interface SecurityHeaders {
  csp: boolean;
  hsts: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
}

interface PortInfo {
  openPorts: number[];
}

interface RecentScan {
  id: string;
  domain: string;
  risk_score: number;
  risk_level: string;
  ssl: SSLInfo;
  security_headers: SecurityHeaders;
  ports: PortInfo;
  created_at: string;
}

type FeedEventType = "info" | "safe" | "danger";

interface ActivityFeedItem {
  id: string;
  type: FeedEventType;
  message: string;
  time: string;
}

interface NetworkOverview {
  totalAssets: number;
  averageRiskScore: number;
  sslCoverage: number;
  criticalAssets: number;
  recentScans: RecentScan[];
  activityFeed: ActivityFeedItem[];
}

interface ApiResponse {
  success: boolean;
  data: NetworkOverview;
}

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
type SyncStatus = "idle" | "loading" | "success";

// ─────────────────────────────────────────────────────────
// Pure Helpers
// ─────────────────────────────────────────────────────────
function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return "LOW";
  if (score < 70) return "MEDIUM";
  return "HIGH";
}

/** Priority 2 — Colorize risk score numbers */
function getRiskScoreColor(score: number): string {
  if (score < 30) return "#00ff9d";
  if (score < 70) return "#f5a623";
  return "#ff4d4f";
}

function getCoreStatus(score: number): string {
  if (score < 30) return "Healthy";
  if (score < 70) return "Moderate Risk";
  return "Critical Exposure";
}

function getCoreStatusColor(score: number): string {
  if (score < 30) return "#00ff9d";
  if (score < 70) return "#f5a623";
  return "#ff4d4f";
}

function formatPorts(ports: number[]): string {
  if (!ports?.length) return "—";
  if (ports.length <= 3) return ports.join(", ");
  return `${ports.length} Ports`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────
// Risk Level Badge
// ─────────────────────────────────────────────────────────
function RiskBadge({ score }: { score: number }) {
  const level = getRiskLevel(score);

  const styleMap: Record<RiskLevel, React.CSSProperties> = {
    LOW: {
      background: "rgba(0,255,157,0.12)",
      color: "#00ff9d",
      border: "1px solid rgba(0,255,157,0.3)",
    },
    MEDIUM: {
      background: "rgba(245,166,35,0.12)",
      color: "#f5a623",
      border: "1px solid rgba(245,166,35,0.3)",
    },
    HIGH: {
      background: "rgba(255,77,79,0.12)",
      color: "#ff4d4f",
      border: "1px solid rgba(255,77,79,0.3)",
    },
  };

  return (
    <div
      className="status-badge"
      style={{
        ...styleMap[level],
        borderRadius: "6px",
        padding: "3px 10px",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {level}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Distribution Bar Row
// ─────────────────────────────────────────────────────────
function DistributionRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;

  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontSize: "13px",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.65)" }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{count}</span>
      </div>
      <div
        style={{
          height: "5px",
          borderRadius: "99px",
          background: "rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "99px",
            background: color,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default function NetworkShieldPage() {
  const router = useRouter();
  const notify = useNotify();
  const { getToken } = useAuth();

  const [overview, setOverview] = useState<NetworkOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  // Priority 5 — Track "Updated X ago"
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncAgo, setSyncAgo] = useState<string>("");
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    if (!lastSyncTime) return;

    const tick = () => {
      const secs = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
      if (secs < 60) setSyncAgo(`${secs}s ago`);
      else setSyncAgo(`${Math.floor(secs / 60)}m ago`);
    };

    tick();
    syncIntervalRef.current = setInterval(tick, 1000);

    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [lastSyncTime]);

  // ── Fetch ────────────────────────────────────────────
const fetchOverview = async () => {
  const startTime = Date.now();
  try {
    setSyncStatus("loading");
    const token = await getToken();
    if (!token) return;
    const res = await fetch(`${BASE_URL}/network-shield/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse = await res.json();
    if (json.success) {
      setOverview(json.data);
      setLastSyncTime(new Date());
      setSyncStatus("success");
      notify("Network Synced", `${json.data.totalAssets} assets updated`, "success");
      setTimeout(() => setSyncStatus("idle"), 2500);
    } else {
      setSyncStatus("idle");
      notify("Sync Failed", "Network data could not be retrieved", "error");
    }
  } catch {
    setSyncStatus("idle");
    notify("Sync Error", "Could not connect to network shield", "error");
  } finally {
    const elapsed = Date.now() - startTime;
    if (elapsed < 700) {
      await new Promise((r) => setTimeout(r, 700 - elapsed));
    }
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOverview();
  }, []);

  // ── Computed: Critical Findings ──────────────────────
  const criticalFindings = useMemo(() => {
    if (!overview?.recentScans?.length) return 0;
    return overview.recentScans.reduce((total, scan) => {
      let n = 0;
      if (!scan.security_headers?.csp) n++;
      if (!scan.security_headers?.hsts) n++;
      if (!scan.security_headers?.xFrameOptions) n++;
      if (!scan.security_headers?.xContentTypeOptions) n++;
      return total + n;
    }, 0);
  }, [overview?.recentScans]);

  // ── Priority 3 — Threat Density ─────────────────────
  const threatDensity = useMemo(() => {
    if (!overview?.totalAssets || overview.totalAssets === 0) return "—";
    return (criticalFindings / overview.totalAssets).toFixed(1);
  }, [criticalFindings, overview?.totalAssets]);

  const threatDensityColor = useMemo(() => {
    if (threatDensity === "—" || Number(threatDensity) === 0)
      return "var(--cyan, #00d4ff)";
    return Number(threatDensity) > 2 ? "#ff4d4f" : "#f5a623";
  }, [threatDensity]);

  // ── Computed: Risk Distribution ──────────────────────
  const riskDistribution = useMemo(() => {
    const scans = overview?.recentScans ?? [];
    return scans.reduce(
      (acc, s) => {
        const l = getRiskLevel(s.risk_score);
        if (l === "LOW") acc.low++;
        else if (l === "MEDIUM") acc.medium++;
        else acc.high++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );
  }, [overview?.recentScans]);

  // ── Computed: Exposure Summary ───────────────────────
  const exposureSummary = useMemo(() => {
    const scans = overview?.recentScans ?? [];
    if (!scans.length) return null;
    const withSSL = scans.filter((s) => s.ssl?.valid).length;
    const missingCSP = scans.filter((s) => !s.security_headers?.csp).length;
    const missingHSTS = scans.filter((s) => !s.security_headers?.hsts).length;
    const totalPorts = scans.reduce(
      (sum, s) => sum + (s.ports?.openPorts?.length ?? 0),
      0
    );
    const avgPorts = (totalPorts / scans.length).toFixed(1);
    return { withSSL, missingCSP, missingHSTS, avgPorts };
  }, [overview?.recentScans]);

  // ── Priority 4 — Grouped Activity Feed ──────────────
  const enhancedFeed = useMemo((): ActivityFeedItem[] => {
    if (!overview) return [];

    // Group all ports per scan into a single event
    const portGroupEvents: ActivityFeedItem[] = overview.recentScans
      .filter((scan) => (scan.ports?.openPorts ?? []).length > 0)
      .map((scan) => {
        const ports = scan.ports.openPorts;
        const count = ports.length;
        return {
          id: `ports-group-${scan.id}`,
          type: "info" as FeedEventType,
          message: `${count} open port${count !== 1 ? "s" : ""} detected on ${scan.domain} (${ports.join(", ")})`,
          time: scan.created_at,
        };
      });

    // Surface missing critical header warnings
    const headerWarnings: ActivityFeedItem[] = overview.recentScans.flatMap(
      (scan) => {
        const warnings: ActivityFeedItem[] = [];
        if (!scan.security_headers?.csp) {
          warnings.push({
            id: `warn-csp-${scan.id}`,
            type: "danger" as FeedEventType,
            message: `Missing CSP header on ${scan.domain}`,
            time: scan.created_at,
          });
        }
        if (!scan.security_headers?.hsts) {
          warnings.push({
            id: `warn-hsts-${scan.id}`,
            type: "danger" as FeedEventType,
            message: `Missing HSTS header on ${scan.domain}`,
            time: scan.created_at,
          });
        }
        return warnings;
      }
    );

    return [...overview.activityFeed, ...portGroupEvents, ...headerWarnings].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  }, [overview]);

  // ── Loading Skeleton ─────────────────────────────────
// ── Loading Skeleton ─────────────────────────────────
  if (loading) {
    return <NetworkShieldSkeleton />;
  }
  
  // ── Derived Values ───────────────────────────────────
  const score = overview?.averageRiskScore ?? 0;
  const scans = overview?.recentScans ?? [];
  const totalScans = scans.length;

  // ── Render ───────────────────────────────────────────
  return (
    <div className="network-page">

      {/* ════════════════ HERO ════════════════ */}
      <div className="network-hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <div>
            <div className="hero-title">
              <Globe size={26} />
              <h1>Network Security Posture</h1>
            </div>
            <p>
              Monitoring:
              <span> {overview?.totalAssets ?? 0} Assets</span>
            </p>
          </div>

          {/* Priority 5 — Sync wrapper with "Updated X ago" */}
          <div className="sync-wrapper">
            <button
              className="sync-btn"
              onClick={fetchOverview}
              disabled={syncStatus === "loading"}
            >
              {syncStatus === "loading" ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Syncing...
                </>
              ) : syncStatus === "success" ? (
                <>
                  <CheckCircle2 size={18} />
                  Updated
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Sync
                </>
              )}
            </button>

            {lastSyncTime && syncStatus !== "loading" && (
              <span className="sync-ago">Updated {syncAgo}</span>
            )}
          </div>
        </div>

        {/* Health indicator */}
        <div className="core-status">
          <span>CORE STATUS</span>
          <h3 style={{ color: getCoreStatusColor(score) }}>
            {getCoreStatus(score)}
          </h3>
          <small className="core-status-sub">Based on average risk score</small>
        </div>
      </div>

      {/* ════════════════ STAT CARDS ════════════════ */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <h4>PROTECTED ASSETS</h4>
            <Filter size={18} />
          </div>
          <div className="stat-main">
            <h2>{overview?.totalAssets ?? 0}</h2>
            <span className="positive">↗ Monitored</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h4>AVERAGE RISK SCORE</h4>
            <Flame size={18} />
          </div>
          <div className="stat-main">
            {/* Priority 2 — Colorized average risk score */}
            <h2 style={{ color: getRiskScoreColor(score) }}>{score}</h2>
            <span>/ 100</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h4>SSL COVERAGE</h4>
            <Shield size={18} />
          </div>
          <div className="stat-main">
            <h2>{overview?.sslCoverage ?? 0}%</h2>
            <span>Coverage</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h4>CRITICAL FINDINGS</h4>
            <AlertTriangle size={18} />
          </div>
          <div className="stat-main">
            <h2
              style={{
                color:
                  criticalFindings > 0
                    ? "#ff4d4f"
                    : "var(--cyan, #00d4ff)",
              }}
            >
              {criticalFindings}
            </h2>
            <span>Header Gaps</span>
          </div>
        </div>

        {/* Priority 3 — Threat Density (5th card) */}
        <div className="stat-card">
          <div className="stat-top">
            <h4>THREAT DENSITY</h4>
            <Zap size={18} />
          </div>
          <div className="stat-main">
            <h2 style={{ color: threatDensityColor }}>{threatDensity}</h2>
            <span style={{ fontSize: "11px", lineHeight: 1.3 }}>
              Findings&nbsp;/&nbsp;Asset
            </span>
          </div>
        </div>

      </div>

      {/* ════════════════ EXPOSURE + DISTRIBUTION ════════════════ */}
      {totalScans > 0 && (
        <div className="bottom-grid">

          {/* Asset Exposure Summary */}
          <div className="table-card">
            <div className="table-header">
              <h2>Asset Exposure Summary</h2>
            </div>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Total Domains Scanned</td>
                  <td>
                    <strong>{totalScans}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Domains With SSL</td>
                  <td>
                    <strong style={{ color: "#00ff9d" }}>
                      {exposureSummary?.withSSL ?? 0}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Domains Missing CSP</td>
                  <td>
                    <strong
                      style={{
                        color:
                          (exposureSummary?.missingCSP ?? 0) > 0
                            ? "#ff4d4f"
                            : "inherit",
                      }}
                    >
                      {exposureSummary?.missingCSP ?? 0}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Domains Missing HSTS</td>
                  <td>
                    <strong
                      style={{
                        color:
                          (exposureSummary?.missingHSTS ?? 0) > 0
                            ? "#ff4d4f"
                            : "inherit",
                      }}
                    >
                      {exposureSummary?.missingHSTS ?? 0}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Average Open Ports</td>
                  <td>
                    <strong>{exposureSummary?.avgPorts ?? "—"}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Risk Distribution */}
          <div className="table-card">
            <div className="table-header">
              <h2>Risk Distribution</h2>
            </div>
            <div className="distribution-body">
              <DistributionRow
                label="Low Risk"
                count={riskDistribution.low}
                total={totalScans}
                color="#00ff9d"
              />
              <DistributionRow
                label="Medium Risk"
                count={riskDistribution.medium}
                total={totalScans}
                color="#f5a623"
              />
              <DistributionRow
                label="High Risk"
                count={riskDistribution.high}
                total={totalScans}
                color="#ff4d4f"
              />
            </div>
          </div>

        </div>
      )}

      {/* ════════════════ SCANS TABLE + ACTIVITY FEED ════════════════ */}
      <div className="bottom-grid">

        {/* Priority 1 + 2 — Clickable rows + colorized scores */}
        <div className="table-card">
          <div className="table-header">
            <h2>Recent Scans</h2>
            <button>View All</button>
          </div>

          {totalScans === 0 ? (
            <div className="empty-state">
              <Shield size={36} />
              <p>No telemetry available.</p>
              <small>Run your first scan to populate Network Shield.</small>
            </div>
          ) : (
            <div className="table-scroll-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>DOMAIN</th>
                    <th>RISK SCORE</th>
                    <th>RISK LEVEL</th>
                    <th>SSL STATUS</th>
                    <th>OPEN PORTS</th>
                    <th>LAST SCAN</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr
                      key={scan.id}
                      className={`clickable-row${scan.risk_score >= 70 ? " danger-row" : ""}`}
                      onClick={() =>
                        router.push(`/dashboard/reports/${scan.id}`)
                      }
                      title={`Open report for ${scan.domain}`}
                    >
                      <td>
                        <strong>{scan.domain}</strong>
                      </td>

                      {/* Priority 2 — Colorized risk score */}
                      <td>
                        <span
                          className="risk-score-value"
                          style={{ color: getRiskScoreColor(scan.risk_score) }}
                        >
                          {scan.risk_score}
                        </span>
                      </td>

                      <td>
                        <RiskBadge score={scan.risk_score} />
                      </td>

                      <td>
                        <div
                          className={`status-badge ${
                            scan.ssl?.valid ? "online" : "danger"
                          }`}
                        >
                          {scan.ssl?.valid ? "ACTIVE" : "MISSING"}
                        </div>
                      </td>

                      <td className="ports-cell">
                        {formatPorts(scan.ports?.openPorts ?? [])}
                      </td>

                      <td>{formatDate(scan.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Priority 4 — Grouped Activity Feed */}
        <div className="stream-card">
          <div className="stream-header">
            <Activity size={18} />
            <h2>Activity Feed</h2>
          </div>

          <div className="logs">
            {enhancedFeed.length === 0 ? (
              <div className="log-item info" style={{ opacity: 0.4 }}>
                <span>[—]</span>
                <p>
                  No activity recorded. Run your first scan to populate Network
                  Shield.
                </p>
              </div>
            ) : (
              enhancedFeed.map((entry) => (
                <div key={entry.id} className={`log-item ${entry.type}`}>
                  <span>[{formatTime(entry.time)}]</span>
                  <p>{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}