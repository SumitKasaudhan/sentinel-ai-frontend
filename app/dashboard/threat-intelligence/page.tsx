"use client";

import "@/styles/dashboard/threat-intelligence/threat-intelligence.css";
import { getDashboardStats } from "@/services/dashboard.service";
import { useRouter } from "next/navigation";
import ThreatIntelSkeleton from "@/components/dashboard/skeletons/ThreatIntelSkeleton";

import {
  Shield, Globe, Search, Loader2,
  Sparkles, Activity, Clock, ChevronRight, Trash2,
} from "lucide-react";

import { useNotify } from "@/components/dashboard/context/NotificationContext";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ThreatItem = {
  id: string;
  target: string;
  status: "critical" | "clean" | "elevated";
  message: string;
  time: string;
  ip?: string;
};

export default function ThreatIntelligencePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { getToken } = useAuth();
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [target, setTarget] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalThreats: 0,
    blockedThreats: 0,
    criticalThreats: 0,
    activeDevices: 0,
    riskScore: 0,
    networkHealth: "",
  });

  const notify = useNotify();

  useEffect(() => {
    const startTime = Date.now();
    Promise.all([fetchHistory(), loadDashboardStats()]).finally(async () => {
      const elapsed = Date.now() - startTime;
      const minDisplay = 700;
      if (elapsed < minDisplay) {
        await new Promise((r) => setTimeout(r, minDisplay - elapsed));
      }
      setPageLoading(false);
    });
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const response = await fetch(`${API_URL}/scanner/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const mapped =
        data.scans?.map((scan: any) => ({
          id: scan.id,
          target: scan.target,
          status:
            scan.risk_level === "HIGH"
              ? "critical"
              : scan.risk_level === "MEDIUM"
              ? "elevated"
              : "clean",
          message: `Risk Score ${scan.risk_score}`,
          time: new Date(scan.created_at).toLocaleString(),
          ip: scan.ip_address || "",
        })) || [];
      setThreats(mapped);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const response = await getDashboardStats(token);
      setDashboardStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScan = async () => {
    if (!target.trim()) return;
    try {
      const validationResponse = await fetch(`${API_URL}/scanner/validate-domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: target.trim() }),
      });
      const validation = await validationResponse.json();
      if (!validation.valid) {
        notify("Invalid Target", validation.message, "error");
        return;
      }

      setIsScanning(true);
      setScanProgress(15);
      notify("Scan Started", `Scanning ${target.trim()}...`, "info");

      const token = await getToken();
      if (!token) {
        notify("Not signed in", "Please sign in again.", "error");
        return;
      }

      const response = await fetch(`${API_URL}/scanner/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ target: target.trim() }),
      });

      setScanProgress(75);
      const result = await response.json();

      if (!response.ok) {
        if (result.code === "SCAN_LIMIT_REACHED") {
          notify("Scan Limit Reached", result.message, "warning");
          setIsScanning(false);
          setScanProgress(0);
          router.push("/dashboard/pricing");
          return;
        }
        throw new Error(result.message || "Scan failed");
      }

      const score = result?.riskScore?.score || result?.risk_score || 0;
      const level = result?.riskScore?.level || result?.risk_level || "LOW";

      const newThreat: ThreatItem = {
        id: result?.scan?.id || crypto.randomUUID(),
        target: target.trim(),
        status: level === "HIGH" ? "critical" : level === "MEDIUM" ? "elevated" : "clean",
        message: `Risk Score ${score}`,
        time: "Just now",
      };

      setThreats((prev) => [newThreat, ...prev]);
      await fetchHistory();
      setScanProgress(100);

      if (level === "HIGH") {
        notify("Critical Threat Detected", `${target.trim()} — Risk Score ${score}`, "error");
      } else if (level === "MEDIUM") {
        notify("Elevated Risk Found", `${target.trim()} — Risk Score ${score}`, "warning");
      } else {
        notify("Scan Complete", `${target.trim()} is clean — Score ${score}`, "success");
      }

      setTimeout(() => {
        setTarget("");
        setScanProgress(0);
        setIsScanning(false);
      }, 500);
    } catch (error) {
      console.error(error);
      notify("Scan Failed", "Could not complete the scan. Try again.", "error");
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const getStatusBadgeText = (status: string) => {
    switch (status) {
      case "critical": return "CRITICAL";
      case "clean":    return "OPTIMAL";
      default:         return "NEUTRAL";
    }
  };

  const filteredThreats = threats.filter((item) => {
    const matchesSearch =
      item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      filter === "all"       ? true
      : filter === "scanned" ? true
      : filter === "clear"   ? item.status === "clean"
      : item.status === filter;
    return matchesSearch && matchesSeverity;
  });

  const handleDeleteThreat = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      const response = await fetch(`${API_URL}/scanner/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setThreats((prev) => prev.filter((item) => item.id !== id));
      notify("Log Deleted", "Scan record removed successfully", "success");
    } catch {
      notify("Delete Failed", "Could not remove the scan log", "error");
    }
  };

  const criticalCount = threats.filter((t) => t.status === "critical").length;
  const highCount     = dashboardStats.blockedThreats || 0;
  const activeCount   = threats.filter((t) => t.status === "elevated").length;
  const resolvedCount = threats.filter((t) => t.status === "clean").length;

  // ── Custom skeleton — shown while data loads ──
  if (pageLoading) return <ThreatIntelSkeleton />;

  return (
    <main className="ti-page">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="ti-hero">
        <svg
          className="ti-hero-globe"
          viewBox="0 0 540 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="nebula1" cx="70%" cy="20%" r="55%">
              <stop offset="0%"   stopColor="#1a6fc4" stopOpacity="0.55" />
              <stop offset="45%"  stopColor="#0e3a7a" stopOpacity="0.2"  />
              <stop offset="100%" stopColor="#05080F"  stopOpacity="0"   />
            </radialGradient>
            <radialGradient id="nebula2" cx="85%" cy="65%" r="40%">
              <stop offset="0%"   stopColor="#0c4fa8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#05080F"  stopOpacity="0"  />
            </radialGradient>
            <filter id="pf" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="pf2" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect width="540" height="300" fill="url(#nebula1)" />
          <rect width="540" height="300" fill="url(#nebula2)" />
          {([
            [420,18,0.9],[468,34,0.7],[390,55,0.5],[505,22,0.6],[448,70,0.4],
            [372,90,0.6],[490,88,0.5],[415,110,0.4],[530,105,0.7],[460,130,0.5],
            [395,145,0.4],[510,148,0.6],[440,168,0.3],[476,185,0.5],[520,170,0.4],
            [408,195,0.5],[455,210,0.3],[492,228,0.5],[418,240,0.4],[465,255,0.3],
          ] as [number,number,number][]).map(([cx,cy,op],i)=>(
            <circle key={`d${i}`} cx={cx} cy={cy} r="1" fill="#5bb8f5" opacity={op} />
          ))}
          {([
            [430,25,0.85],[472,62,0.75],[398,80,0.7],[515,44,0.8],[444,100,0.65],
            [488,118,0.7],[462,155,0.6],[408,172,0.65],[530,160,0.7],[478,200,0.6],
          ] as [number,number,number][]).map(([cx,cy,op],i)=>(
            <circle key={`m${i}`} cx={cx} cy={cy} r="1.5" fill="#7ecfff" opacity={op} filter="url(#pf)" />
          ))}
          <circle cx="466" cy="28"  r="2.5" fill="#a8e0ff" opacity="0.95" filter="url(#pf2)" />
          <circle cx="528" cy="108" r="2.2" fill="#a8e0ff" opacity="0.85" filter="url(#pf2)" />
          <circle cx="490" cy="185" r="2"   fill="#a8e0ff" opacity="0.75" filter="url(#pf2)" />
          <circle cx="462" cy="30"  r="1.2" fill="#ffffff" opacity="0.9" />
          <circle cx="528" cy="110" r="1"   fill="#ffffff" opacity="0.85" />
        </svg>

        <div className="ti-hero-content">
          <div className="ti-pill">
            <span className="ti-pill-dot" />
            GLOBAL NETWORK SCANNER ACTIVE
          </div>
          <h1 className="ti-title">
            Initiate <span className="ti-title-gradient">Deep Scan</span>
          </h1>
          <p className="ti-subtitle">
            Enter target coordinates for comprehensive threat analysis,
            vulnerability mapping, and dark web exposure correlation.
          </p>
          <div className={`ti-scanbox ${isScanning ? "scanning" : ""}`}>
            <div className="ti-scanbox-input-area">
              <Search size={16} className="ti-scanbox-icon" />
              <input
                type="text"
                placeholder="Target URL, IP Address, or Hash..."
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="ti-scanbox-input"
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
              />
            </div>
            <button className="ti-scanbox-btn" onClick={handleScan} disabled={isScanning}>
              {isScanning ? (
                <><Loader2 className="spin" size={14} /><span>{scanProgress}%</span></>
              ) : (
                <><span>SCAN</span><Activity size={14} /></>
              )}
            </button>
            {isScanning && (
              <div className="ti-scanbox-progress" style={{ width: `${scanProgress}%` }} />
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════ MAIN GRID ══════════════════ */}
      <section className="ti-main-grid">

        {/* LEFT COLUMN */}
        <div className="ti-left-col">

          {/* PERIMETER CARD */}
          <div className="ti-card">
            <div className="ti-card-header">
              <div className="ti-card-title">
                <Shield size={16} className="ti-icon-cyan" />
                <span>Perimeter</span>
                <span className="ti-live-badge">LIVE</span>
              </div>
              <button className="ti-view-all" onClick={() => router.push("/dashboard/report")}>
                VIEW ALL <ChevronRight size={12} />
              </button>
            </div>
            <div className="ti-perimeter-body">
              <div className="ti-stats-list">
                <div className="ti-stat-row">
                  <div className="ti-stat-label"><span className="ti-dot ti-dot-red" /><span>Total Threats</span></div>
                  <span className="ti-stat-value">{dashboardStats.totalThreats}</span>
                </div>
                <div className="ti-stat-row">
                  <div className="ti-stat-label"><span className="ti-dot ti-dot-orange" /><span>Blocked Threats</span></div>
                  <span className="ti-stat-value">{dashboardStats.blockedThreats}</span>
                </div>
                <div className="ti-stat-row">
                  <div className="ti-stat-label"><span className="ti-dot ti-dot-red" /><span>Critical Threats</span></div>
                  <span className="ti-stat-value">{dashboardStats.criticalThreats}</span>
                </div>
                <div className="ti-stat-row">
                  <div className="ti-stat-label"><span className="ti-dot ti-dot-cyan" /><span>Scan Rate</span></div>
                  <span className="ti-stat-value">
                    {dashboardStats.riskScore ? `${(dashboardStats.riskScore * 675).toLocaleString()}` : "0"}
                  </span>
                </div>
                <div className="ti-stat-row">
                  <div className="ti-stat-label"><span className="ti-dot ti-dot-purple" /><span>Active Services</span></div>
                  <span className="ti-stat-value">{dashboardStats.activeDevices}</span>
                </div>
              </div>
              <div className="ti-trend">
                <div className="ti-trend-label">Threat Trend</div>
                <div className="ti-trend-chart">
                  <svg viewBox="0 0 200 100" preserveAspectRatio="none" width="100%" height="100%">
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#22D3EE" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#22D3EE" stopOpacity="0"   />
                      </linearGradient>
                    </defs>
                    <path d="M0,80 L20,60 L40,70 L60,40 L80,50 L100,20 L120,55 L140,30 L160,45 L180,25 L200,40 L200,100 L0,100 Z" fill="url(#trendGrad)" />
                    <path d="M0,80 L20,60 L40,70 L60,40 L80,50 L100,20 L120,55 L140,30 L160,45 L180,25 L200,40" stroke="#22D3EE" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* AI THREAT SUMMARY CARD */}
          <div className="ti-card">
            <div className="ti-card-header">
              <div className="ti-card-title">
                <Sparkles size={16} className="ti-icon-cyan" />
                <span>AI Threat Summary</span>
              </div>
            </div>

            <p className="ti-summary-text">
              High-risk activity detected in target infrastructure. Immediate remediation recommended for critical assets.
            </p>

            <div className="ti-summary-body">
              <div className="ti-donut">
                <svg viewBox="0 0 128 128" width="128" height="128">
                  <circle cx="64" cy="64" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
                  <circle cx="64" cy="64" r="50" fill="none" stroke="#EF4444" strokeWidth="14" strokeDasharray="88 314"  strokeDashoffset="0"   transform="rotate(-90 64 64)" />
                  <circle cx="64" cy="64" r="50" fill="none" stroke="#F97316" strokeWidth="14" strokeDasharray="69 314"  strokeDashoffset="-88"  transform="rotate(-90 64 64)" />
                  <circle cx="64" cy="64" r="50" fill="none" stroke="#EAB308" strokeWidth="14" strokeDasharray="100 314" strokeDashoffset="-157" transform="rotate(-90 64 64)" />
                  <circle cx="64" cy="64" r="50" fill="none" stroke="#22D3EE" strokeWidth="14" strokeDasharray="57 314"  strokeDashoffset="-257" transform="rotate(-90 64 64)" />
                </svg>
                <div className="ti-donut-center">
                  <div className="ti-donut-num">{criticalCount || dashboardStats.criticalThreats || 0}</div>
                  <div className="ti-donut-label">THREATS</div>
                </div>
              </div>

              <div className="ti-summary-right">
                <div className="ti-mini-boxes">
                  <div className="ti-mini-box ti-mb-critical">
                    <div className="ti-mb-num">{criticalCount || dashboardStats.criticalThreats || 0}</div>
                    <div className="ti-mb-label">Critical</div>
                  </div>
                  <div className="ti-mini-box ti-mb-high">
                    <div className="ti-mb-num">{highCount || 0}</div>
                    <div className="ti-mb-label">High</div>
                  </div>
                  <div className="ti-mini-box ti-mb-active">
                    <div className="ti-mb-num">{activeCount || 0}</div>
                    <div className="ti-mb-label">Active</div>
                  </div>
                  <div className="ti-mini-box ti-mb-resolved">
                    <div className="ti-mb-num">{resolvedCount || 0}</div>
                    <div className="ti-mb-label">Resolved</div>
                  </div>
                </div>

                <div className="ti-prog-list">
                  <div className="ti-prog-item">
                    <div className="ti-prog-head"><span>Critical</span><span>28%</span></div>
                    <div className="ti-prog-bar"><div className="ti-prog-fill ti-pf-red"    style={{ width: "28%" }} /></div>
                  </div>
                  <div className="ti-prog-item">
                    <div className="ti-prog-head"><span>High</span><span>22%</span></div>
                    <div className="ti-prog-bar"><div className="ti-prog-fill ti-pf-orange" style={{ width: "22%" }} /></div>
                  </div>
                  <div className="ti-prog-item">
                    <div className="ti-prog-head"><span>Medium</span><span>50%</span></div>
                    <div className="ti-prog-bar"><div className="ti-prog-fill ti-pf-cyan"   style={{ width: "50%" }} /></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="ti-analysis-btn" onClick={() => router.push("/dashboard/report")}>
              VIEW FULL ANALYSIS
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="ti-right-col">

          {/* RECENT INTEL CARD */}
          <div className="ti-card">
            <div className="ti-card-header">
              <div className="ti-card-title">
                <Globe size={16} className="ti-icon-cyan" />
                <span>Recent Intel</span>
              </div>
              <button className="ti-view-all" onClick={() => router.push("/dashboard/report")}>
                VIEW ALL <ChevronRight size={12} />
              </button>
            </div>

            <div className="ti-filter-tabs">
              {["all", "critical", "scanned", "clear"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`ti-filter-tab ${filter === item ? "active" : ""}`}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search findings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ti-search-input"
            />

            <div className="ti-intel-list">
              {filteredThreats.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="ti-intel-item"
                  onClick={() => router.push(`/dashboard/reports/${item.id}`)}
                >
                  <div className="ti-intel-icon"><Globe size={14} /></div>
                  <div className="ti-intel-content">
                    <div className="ti-intel-target">{item.target}</div>
                    <div className="ti-intel-meta">{item.ip ? `${item.ip} · ` : ""}{item.time}</div>
                  </div>
                  <span className={`ti-badge ti-badge-${item.status}`}>{getStatusBadgeText(item.status)}</span>
                  <button
                    type="button"
                    className="ti-delete-btn"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const confirmed = window.confirm("Delete this scan log?");
                      if (!confirmed) return;
                      await handleDeleteThreat(item.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {filteredThreats.length === 0 && (
                <div className="ti-empty">No intel records found.</div>
              )}
            </div>
          </div>

          {/* SCAN HISTORY CARD */}
          <div className="ti-card ti-card-flush">
            <div className="ti-card-header ti-header-bordered">
              <div className="ti-card-title">
                <Clock size={16} className="ti-icon-cyan" />
                <span>Scan History</span>
              </div>
              <button className="ti-view-all" onClick={() => router.push("/dashboard/report")}>
                VIEW ALL <ChevronRight size={12} />
              </button>
            </div>
            <div className="ti-history-list">
              {filteredThreats.slice(0, 4).map((item, idx) => {
                const statusLabel =
                  item.status === "critical" ? "Failed"
                  : item.status === "elevated" ? "Scanning"
                  : "Completed";
                const statusClass =
                  item.status === "critical" ? "ti-hist-failed"
                  : item.status === "elevated" ? "ti-hist-scanning"
                  : "ti-hist-completed";
                return (
                  <div
                    key={`hist-${item.id}-${idx}`}
                    className="ti-history-row"
                    onClick={() => router.push(`/dashboard/reports/${item.id}`)}
                  >
                    <div className="ti-history-left">
                      <div className="ti-history-icon"><Activity size={14} /></div>
                      <div>
                        <div className="ti-history-target">{item.target}</div>
                        <div className="ti-history-time">{item.time}</div>
                      </div>
                    </div>
                    <span className={`ti-hist-badge ${statusClass}`}>{statusLabel}</span>
                  </div>
                );
              })}
              {filteredThreats.length === 0 && (
                <div className="ti-empty">No scan history yet.</div>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}