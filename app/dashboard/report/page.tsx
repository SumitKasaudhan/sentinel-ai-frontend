'use client';

import React, {
  useState,
  memo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import {
  Download, Share2, FileText, AlertTriangle, Shield, Activity,
  TrendingUp, ChevronRight, ClipboardList, RefreshCw,
  CalendarClock, History, Clock, Database, Archive,
  X, Check, Copy, ExternalLink, Tag, Calendar, HardDrive, Trash2,
} from 'lucide-react';
import type { Variants } from "framer-motion";
import ReportsSkeleton from "@/components/dashboard/skeletons/ReportsSkeleton";
import '@/styles/dashboard/reports/report2.css';

// ─── Types ──────────────────────────────────────────────────────────────────────
type FilterTab    = 'All' | 'Weekly' | 'Audit' | 'Incident' | 'Compliance' | 'Forensic';
type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

interface ThreatPoint   { day: string; detected: number; blocked: number; }
interface CategoryPoint { name: string; value: number; color: string; }
interface RiskPoint     { day: string; score: number; }
interface RegionPoint   { region: string; incidents: number; }

interface ReportEntry {
  id: string; title: string; reportId: string; type: string;
  severity: SeverityLevel; generated: string; size: string; fileUrl?: string | null;
}
interface TooltipPayloadItem {
  name: string; value: number; color: string; dataKey: string; payload: Record<string, unknown>;
}
interface ChartTooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string; }
interface KPICardProps {
  label: string; numericTarget: number; isFloat: boolean; change: string;
  icon: React.ReactNode; iconClass: string; index: number;
}
interface HeroStat { label: string; value: string; icon: React.ReactNode; iconClass: string; }
interface OverviewData {
  heroStats: { activeSchedules: string; lastGenerated: string; nextReport: string; storageUsed: string; retentionPolicy: string; };
  kpis: { reportsGenerated: { value: number; change: string }; criticalFindings: { value: number; change: string }; threatsMitigated: { value: number; change: string }; avgResponseTime: { value: number; change: string }; };
  meta: { activeScheduleCount: number; hasFailedJobs: boolean; nextRunIso: string | null; lastGenIso: string | null; };
}
interface ChartsData {
  weeklyActivity: ThreatPoint[]; threatCategories: CategoryPoint[];
  riskTrend: RiskPoint[]; riskMeta: { latestScore: number; delta: string }; regionIncidents: RegionPoint[];
}
interface ListData { reports: ReportEntry[]; pagination: { total: number; page: number; limit: number; pages: number }; }
interface ToastState { message: string; type: 'success' | 'error' | 'info'; visible: boolean; }

const FILTER_TABS: FilterTab[] = ['All', 'Weekly', 'Audit', 'Incident', 'Compliance', 'Forensic'];

// ─── Hooks ───────────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600, active = true): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTs = 0; let raf: number;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setCount(Math.round((1 - (1 - p) ** 3) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return count;
}
function useInViewOnce(ref: React.RefObject<HTMLDivElement | null>): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [ref]);
  return inView;
}

// ─── Toast ───────────────────────────────────────────────────────────────────────
const Toast = memo(({ toast }: { toast: ToastState }) => (
  <AnimatePresence>
    {toast.visible && (
      <motion.div
        className={`rp-toast rp-toast--${toast.type}`}
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        {toast.type === 'success' && <Check size={14} />}
        {toast.type === 'error'   && <X size={14} />}
        {toast.type === 'info'    && <Copy size={14} />}
        <span>{toast.message}</span>
      </motion.div>
    )}
  </AnimatePresence>
));
Toast.displayName = 'Toast';

// ─── Report Detail Modal ─────────────────────────────────────────────────────────
const ReportDetailModal = memo(({
  report, onClose, onDownload, onShare,
}: {
  report: ReportEntry; onClose: () => void;
  onDownload: (r: ReportEntry) => void; onShare: (r: ReportEntry) => void;
}) => {
  const severityColor: Record<SeverityLevel, string> = {
    Critical: '#EF4444', High: '#F97316', Medium: '#22D3EE', Low: '#34D399',
  };
  return (
    <AnimatePresence>
      <motion.div
        className="rp-modal-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="rp-modal"
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="rp-modal__header">
            <div className="rp-modal__icon"><FileText size={18} /></div>
            <div className="rp-modal__heading">
              <p className="rp-modal__eyebrow">REPORT DETAILS</p>
              <h2 className="rp-modal__title">{report.title}</h2>
            </div>
            <button className="rp-modal__close" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="rp-modal__divider" />

          {/* Meta grid */}
          <div className="rp-modal__meta">
            <div className="rp-modal__meta-row">
              <Tag size={13} className="rp-modal__meta-icon" />
              <span className="rp-modal__meta-label">Report ID</span>
              <span className="rp-modal__meta-value rp-modal__meta-value--mono">{report.reportId}</span>
            </div>
            <div className="rp-modal__meta-row">
              <FileText size={13} className="rp-modal__meta-icon" />
              <span className="rp-modal__meta-label">Type</span>
              <span className="rp-modal__meta-value">{report.type}</span>
            </div>
            <div className="rp-modal__meta-row">
              <AlertTriangle size={13} className="rp-modal__meta-icon" />
              <span className="rp-modal__meta-label">Severity</span>
              <span
                className="rp-modal__meta-value"
                style={{ color: severityColor[report.severity] ?? '#fff' }}
              >
                ● {report.severity}
              </span>
            </div>
            <div className="rp-modal__meta-row">
              <Calendar size={13} className="rp-modal__meta-icon" />
              <span className="rp-modal__meta-label">Generated</span>
              <span className="rp-modal__meta-value">{report.generated}</span>
            </div>
            <div className="rp-modal__meta-row">
              <HardDrive size={13} className="rp-modal__meta-icon" />
              <span className="rp-modal__meta-label">File Size</span>
              <span className="rp-modal__meta-value">{report.size}</span>
            </div>
          </div>

          <div className="rp-modal__divider" />

          {/* Preview placeholder */}
          <div className="rp-modal__preview">
            <div className="rp-modal__preview-icon"><FileText size={28} /></div>
            <p className="rp-modal__preview-label">{report.title}</p>
            <p className="rp-modal__preview-sub">{report.reportId} · {report.type} · {report.size}</p>
          </div>

          {/* Actions */}
          <div className="rp-modal__actions">
            <button
              className="rp-modal__btn rp-modal__btn--primary"
              onClick={() => onDownload(report)}
            >
              <Download size={15} /> Download Report
            </button>
            <button
              className="rp-modal__btn rp-modal__btn--ghost"
              onClick={() => onShare(report)}
            >
              <Share2 size={15} /> Copy Link
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
ReportDetailModal.displayName = 'ReportDetailModal';

// ─── Tooltip Components ───────────────────────────────────────────────────────────
const AreaTooltipContent = memo(({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rp-tooltip">
      <p className="rp-tooltip__label">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="rp-tooltip__row">
          <span className="rp-tooltip__dot" style={{ background: p.color }} />
          <span className="rp-tooltip__name">{p.name}</span>
          <span className="rp-tooltip__val">{p.value}</span>
        </div>
      ))}
    </div>
  );
});
AreaTooltipContent.displayName = 'AreaTooltipContent';

const LineTooltipContent = memo(({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rp-tooltip">
      <p className="rp-tooltip__label">{label}</p>
      <div className="rp-tooltip__row">
        <span className="rp-tooltip__dot" style={{ background: '#A78BFA' }} />
        <span className="rp-tooltip__name">Risk Score</span>
        <span className="rp-tooltip__val">{payload[0].value}</span>
      </div>
    </div>
  );
});
LineTooltipContent.displayName = 'LineTooltipContent';

const BarTooltipContent = memo(({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rp-tooltip">
      <p className="rp-tooltip__label">{label}</p>
      <div className="rp-tooltip__row">
        <span className="rp-tooltip__dot" style={{ background: '#22D3EE' }} />
        <span className="rp-tooltip__name">Incidents</span>
        <span className="rp-tooltip__val">{payload[0].value}</span>
      </div>
    </div>
  );
});
BarTooltipContent.displayName = 'BarTooltipContent';

const PieTooltipContent = memo(({ active, payload }: ChartTooltipProps & { categoryData: CategoryPoint[] }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rp-tooltip">
      <div className="rp-tooltip__row">
        <span className="rp-tooltip__dot" style={{ background: item.color ?? '#fff' }} />
        <span className="rp-tooltip__name">{item.name}</span>
        <span className="rp-tooltip__val">{item.value}%</span>
      </div>
    </div>
  );
});
PieTooltipContent.displayName = 'PieTooltipContent';

// ─── Typed tooltip renderers (fixes recharts ContentType mismatch) ────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RechartsTooltipProps = TooltipProps<ValueType, NameType> & { payload?: any[] };

// Delete this line entirely:
// type RechartsTooltipProps = TooltipProps<ValueType, NameType>;

// And replace all four renderers with these:

const renderAreaTooltipTyped = (props: TooltipProps<ValueType, NameType>) => {
  const p = props as any;
  return <AreaTooltipContent active={p.active} payload={p.payload} label={p.label} />;
};

const renderLineTooltipTyped = (props: TooltipProps<ValueType, NameType>) => {
  const p = props as any;
  return <LineTooltipContent active={p.active} payload={p.payload} label={p.label} />;
};

const renderBarTooltipTyped = (props: TooltipProps<ValueType, NameType>) => {
  const p = props as any;
  return <BarTooltipContent active={p.active} payload={p.payload} label={p.label} />;
};

const makePieTooltipRenderer = (categoryData: CategoryPoint[]) =>
  (props: TooltipProps<ValueType, NameType>) => {
    const p = props as any;
    return <PieTooltipContent active={p.active} payload={p.payload} label={p.label} categoryData={categoryData} />;
  };

// ─── KPI Card ────────────────────────────────────────────────────────────────────
const KPICard = memo(({ label, numericTarget, isFloat, change, icon, iconClass, index }: KPICardProps) => {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref);
  const raw    = useCountUp(numericTarget, 1600, inView);
  const display = isFloat
    ? `${(raw / 10).toFixed(1)}s`
    : numericTarget > 999 ? raw.toLocaleString() : String(raw);
  return (
    <motion.div
      ref={ref} className="rp-kpi"
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.09, duration: 0.55, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="rp-kpi__inner">
        <div className="rp-kpi__top">
          <div className="rp-kpi__meta">
            <span className="rp-kpi__label">{label}</span>
            <span className="rp-kpi__value">{display}</span>
          </div>
          <div className={`rp-kpi__icon-badge ${iconClass}`} aria-hidden="true">{icon}</div>
        </div>
        <div className="rp-kpi__foot">
          <TrendingUp size={14} className="rp-kpi__trend-icon" />
          <span className="rp-kpi__change">{change}</span>
          <span className="rp-kpi__period">vs last week</span>
        </div>
      </div>
    </motion.div>
  );
});
KPICard.displayName = 'KPICard';

const SeverityBadge = memo(({ level }: { level: SeverityLevel }) => (
  <span className={`rp-badge rp-badge--${level.toLowerCase()}`}>{level}</span>
));
SeverityBadge.displayName = 'SeverityBadge';

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [activeTab,      setActiveTab]      = useState<FilterTab>('All');
  const [overview,       setOverview]       = useState<OverviewData | null>(null);
  const [charts,         setCharts]         = useState<ChartsData | null>(null);
  const [listData,       setListData]       = useState<ListData | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [lastUpdated,    setLastUpdated]    = useState<Date | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportEntry | null>(null);
  const [showAll,        setShowAll]        = useState(false);
  const [toast,          setToast]          = useState<ToastState>({ message: '', type: 'success', visible: false });

  // ── Toast helper ─────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  // ── Download ─────────────────────────────────────────────────────────────────
  const handleDownload = useCallback((report: ReportEntry) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank');
      showToast('Download started', 'success');
      return;
    }
    const content = [
      '═══════════════════════════════════════════════════',
      '  SENTINEL AI — SECURITY REPORT',
      '═══════════════════════════════════════════════════',
      '',
      `  Report ID  : ${report.reportId}`,
      `  Title      : ${report.title}`,
      `  Type       : ${report.type}`,
      `  Severity   : ${report.severity}`,
      `  Generated  : ${report.generated}`,
      `  File Size  : ${report.size}`,
      '',
      '═══════════════════════════════════════════════════',
      '  SUMMARY',
      '═══════════════════════════════════════════════════',
      '',
      `  This ${report.type} report was generated by Sentinel AI.`,
      `  Severity level: ${report.severity}.`,
      `  Refer to the dashboard for full analytics.`,
      '',
      '  Generated by Sentinel AI Security Platform',
      `  © ${new Date().getFullYear()} Sentinel AI`,
      '═══════════════════════════════════════════════════',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${report.reportId}-${report.type.toLowerCase()}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${report.reportId}`, 'success');
  }, [showToast]);

  // ── Share ─────────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async (report: ReportEntry) => {
    const shareUrl = `${window.location.origin}/dashboard/report?id=${report.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard', 'info');
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
      showToast('Link copied to clipboard', 'info');
    }
  }, [showToast]);

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (report: ReportEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${report.title}"?\n\nThis cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/reports/list?id=${report.id}`, { method: 'DELETE' });
      if (res.ok) {
        setListData((prev) => prev
          ? { ...prev, reports: prev.reports.filter((r) => r.id !== report.id), pagination: { ...prev.pagination, total: prev.pagination.total - 1 } }
          : prev
        );
        if (selectedReport?.id === report.id) setSelectedReport(null);
        showToast(`${report.reportId} deleted`, 'success');
      } else {
        showToast('Failed to delete report', 'error');
      }
    } catch {
      showToast('Failed to delete report', 'error');
    }
  }, [selectedReport, showToast]);

  // ── Fetch ─────────────────────────────────────────────────────────────────────
const fetchAll = useCallback(async () => {
  const startTime = Date.now();
  try {
    const limit = showAll ? 100 : 20;
    const [ovRes, chRes, lstRes] = await Promise.all([
      fetch('/api/reports/overview'),
      fetch('/api/reports/charts'),
      fetch(`/api/reports/list?limit=${limit}`),
    ]);
    if (ovRes.ok)  setOverview(await ovRes.json());
    if (chRes.ok)  setCharts(await chRes.json());
    if (lstRes.ok) setListData(await lstRes.json());
    setLastUpdated(new Date());
  } catch (err) {
    console.error('[ReportsPage] fetch error:', err);
  } finally {
    const elapsed = Date.now() - startTime;
    if (elapsed < 700) {
      await new Promise((r) => setTimeout(r, 700 - elapsed));
    }
    setLoading(false);
  }
}, [showAll]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const typeParam  = activeTab === 'All' ? '' : `&type=${activeTab}`;
    const limitParam = showAll ? '100' : '20';
    fetch(`/api/reports/list?limit=${limitParam}${typeParam}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setListData(d); });
  }, [activeTab, showAll]);

  // ── Derived ───────────────────────────────────────────────────────────────────
  const heroStats: HeroStat[] = overview
    ? [
        { label: 'ACTIVE SCHEDULES', value: overview.heroStats.activeSchedules, icon: <CalendarClock size={14} />, iconClass: 'cyan'   },
        { label: 'LAST GENERATED',   value: overview.heroStats.lastGenerated,   icon: <History       size={14} />, iconClass: 'purple' },
        { label: 'NEXT REPORT',      value: overview.heroStats.nextReport,      icon: <Clock         size={14} />, iconClass: 'orange' },
        { label: 'STORAGE USED',     value: overview.heroStats.storageUsed,     icon: <Database      size={14} />, iconClass: 'blue'   },
        { label: 'RETENTION POLICY', value: overview.heroStats.retentionPolicy, icon: <Archive       size={14} />, iconClass: 'green'  },
      ]
    : [
        { label: 'ACTIVE SCHEDULES', value: '—',       icon: <CalendarClock size={14} />, iconClass: 'cyan'   },
        { label: 'LAST GENERATED',   value: '—',       icon: <History       size={14} />, iconClass: 'purple' },
        { label: 'NEXT REPORT',      value: '—',       icon: <Clock         size={14} />, iconClass: 'orange' },
        { label: 'STORAGE USED',     value: '—',       icon: <Database      size={14} />, iconClass: 'blue'   },
        { label: 'RETENTION POLICY', value: '90 Days', icon: <Archive       size={14} />, iconClass: 'green'  },
      ];

  const threatData   = charts?.weeklyActivity   ?? [];
  const categoryData = charts?.threatCategories ?? [];
  const riskData     = charts?.riskTrend        ?? [];
  const regionData   = charts?.regionIncidents  ?? [];
  const riskMeta     = charts?.riskMeta         ?? { latestScore: 0, delta: '—' };
  const reports      = listData?.reports        ?? [];
  const totalReports = listData?.pagination.total ?? 0;

  const lastUpdatedLabel = lastUpdated
    ? `Updated ${Math.round((Date.now() - lastUpdated.getTime()) / 60_000)}m ago`
    : 'Updating…';
  const scheduleStatus = overview?.meta.hasFailedJobs ? 'Failed Jobs Detected' : 'All Schedules Active';
  const scheduleDesc   = overview
    ? `Next automated report ${overview.heroStats.nextReport} · ${overview.meta.hasFailedJobs ? 'Check schedules' : 'No failed jobs'}`
    : 'Loading schedule status…';

  // ── Typed tooltip renderers (stable, no useCallback needed) ──────────────────
  const pieTooltipRenderer = makePieTooltipRenderer(categoryData);

  // ── Render ────────────────────────────────────────────────────────────────────
    if (loading) {
    return <ReportsSkeleton />;
  }
  
  return (
    <div className="reports-page">
      {/* Toast */}
      <Toast toast={toast} />

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onDownload={(r) => { handleDownload(r); }}
          onShare={(r) => { handleShare(r); }}
        />
      )}

      <main className="rp-content">

        {/* HERO */}
        <motion.section
          className="rp-hero" aria-label="Reports overview"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="rp-hero__bg" aria-hidden="true">
            <div className="rp-hero__grid" /><div className="rp-hero__scanline" />
          </div>
          <div className="rp-hero__inner">
            <nav className="rp-breadcrumb" aria-label="Breadcrumb" />
            <div className="rp-hero__top">
              <div className="rp-hero__heading">
                <div className="rp-hero__icon" aria-hidden="true"><ClipboardList size={22} /></div>
                <div className="rp-hero__heading-text">
                  <div className="rp-hero__title-row">
                    <h1 className="rp-hero__title">Security Reports</h1>
                    <span className="rp-hero__live-badge">
                      <span className="rp-hero__live-dot" aria-hidden="true" />LIVE
                    </span>
                  </div>
                  <p className="rp-hero__subtitle">Automated security reporting, compliance exports &amp; scheduled deliveries</p>
                </div>
              </div>
              <div className="rp-hero__action">
                <button className="rp-hero__sync-btn" aria-label="Refresh" onClick={fetchAll}>
                  <RefreshCw size={14} aria-hidden="true" />
                </button>
                <span className="rp-hero__updated">{lastUpdatedLabel}</span>
              </div>
            </div>
            <div className="rp-hero__divider" />
            <div className="rp-hero__status">
              <p className="rp-hero__status-label">REPORTING STATUS</p>
              <div className="rp-hero__status-row">
                <span className="rp-hero__status-dot" aria-hidden="true" />
                <h3 className="rp-hero__status-value">{scheduleStatus}</h3>
              </div>
              <p className="rp-hero__status-desc">{scheduleDesc}</p>
            </div>
            <div className="rp-hero__stats">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rp-hero__stat">
                  <div className="rp-hero__stat-top">
                    <span className="rp-hero__stat-label">{stat.label}</span>
                    <div className={`rp-hero__stat-icon rp-hero__stat-icon--${stat.iconClass}`}>{stat.icon}</div>
                  </div>
                  <span className="rp-hero__stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* KPIs */}
        <section className="rp-kpis" aria-label="Key performance indicators">
          <KPICard label="REPORTS GENERATED" numericTarget={overview?.kpis.reportsGenerated.value ?? 0} isFloat={false} change={overview?.kpis.reportsGenerated.change ?? '+0%'} icon={<FileText size={20} />} iconClass="rp-kpi__icon-badge--cyan"   index={0} />
          <KPICard label="CRITICAL FINDINGS" numericTarget={overview?.kpis.criticalFindings.value  ?? 0} isFloat={false} change={overview?.kpis.criticalFindings.change  ?? '+0%'} icon={<AlertTriangle size={20} />} iconClass="rp-kpi__icon-badge--red"    index={1} />
          <KPICard label="THREATS MITIGATED" numericTarget={overview?.kpis.threatsMitigated.value  ?? 0} isFloat={false} change={overview?.kpis.threatsMitigated.change  ?? '+0%'} icon={<Shield size={20} />}        iconClass="rp-kpi__icon-badge--green"  index={2} />
          <KPICard label="AVG. RESPONSE TIME" numericTarget={Math.round((overview?.kpis.avgResponseTime.value ?? 0) * 10)} isFloat={true} change={overview?.kpis.avgResponseTime.change ?? '—'} icon={<Activity size={20} />} iconClass="rp-kpi__icon-badge--orange" index={3} />
        </section>

        {/* Charts */}
        <motion.div className="rp-charts" variants={containerVariants} initial="hidden" animate="show">

          <motion.div className="rp-panel" variants={panelVariants}>
            <div className="rp-panel__inner">
              <div className="rp-panel__header">
                <div><p className="rp-panel__eyebrow">WEEKLY THREAT ACTIVITY</p><h2 className="rp-panel__title">Detection vs Mitigation</h2></div>
                <div className="rp-legend">
                  <div className="rp-legend__item"><span className="rp-legend__dot" style={{ background: '#22D3EE' }} /><span>Detected</span></div>
                  <div className="rp-legend__item"><span className="rp-legend__dot" style={{ background: '#34D399' }} /><span>Blocked</span></div>
                </div>
              </div>
              <div className="rp-chart-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={threatData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="gradDetected" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} /><stop offset="95%" stopColor="#22D3EE" stopOpacity={0} /></linearGradient>
                      <linearGradient id="gradBlocked"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34D399" stopOpacity={0.24} /><stop offset="95%" stopColor="#34D399" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} ticks={[0,15,30,45,60]} domain={[0,60]} />
                    <Tooltip content={renderAreaTooltipTyped} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="detected" name="Detected" stroke="#22D3EE" strokeWidth={2} fill="url(#gradDetected)" dot={false} activeDot={{ r: 5, fill: '#22D3EE', stroke: '#050810', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="blocked"  name="Blocked"  stroke="#34D399" strokeWidth={2} fill="url(#gradBlocked)"  dot={false} activeDot={{ r: 5, fill: '#34D399', stroke: '#050810', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div className="rp-panel" variants={panelVariants}>
            <div className="rp-panel__inner">
              <div className="rp-panel__header">
                <div><p className="rp-panel__eyebrow">THREAT CATEGORIES</p><h2 className="rp-panel__title">Distribution</h2></div>
                <Activity size={16} className="rp-panel__accent-icon" aria-hidden="true" />
              </div>
              <div className="rp-pie-section">
                <div className="rp-pie-wrap">
                  <PieChart width={210} height={210}>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={66} outerRadius={98} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                      {categoryData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip content={pieTooltipRenderer} />
                  </PieChart>
                </div>
                <div className="rp-pie-legend">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="rp-pie-legend__row">
                      <div className="rp-pie-legend__left"><span className="rp-pie-legend__dot" style={{ background: cat.color }} /><span className="rp-pie-legend__name">{cat.name}</span></div>
                      <span className="rp-pie-legend__pct">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="rp-panel" variants={panelVariants}>
            <div className="rp-panel__inner">
              <div className="rp-panel__header rp-panel__header--col">
                <p className="rp-panel__eyebrow">RISK SCORE TREND</p>
                <div className="rp-risk-display">
                  <span className="rp-risk-display__score">{riskMeta.latestScore || '—'}</span>
                  <span className="rp-risk-display__delta">{riskMeta.delta}</span>
                </div>
              </div>
              <div className="rp-chart-wrap rp-chart-wrap--sm">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={riskData} margin={{ top: 10, right: 5, bottom: 0, left: -20 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[55, 85]} />
                    <Tooltip content={renderLineTooltipTyped} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
                    <Line type="monotone" dataKey="score" stroke="#A78BFA" strokeWidth={2.5} dot={{ r: 4, fill: '#A78BFA', stroke: '#050810', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#A78BFA', stroke: '#050810', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div className="rp-panel" variants={panelVariants}>
            <div className="rp-panel__inner">
              <div className="rp-panel__header">
                <div><p className="rp-panel__eyebrow">INCIDENTS BY REGION</p><h2 className="rp-panel__title">Global breakdown</h2></div>
              </div>
              <div className="rp-chart-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={regionData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }} barCategoryGap="42%">
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#2563EB" /></linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="region" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} ticks={[0,40,80,120,160]} domain={[0,160]} />
                    <Tooltip content={renderBarTooltipTyped} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="incidents" fill="url(#barGrad)" radius={[4,4,0,0]} maxBarSize={38} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* REPORTS TABLE */}
        <motion.div
          className="rp-panel rp-panel--table"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
        >
          <div className="rp-panel__inner">
            <div className="rp-panel__header">
              <div>
                <p className="rp-panel__eyebrow">GENERATED REPORTS</p>
                <h2 className="rp-panel__title">
                  Recent activity
                  {totalReports > 0 && (
                    <span className="rp-panel__count"> · {totalReports} total</span>
                  )}
                </h2>
              </div>
              {totalReports > 20 && (
                <button
                  className="rp-link-btn"
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? 'Show less' : `View all ${totalReports}`}
                  <ChevronRight size={14} aria-hidden="true" style={{ transform: showAll ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="rp-filter-tabs" role="tablist" aria-label="Report type filter">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab} role="tab" aria-selected={activeTab === tab}
                  className={`rp-filter-tab${activeTab === tab ? ' rp-filter-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="rp-table-outer">
              <table className="rp-table" aria-label="Generated security reports">
                <thead>
                  <tr>
                    <th className="rp-table__th">REPORT</th>
                    <th className="rp-table__th">TYPE</th>
                    <th className="rp-table__th">SEVERITY</th>
                    <th className="rp-table__th">GENERATED</th>
                    <th className="rp-table__th">SIZE</th>
                    <th className="rp-table__th rp-table__th--right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, i) => (
                    <motion.tr
                      key={report.id}
                      className="rp-table__row rp-table__row--clickable"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 + 0.3, duration: 0.3 }}
                      onClick={() => setSelectedReport(report)}
                      title="Click to view details"
                    >
                      <td className="rp-table__td">
                        <div className="rp-report-cell">
                          <div className="rp-report-cell__icon" aria-hidden="true"><FileText size={16} /></div>
                          <div className="rp-report-cell__info">
                            <span className="rp-report-cell__title">{report.title}</span>
                            <span className="rp-report-cell__id">{report.reportId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="rp-table__td rp-table__td--type">{report.type}</td>
                      <td className="rp-table__td"><SeverityBadge level={report.severity} /></td>
                      <td className="rp-table__td rp-table__td--muted">{report.generated}</td>
                      <td className="rp-table__td rp-table__td--muted">{report.size}</td>
                      <td className="rp-table__td">
                        <div className="rp-table__actions">
                          <button
                            className="rp-action-icon"
                            aria-label={`Download ${report.title}`} title="Download"
                            onClick={(e) => { e.stopPropagation(); handleDownload(report); }}
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="rp-action-icon"
                            aria-label={`Share ${report.title}`} title="Copy link"
                            onClick={(e) => { e.stopPropagation(); handleShare(report); }}
                          >
                            <Share2 size={16} />
                          </button>
                          <button
                            className="rp-action-icon rp-action-icon--danger"
                            aria-label={`Delete ${report.title}`} title="Delete"
                            onClick={(e) => handleDelete(report, e)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {!loading && reports.length === 0 && (
                <div className="rp-empty">
                  <FileText size={32} className="rp-empty__icon" />
                  <p className="rp-empty__text">No reports found for this filter.</p>
                </div>
              )}
              {loading && (
                <div className="rp-empty"><p className="rp-empty__text">Loading reports…</p></div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}