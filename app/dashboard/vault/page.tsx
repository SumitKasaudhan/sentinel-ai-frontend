"use client";

import "@/styles/dashboard/vault/vault.css";

import {
  FileText,
  Archive,
  AlertTriangle,
  Download,
  Globe,
  Shield,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Copy,
  History,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart2,
  Filter,
  ShieldAlert,
  Activity,
  TrendingUp,
  Crosshair,
  Zap,
  Eye,
  Lock,
  ShieldOff,
  X,
  Database,
} from "lucide-react";

import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useNotify } from "@/components/dashboard/context/NotificationContext";

/* ════════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════════ */

interface VaultOverview {
  savedReports:      number;
  archivedScans:     number;
  criticalAssets:    number;
  exportsGenerated:  number;
  latestScan:        string | null;
  highestRiskAsset:  string | null;
  averageRiskScore:  number;
  domainsWithSSL:    number;
}

interface Report {
  id:          string;
  scanId:      string;
  domain:      string;
  riskScore:   number;
  riskLevel:   RiskLevel;
  sslStatus:   boolean;
  missingCSP:  boolean;
  missingHSTS: boolean;
  missingXFrameOptions:        boolean;
  missingXContentTypeOptions:  boolean;
  openPorts:   number[];
  scanDate:    string;
  bookmarked:  boolean;
}

interface Scan {
  id:           string;
  domain:       string;
  riskScore:    number;
  riskLevel:    RiskLevel;
  lastScanDate: string;
  sslStatus:    boolean;
}

type RiskLevel  = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type SortKey    = "domain" | "riskScore" | "scanDate";
type SortDir    = "asc" | "desc";
type FilterKey  =
  | "all" | "ssl" | "csp" | "hsts"
  | "low" | "medium" | "high" | "critical";

interface Analytics {
  totalDomains:  number;
  sslEnabled:    number;
  missingCSP:    number;
  missingHSTS:   number;
  missingXFrameOptions:       number;
  missingXContentTypeOptions: number;
  averageRisk:   number;
  lowRisk:       number;
  mediumRisk:    number;
  highRisk:      number;
  criticalRisk:  number;
}

/* ════════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════════ */

const ITEMS_PER_PAGE = 10;

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "ssl",      label: "SSL Enabled" },
  { key: "csp",      label: "Missing CSP" },
  { key: "hsts",     label: "Missing HSTS" },
  { key: "low",      label: "Low Risk" },
  { key: "medium",   label: "Medium Risk" },
  { key: "high",     label: "High Risk" },
  { key: "critical", label: "Critical" },
];

/* ════════════════════════════════════════════════════════════════
   SHARED UTILITIES
   ════════════════════════════════════════════════════════════════ */

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

function riskClass(level: RiskLevel): string {
  return `risk-${level.toLowerCase()}`;
}

function riskScoreColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f97316";
  if (score >= 30) return "#f59e0b";
  return "#22c55e";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year:  "numeric",
      month: "short",
      day:   "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatRelative(iso: string): string {
  try {
    const diff  = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);
    if (mins  < 60)  return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    if (days  < 7)   return `${days}d ago`;
    if (days  < 30)  return `${Math.floor(days / 7)}w ago`;
    return formatDate(iso);
  } catch {
    return iso;
  }
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */

export default function VaultPage() {
  const router = useRouter();
  const notify = useNotify();

  const [overview,  setOverview]  = useState<VaultOverview | null>(null);
  const [reports,   setReports]   = useState<Report[]>([]);
  const [scans,     setScans]     = useState<Scan[]>([]);

  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeFilter,  setActiveFilter]  = useState<FilterKey>("all");
  const [sortKey,       setSortKey]       = useState<SortKey>("scanDate");
  const [sortDir,       setSortDir]       = useState<SortDir>("desc");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [bookmarks,     setBookmarks]     = useState<Set<string>>(new Set());
  const [copyFeedback,  setCopyFeedback]  = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  /* ── Fetch ───────────────────────────────────────────────────── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ovRes, rpRes, scRes] = await Promise.all([
        fetch("/api/vault/overview"),
        fetch("/api/vault/reports"),
        fetch("/api/vault/scans"),
      ]);
      if (!ovRes.ok) throw new Error(`Overview API error: ${ovRes.status}`);
      if (!rpRes.ok) throw new Error(`Reports API error: ${rpRes.status}`);
      if (!scRes.ok) throw new Error(`Scans API error: ${scRes.status}`);
      const [ovData, rpData, scData]: [VaultOverview, Report[], Scan[]] =
        await Promise.all([ovRes.json(), rpRes.json(), scRes.json()]);
      setOverview(ovData);
      setReports(rpData);
      setScans(scData);
      setBookmarks(new Set(rpData.filter((r) => r.bookmarked).map((r) => r.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vault data.");
      notify("Vault Load Failed", "Could not fetch intelligence data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!previewReport) return;
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setPreviewReport(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [previewReport]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewReport(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  /* ── Derived data ────────────────────────────────────────────── */
  const analytics = useMemo<Analytics | null>(() => {
    if (!reports.length) return null;
    return {
      totalDomains:  reports.length,
      sslEnabled:    reports.filter((r) => r.sslStatus === true).length,
      missingCSP:    reports.filter((r) => r.missingCSP).length,
      missingHSTS:   reports.filter((r) => r.missingHSTS).length,
      missingXFrameOptions:       reports.filter((r) => r.missingXFrameOptions).length,
      missingXContentTypeOptions: reports.filter((r) => r.missingXContentTypeOptions).length,
      averageRisk:   reports.reduce((s, r) => s + r.riskScore, 0) / reports.length,
      lowRisk:       reports.filter((r) => getRiskLevel(r.riskScore) === "LOW").length,
      mediumRisk:    reports.filter((r) => getRiskLevel(r.riskScore) === "MEDIUM").length,
      highRisk:      reports.filter((r) => getRiskLevel(r.riskScore) === "HIGH").length,
      criticalRisk:  reports.filter((r) => getRiskLevel(r.riskScore) === "CRITICAL").length,
    };
  }, [reports]);

  const insights = useMemo(() => {
    if (!reports.length) return null;
    const domainCount: Record<string, number> = {};
    reports.forEach((r) => { domainCount[r.domain] = (domainCount[r.domain] || 0) + 1; });
    const mostScanned = Object.entries(domainCount).sort((a, b) => b[1] - a[1])[0];
    const highest = reports.reduce((max, r) => r.riskScore > max.riskScore ? r : max, reports[0]);
    const sslCount = reports.filter((r) => r.sslStatus === true).length;
    return {
      mostScannedDomain: mostScanned?.[0] ?? "—",
      mostScannedCount:  mostScanned?.[1] ?? 0,
      highestRiskDomain: highest?.domain ?? "—",
      highestRiskScore:  highest?.riskScore ?? 0,
      sslAdoptionRate:   Math.round((sslCount / reports.length) * 100),
      averageRiskScore:  reports.reduce((s, r) => s + r.riskScore, 0) / reports.length,
    };
  }, [reports]);

  const activityTimeline = useMemo(() => {
    if (!reports.length) return [];
    const types = ["Report Generated", "Security Assessment Completed", "Scan Archived", "Threat Report Opened"];
    return reports.slice(0, 8).map((r, i) => ({
      id: r.id, type: types[i % types.length], domain: r.domain,
      date: r.scanDate, risk: getRiskLevel(r.riskScore),
    }));
  }, [reports]);

  const threatDensity = useMemo(() => {
    if (!reports.length || !analytics) return null;
    return Number((analytics.averageRisk / analytics.totalDomains).toFixed(1));
  }, [reports, analytics]);

  const dataQuality = useMemo(() => {
    if (!reports.length || !analytics) return null;
    const total = analytics.totalDomains;
    return {
      sslCoverage:    Math.round((analytics.sslEnabled / total) * 100),
      headerCoverage: Math.round(
        (((total - analytics.missingCSP) + (total - analytics.missingHSTS) +
          (total - analytics.missingXFrameOptions) + (total - analytics.missingXContentTypeOptions)) /
         (total * 4)) * 100
      ),
      assetVisibility: 100,
    };
  }, [reports, analytics]);

  const filtered = useMemo<Report[]>(() => {
    let result = [...reports];
    const q = searchQuery.trim().toLowerCase();
    if (q) result = result.filter((r) => r.domain.toLowerCase().includes(q));
    switch (activeFilter) {
      case "ssl":      result = result.filter((r) => r.sslStatus === true); break;
      case "csp":      result = result.filter((r) => r.missingCSP); break;
      case "hsts":     result = result.filter((r) => r.missingHSTS); break;
      case "low":      result = result.filter((r) => getRiskLevel(r.riskScore) === "LOW"); break;
      case "medium":   result = result.filter((r) => getRiskLevel(r.riskScore) === "MEDIUM"); break;
      case "high":     result = result.filter((r) => getRiskLevel(r.riskScore) === "HIGH"); break;
      case "critical": result = result.filter((r) => getRiskLevel(r.riskScore) === "CRITICAL"); break;
    }
    result.sort((a, b) => {
      let cmp = 0;
      if      (sortKey === "domain")    cmp = a.domain.localeCompare(b.domain);
      else if (sortKey === "riskScore") cmp = a.riskScore - b.riskScore;
      else if (sortKey === "scanDate")  cmp = new Date(a.scanDate).getTime() - new Date(b.scanDate).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [reports, searchQuery, activeFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = useMemo(() =>
    filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  );

  const pageNumbers = useMemo(() => {
    const count = Math.min(5, totalPages);
    let start = 1;
    if (totalPages > 5) {
      if (currentPage <= 3) start = 1;
      else if (currentPage >= totalPages - 2) start = totalPages - 4;
      else start = currentPage - 2;
    }
    return Array.from({ length: count }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  /* ── Handlers ────────────────────────────────────────────────── */
  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
    setCurrentPage(1);
  }, [sortKey]);

  const handleFilter = useCallback((f: FilterKey) => { setActiveFilter(f); setCurrentPage(1); }, []);
  const handleSearch = useCallback((q: string) => { setSearchQuery(q); setCurrentPage(1); }, []);

  const toggleBookmark = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        notify("Bookmark Removed", "Report removed from bookmarks", "info");
      } else {
        next.add(id);
        notify("Bookmark Saved", "Report added to bookmarks", "success");
      }
      return next;
    });
  }, [notify]);

  const copyLink = useCallback((scanId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/dashboard/reports/${scanId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyFeedback(scanId);
      setTimeout(() => setCopyFeedback(null), 1800);
      notify("Link Copied", "Report link copied to clipboard", "success");
    }).catch(() => {
      notify("Copy Failed", "Could not copy link to clipboard", "error");
    });
  }, [notify]);

  const handleExport = useCallback((reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (exportLoading) return;
    setExportLoading(reportId);
    notify("Download Started", "Report PDF is being prepared", "info");
    setTimeout(() => setExportLoading(null), 1400);
  }, [exportLoading, notify]);

  const navigateToReport = useCallback((scanId: string) => {
    router.push(`/dashboard/reports/${scanId}`);
  }, [router]);

  const handleExportAll = useCallback(() => {
    notify("Export Started", "All reports are being exported", "info");
  }, [notify]);
  const openPreview = useCallback((report: Report) => { setPreviewReport(report); }, []);

  const SortIcon = useCallback(({ k }: { k: SortKey }) => {
    const active = sortKey === k;
    const Icon = !active ? ChevronUp : sortDir === "asc" ? ChevronUp : ChevronDown;
    return <Icon size={11} className={`sort-icon${active ? " is-active" : ""}`} />;
  }, [sortKey, sortDir]);

  /* ════════════════════════════════════════════════════════════
     RENDER — LOADING
     ════════════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="vault-page">
        <div className="vault-loading">
          <RefreshCw size={30} className="spin" />
          <p>LOADING INTELLIGENCE VAULT…</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     RENDER — ERROR
     ════════════════════════════════════════════════════════════ */
  if (error) {
    return (
      <div className="vault-page">
        <div className="vault-error">
          <AlertTriangle size={36} />
          <h3>VAULT ACCESS FAILED</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchAll}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     RENDER — MAIN
     ════════════════════════════════════════════════════════════ */
  return (
    <div className="vault-page">

      {/* ═══ QUICK ACTIONS BAR ══════════════════════════════════ */}
      <div className="quick-actions-bar">
        <div className="qa-left">
          <Shield size={18} />
          <h1 className="qa-title">INTELLIGENCE VAULT</h1>
        </div>
        <div className="qa-right">
          <button className="qa-btn qa-scan" onClick={() => router.push("/dashboard/threat-intelligence")}>
            <Crosshair size={13} /> Run New Scan
          </button>
          <button className="qa-btn qa-threat" onClick={() => router.push("/dashboard/threat-intelligence")}>
            <Eye size={13} /> Threat Intelligence
          </button>
          <button className="qa-btn qa-export" onClick={handleExportAll}>
            <Download size={13} /> Export Reports
          </button>
        </div>
      </div>

      {/* ═══ HERO CARDS ═════════════════════════════════════════ */}
      <div className="vault-hero">
        <HeroCard icon={<FileText size={24} />} label="SAVED REPORTS" value={overview?.savedReports ?? 0} accent="cyan" />
        <HeroCard icon={<Archive size={24} />} label="ARCHIVED SCANS" value={overview?.archivedScans ?? 0} accent="purple" />
        <HeroCard icon={<AlertTriangle size={24} />} label="CRITICAL ASSETS" value={overview?.criticalAssets ?? 0} accent="red" />
        <HeroCard icon={<Download size={24} />} label="EXPORTS GENERATED" value={overview?.exportsGenerated ?? 0} accent="green" />
        <HeroCard icon={<Zap size={24} />} label="THREAT DENSITY" value={threatDensity ?? 0} accent="amber" suffix=" / asset" />
      </div>

      {/* ═══ REPOSITORY HEALTH BANNER ═══════════════════════════ */}
      <div className="health-banner">
        <div className="hb-title-area">
          <Activity size={14} />
          <span className="hb-title">REPOSITORY HEALTH</span>
        </div>
        <div className="hb-metrics">
          <div className="hb-metric">
            <span className="hb-label">Reports Stored</span>
            <span className="hb-value hb-cyan">{overview?.savedReports ?? 0}</span>
          </div>
          <div className="hb-sep" />
          <div className="hb-metric">
            <span className="hb-label">Archived Reports</span>
            <span className="hb-value hb-purple">{overview?.archivedScans ?? 0}</span>
          </div>
          <div className="hb-sep" />
          <div className="hb-metric">
            <span className="hb-label">Avg Risk Score</span>
            <span className="hb-value" style={{ color: riskScoreColor(overview?.averageRiskScore ?? 0) }}>
              {overview?.averageRiskScore != null ? overview.averageRiskScore.toFixed(1) : "—"}
            </span>
          </div>
          <div className="hb-sep" />
          <div className="hb-metric">
            <span className="hb-label">Critical Assets</span>
            <span className="hb-value hb-red">{overview?.criticalAssets ?? 0}</span>
          </div>
        </div>
      </div>

      {/* ═══ INTELLIGENCE BAR ═══════════════════════════════════ */}
      <div className="intel-bar">
        <div className="intel-metric">
          <Clock size={14} />
          <span className="intel-label">LATEST SCAN</span>
          <span className="intel-value intel-domain">{overview?.latestScan ?? "—"}</span>
        </div>
        <div className="intel-divider" />
        <div className="intel-metric">
          <ShieldAlert size={14} />
          <span className="intel-label">HIGHEST RISK ASSET</span>
          <span className="intel-value intel-risk">{overview?.highestRiskAsset ?? "—"}</span>
        </div>
        <div className="intel-divider" />
        <div className="intel-metric">
          <TrendingUp size={14} />
          <span className="intel-label">AVG RISK SCORE</span>
          <span className="intel-value" style={{ color: riskScoreColor(overview?.averageRiskScore ?? 0) }}>
            {overview?.averageRiskScore != null ? overview.averageRiskScore.toFixed(1) : "—"}
          </span>
        </div>
        <div className="intel-divider" />
        <div className="intel-metric">
          <Shield size={14} />
          <span className="intel-label">DOMAINS WITH SSL</span>
          <span className="intel-value intel-ssl">{overview?.domainsWithSSL ?? "—"}</span>
        </div>
      </div>

      {/* ═══ MAIN GRID ══════════════════════════════════════════ */}
      <div className="vault-main-grid">

        {/* ── LEFT COLUMN ────────────────────────────────────── */}
        <div className="vault-left-col">

          {/* ── REPORT REPOSITORY ─────────────────────────── */}
          <div className="repo-card">
            <div className="repo-header">
              <div className="repo-title">
                <FileText size={17} />
                <h2>REPORT_REPOSITORY</h2>
                <span className="repo-count">{filtered.length}</span>
              </div>
              <div className="repo-controls">
                <div className="search-box">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search domains…"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    aria-label="Search reports"
                  />
                </div>
              </div>
            </div>

            <div className="filter-strip">
              <Filter size={12} />
              {FILTER_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleFilter(key)}
                  className={`filter-btn ${key}${activeFilter === key ? " active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {paginated.length === 0 ? (
              <EmptyState
                icon={<Search size={38} />}
                title="NO REPORTS AVAILABLE"
                description={
                  searchQuery.trim() || activeFilter !== "all"
                    ? "No reports match your current filters. Try broadening your search."
                    : "Run a scan to populate your repository."
                }
              />
            ) : (
              <>
                <div className="table-wrapper">
                  <table className="repo-table">
                    <thead>
                      <tr>
                        <th className="th-sortable" onClick={() => handleSort("domain")}>
                          <span className="th-inner">Domain <SortIcon k="domain" /></span>
                        </th>
                        <th className="th-sortable" onClick={() => handleSort("riskScore")}>
                          <span className="th-inner">Risk Score <SortIcon k="riskScore" /></span>
                        </th>
                        <th><span className="th-inner">Risk Level</span></th>
                        <th><span className="th-inner">SSL</span></th>
                        <th><span className="th-inner">Open Ports</span></th>
                        <th className="th-sortable" onClick={() => handleSort("scanDate")}>
                          <span className="th-inner">Scan Date <SortIcon k="scanDate" /></span>
                        </th>
                        <th><span className="th-inner">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((report) => {
                        const isBookmarked = bookmarks.has(report.id);
                        const isCopied     = copyFeedback === report.scanId;
                        const isExporting  = exportLoading === report.id;
                        const derivedLevel = getRiskLevel(report.riskScore);
                        return (
                          <tr
                            key={report.id}
                            className={`repo-row${previewReport?.id === report.id ? " row-active" : ""}`}
                            onClick={() => openPreview(report)}
                          >
                            <td>
                              <div className="domain-cell">
                                <Globe size={13} />
                                <span>{report.domain}</span>
                              </div>
                            </td>
                            <td>
                              <div className="score-cell">
                                <span className="score-value" style={{ color: riskScoreColor(report.riskScore) }}>
                                  {report.riskScore}
                                </span>
                                <div className="score-bar">
                                  <div className="score-fill" style={{ width: `${Math.min(100, report.riskScore)}%`, background: riskScoreColor(report.riskScore) }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`risk-badge ${riskClass(derivedLevel)}`}>{derivedLevel}</span>
                            </td>
                            <td>
                              <div className="ssl-cell">
                                {report.sslStatus === true
                                  ? <CheckCircle size={16} className="ssl-yes" />
                                  : <XCircle size={16} className="ssl-no" />}
                              </div>
                            </td>
                            <td>
                              <div className="ports-cell">
                                {report.openPorts.length === 0 ? (
                                  <span className="no-ports">—</span>
                                ) : (
                                  <>
                                    {report.openPorts.slice(0, 3).map((p) => (
                                      <span key={p} className="port-tag">{p}</span>
                                    ))}
                                    {report.openPorts.length > 3 && (
                                      <span className="port-more">+{report.openPorts.length - 3}</span>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                            <td><span className="date-cell">{formatDate(report.scanDate)}</span></td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <div className="action-cell">
                                <button title="Open Report" className="action-btn ab-open" onClick={() => navigateToReport(report.scanId)}>
                                  <ExternalLink size={13} />
                                </button>
                                <button title="Download PDF" className={`action-btn ab-pdf${isExporting ? " ab-loading" : ""}`} onClick={(e) => handleExport(report.id, e)}>
                                  {isExporting ? <RefreshCw size={13} className="spin" /> : <Download size={13} />}
                                </button>
                                <button title={isBookmarked ? "Remove Bookmark" : "Bookmark"} className={`action-btn ab-bookmark${isBookmarked ? " bookmarked" : ""}`} onClick={(e) => toggleBookmark(report.id, e)}>
                                  {isBookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                                </button>
                                <button title={isCopied ? "Copied!" : "Copy Link"} className={`action-btn ab-copy${isCopied ? " copied" : ""}`} onClick={(e) => copyLink(report.scanId, e)}>
                                  <Copy size={13} />
                                </button>
                                <button title="View History" className="action-btn ab-history" onClick={() => router.push(`/dashboard/reports/${report.scanId}/history`)}>
                                  <History size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <span className="pagination-info">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                    <div className="pagination-controls">
                      <button className="page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous page">
                        <ChevronLeft size={15} />
                      </button>
                      {pageNumbers.map((n) => (
                        <button key={n} className={`page-btn${currentPage === n ? " pg-active" : ""}`} onClick={() => setCurrentPage(n)}>
                          {n}
                        </button>
                      ))}
                      <button className="page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Next page">
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {/* ── END REPO-CARD ──────────────────────────────── */}

          {/* ── INSIGHTS + FINDINGS ────────────────────────── */}
          {reports.length > 0 && (
            <div className="insights-grid">
              <div className="insights-card">
                <div className="card-header">
                  <TrendingUp size={15} />
                  <h3>REPOSITORY_INSIGHTS</h3>
                </div>
                <div className="insights-body">
                  <InsightItem icon={<Crosshair size={15} />} label="Most Scanned Domain" value={insights?.mostScannedDomain ?? "—"} sub={insights ? `${insights.mostScannedCount} scans` : undefined} accent="cyan" />
                  <InsightItem icon={<AlertTriangle size={15} />} label="Highest Risk Asset" value={insights?.highestRiskDomain ?? "—"} sub={insights ? `Score: ${insights.highestRiskScore}` : undefined} accent="red" />
                  <InsightItem icon={<Lock size={15} />} label="SSL Adoption Rate" value={insights ? `${insights.sslAdoptionRate}%` : "—"} accent="green" />
                  <InsightItem icon={<Zap size={15} />} label="Average Risk Score" value={insights ? insights.averageRiskScore.toFixed(1) : "—"} accent={(insights?.averageRiskScore ?? 0) >= 60 ? "red" : (insights?.averageRiskScore ?? 0) >= 30 ? "amber" : "green"} />
                </div>
              </div>

              <div className="findings-card">
                <div className="card-header">
                  <ShieldOff size={15} />
                  <h3>SECURITY_FINDINGS</h3>
                </div>
                {analytics ? (
                  <div className="findings-body">
                    <FindingBar label="Missing CSP" count={analytics.missingCSP} total={analytics.totalDomains} color="#f59e0b" />
                    <FindingBar label="Missing HSTS" count={analytics.missingHSTS} total={analytics.totalDomains} color="#f97316" />
                    <FindingBar label="Missing X-Frame-Options" count={analytics.missingXFrameOptions} total={analytics.totalDomains} color="#ef4444" />
                    <FindingBar label="Missing X-Content-Type-Options" count={analytics.missingXContentTypeOptions} total={analytics.totalDomains} color="#a855f7" />
                  </div>
                ) : (
                  <EmptyState icon={<ShieldOff size={30} />} title="NO FINDINGS" description="Security findings will appear after scanning." compact />
                )}
              </div>
            </div>
          )}
          {/* ── END INSIGHTS ───────────────────────────────── */}

        </div>
        {/* ── END LEFT COLUMN ────────────────────────────────── */}

        {/* ── SIDEBAR ────────────────────────────────────────── */}
        <div className="vault-sidebar">

          <div className="analytics-card">
            <div className="card-header">
              <BarChart2 size={15} />
              <h3>ASSET_INTELLIGENCE</h3>
            </div>
            {analytics ? (
              <>
                <div className="stat-grid">
                  <StatItem label="TOTAL DOMAINS" value={analytics.totalDomains} />
                  <StatItem label="SSL ENABLED" value={analytics.sslEnabled} accent="cyan" />
                  <StatItem label="MISSING CSP" value={analytics.missingCSP} accent={analytics.missingCSP > 0 ? "warning" : undefined} />
                  <StatItem label="MISSING HSTS" value={analytics.missingHSTS} accent={analytics.missingHSTS > 0 ? "warning" : undefined} />
                  <StatItem label="AVG RISK SCORE" value={analytics.averageRisk.toFixed(1)} accent={analytics.averageRisk >= 60 ? "danger" : analytics.averageRisk >= 30 ? "warning" : "green"} />
                </div>
                <div className="risk-distribution">
                  <p className="risk-dist-title">RISK_DISTRIBUTION</p>
                  <RiskBar label="LOW"      count={analytics.lowRisk}      total={analytics.totalDomains} color="#22c55e" />
                  <RiskBar label="MEDIUM"   count={analytics.mediumRisk}   total={analytics.totalDomains} color="#f59e0b" />
                  <RiskBar label="HIGH"     count={analytics.highRisk}     total={analytics.totalDomains} color="#f97316" />
                  <RiskBar label="CRITICAL" count={analytics.criticalRisk} total={analytics.totalDomains} color="#ef4444" />
                </div>
              </>
            ) : (
              <EmptyState icon={<Activity size={32} />} title="NO DATA" description="Run scans to populate analytics." compact />
            )}
          </div>

          {dataQuality && (
            <div className="analytics-card">
              <div className="card-header">
                <Database size={15} />
                <h3>DATA_QUALITY</h3>
              </div>
              <div className="dq-body">
                <DQBar label="SSL Coverage"     value={dataQuality.sslCoverage}      color="var(--cyan)" />
                <DQBar label="Header Coverage"  value={dataQuality.headerCoverage}   color="var(--amber)" />
                <DQBar label="Asset Visibility" value={dataQuality.assetVisibility}  color="var(--green)" />
              </div>
            </div>
          )}

          <div className="archive-card">
            <div className="card-header">
              <Archive size={15} />
              <h3>SCAN_ARCHIVE</h3>
            </div>
            {scans.length === 0 ? (
              <EmptyState icon={<Archive size={30} />} title="NO ARCHIVED SCANS" description="Scans will appear here once you run your first assessment." compact />
            ) : (
              <div className="scan-list">
                {scans.slice(0, 10).map((scan) => {
                  const derivedLevel = getRiskLevel(scan.riskScore);
                  return (
                    <div key={scan.id} className="scan-item" onClick={() => router.push(`/dashboard/reports/${scan.id}`)}>
                      <div className="scan-item-left">
                        <div className="scan-domain">
                          <Globe size={12} />
                          <span className="scan-domain-name">{scan.domain}</span>
                        </div>
                        <div className="scan-item-tags">
                          <span className={`scan-badge ${riskClass(derivedLevel)}`}>{derivedLevel}</span>
                          <span className={`scan-ssl-tag ${scan.sslStatus === true ? "ssl-active" : "ssl-inactive"}`}>
                            <Lock size={9} />
                            {scan.sslStatus === true ? "SSL" : "NO SSL"}
                          </span>
                        </div>
                      </div>
                      <div className="scan-meta">
                        <span className="scan-score" style={{ color: riskScoreColor(scan.riskScore) }}>{scan.riskScore}</span>
                        <span className="scan-date">{formatRelative(scan.lastScanDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="archive-card">
            <div className="card-header">
              <Clock size={15} />
              <h3>REPOSITORY_ACTIVITY</h3>
            </div>
            {activityTimeline.length === 0 ? (
              <EmptyState icon={<Clock size={30} />} title="NO ACTIVITY RECORDED" description="Activity will appear after your first scan." compact />
            ) : (
              <div className="timeline-list">
                {activityTimeline.map((event) => (
                  <div key={event.id} className="timeline-item">
                    <div className="tl-dot-wrap">
                      <div className={`tl-dot tl-${event.risk.toLowerCase()}`} />
                      <div className="tl-line" />
                    </div>
                    <div className="tl-content">
                      <span className="tl-type">{event.type}</span>
                      <span className="tl-domain">{event.domain}</span>
                      <span className="tl-date">{formatRelative(event.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        {/* ── END SIDEBAR ────────────────────────────────────── */}

      </div>
      {/* ═══ END MAIN GRID ══════════════════════════════════════ */}

      {/* ═══ REPORT PREVIEW DRAWER ══════════════════════════════ */}
      {previewReport && (
        <>
          <div className="drawer-overlay" onClick={() => setPreviewReport(null)} />
          <div className="drawer-panel" ref={drawerRef}>
            <div className="drawer-header">
              <h3 className="drawer-title">REPORT PREVIEW</h3>
              <button className="drawer-close" onClick={() => setPreviewReport(null)} title="Close preview">
                <X size={16} />
              </button>
            </div>
            <div className="drawer-body">
              <div className="drawer-field">
                <span className="df-label">DOMAIN</span>
                <span className="df-value df-cyan">{previewReport.domain}</span>
              </div>
              <div className="drawer-field">
                <span className="df-label">RISK SCORE</span>
                <span className="df-value" style={{ color: riskScoreColor(previewReport.riskScore) }}>{previewReport.riskScore}</span>
              </div>
              <div className="drawer-field">
                <span className="df-label">RISK LEVEL</span>
                <span className={`risk-badge ${riskClass(getRiskLevel(previewReport.riskScore))}`}>{getRiskLevel(previewReport.riskScore)}</span>
              </div>
              <div className="drawer-field">
                <span className="df-label">SSL STATUS</span>
                <span className={`df-value ${previewReport.sslStatus === true ? "df-green" : "df-red"}`}>
                  {previewReport.sslStatus === true ? "Valid" : "Not Available"}
                </span>
              </div>
              <div className="drawer-field">
                <span className="df-label">OPEN PORTS</span>
                <div className="ports-cell">
                  {previewReport.openPorts.length === 0 ? (
                    <span className="no-ports">None detected</span>
                  ) : (
                    previewReport.openPorts.map((p) => <span key={p} className="port-tag">{p}</span>)
                  )}
                </div>
              </div>
              <div className="drawer-field">
                <span className="df-label">SCAN DATE</span>
                <span className="df-value">{formatDate(previewReport.scanDate)}</span>
              </div>
              <div className="drawer-field">
                <span className="df-label">SECURITY HEADERS</span>
                <div className="drawer-headers">
                  <span className={previewReport.missingCSP ? "dh-bad" : "dh-good"}>{previewReport.missingCSP ? "✗" : "✓"} CSP</span>
                  <span className={previewReport.missingHSTS ? "dh-bad" : "dh-good"}>{previewReport.missingHSTS ? "✗" : "✓"} HSTS</span>
                  <span className={previewReport.missingXFrameOptions ? "dh-bad" : "dh-good"}>{previewReport.missingXFrameOptions ? "✗" : "✓"} X-Frame</span>
                  <span className={previewReport.missingXContentTypeOptions ? "dh-bad" : "dh-good"}>{previewReport.missingXContentTypeOptions ? "✗" : "✓"} X-Content-Type</span>
                </div>
              </div>
            </div>
            <div className="drawer-actions">
              <button className="da-btn da-primary" onClick={() => navigateToReport(previewReport.scanId)}>
                <ExternalLink size={13} /> Open Full Report
              </button>
              <button className="da-btn da-secondary" onClick={(e) => handleExport(previewReport.id, e)}>
                <Download size={13} /> Download PDF
              </button>
              <button
                className={`da-btn da-secondary${bookmarks.has(previewReport.id) ? " da-bookmarked" : ""}`}
                onClick={(e) => toggleBookmark(previewReport.id, e)}
              >
                {bookmarks.has(previewReport.id) ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                {bookmarks.has(previewReport.id) ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════════════ */

interface HeroCardProps {
  icon: React.ReactNode; label: string; value: number;
  accent: "cyan" | "purple" | "red" | "green" | "amber"; suffix?: string;
}
function HeroCard({ icon, label, value, accent, suffix }: HeroCardProps) {
  return (
    <div className={`hero-card hero-${accent}`}>
      <div className="hero-icon">{icon}</div>
      <div className="hero-body">
        <p className="hero-label">{label}</p>
        <h2 className="hero-value">
          {typeof value === "number" && !isNaN(value)
            ? value % 1 === 0 ? value.toLocaleString() : value.toFixed(1)
            : "0"}
          {suffix && <span className="hero-suffix">{suffix}</span>}
        </h2>
      </div>
    </div>
  );
}

interface StatItemProps { label: string; value: string | number; accent?: "cyan" | "warning" | "danger" | "green"; }
function StatItem({ label, value, accent }: StatItemProps) {
  return (
    <div className="stat-item">
      <span className="stat-item-label">{label}</span>
      <span className={`stat-item-value${accent ? ` si-${accent}` : ""}`}>{value}</span>
    </div>
  );
}

interface RiskBarProps { label: string; count: number; total: number; color: string; }
function RiskBar({ label, count, total, color }: RiskBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="risk-bar-row">
      <div className="risk-bar-meta">
        <span className="risk-bar-lbl" style={{ color }}>{label}</span>
        <span className="risk-bar-cnt">{count}</span>
      </div>
      <div className="risk-bar-track">
        <div className="risk-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

interface InsightItemProps { icon: React.ReactNode; label: string; value: string; sub?: string; accent: "cyan" | "red" | "green" | "amber"; }
function InsightItem({ icon, label, value, sub, accent }: InsightItemProps) {
  return (
    <div className="insight-item">
      <div className={`insight-icon ii-${accent}`}>{icon}</div>
      <div className="insight-text">
        <span className="insight-label">{label}</span>
        <span className={`insight-value iv-${accent}`}>{value}</span>
        {sub && <span className="insight-sub">{sub}</span>}
      </div>
    </div>
  );
}

interface FindingBarProps { label: string; count: number; total: number; color: string; }
function FindingBar({ label, count, total, color }: FindingBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="finding-row">
      <div className="finding-meta">
        <span className="finding-label">{label}</span>
        <span className="finding-count">{count}<span className="finding-slash"> / {total}</span></span>
      </div>
      <div className="finding-track">
        <div className="finding-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="finding-pct" style={{ color }}>{pct}%</span>
    </div>
  );
}

interface DQBarProps { label: string; value: number; color: string; }
function DQBar({ label, value, color }: DQBarProps) {
  return (
    <div className="dq-row">
      <div className="dq-meta">
        <span className="dq-label">{label}</span>
        <span className="dq-value" style={{ color }}>{value}%</span>
      </div>
      <div className="dq-track">
        <div className="dq-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

interface EmptyStateProps { icon: React.ReactNode; title: string; description: string; compact?: boolean; }
function EmptyState({ icon, title, description, compact }: EmptyStateProps) {
  return (
    <div className={`empty-state${compact ? " es-compact" : ""}`}>
      <div className="empty-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}