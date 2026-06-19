"use client";

import { useState } from "react";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";
import {
  Scan, ShieldAlert, Monitor, Shield,
  Play, Ban, Download, ScrollText, Flame, BellPlus,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DailyTrends {
  threatsPerDay: number[];
  criticalPerDay: number[];
  securityScorePerDay: number[];
  devicesPerDay: number[];
}

interface StatsData {
  totalThreats:    number;
  blockedThreats:  number;
  criticalThreats: number;
  activeDevices?:  number;
  riskScore:       number;
  securityScore:   number | null;  // null = no scans yet
  weeklyScoreDelta: number;
  networkHealth:   string;
  dailyTrends:     DailyTrends;
}

interface PremiumStatsCardsProps {
  stats: StatsData | null;
  onRefresh: () => Promise<void>;
}

// ── Real day-over-day trend helper ──────────────────────────────────────────

function getDayOverDayTrend(data: number[]): { pct: number; isUp: boolean; hasData: boolean } {
  if (!data || data.length < 2) return { pct: 0, isUp: true, hasData: false };

  const today = data[data.length - 1];
  const yesterday = data[data.length - 2];

  if (yesterday === 0 && today === 0) return { pct: 0, isUp: true, hasData: false };
  if (yesterday === 0) return { pct: 100, isUp: true, hasData: true };

  const pct = Math.round(((today - yesterday) / yesterday) * 100);
  return { pct: Math.abs(pct), isUp: today >= yesterday, hasData: true };
}

// ── Mini sparkline bars — driven entirely by real per-day data ──────────────

function MiniBars({ heights, color }: { heights: number[]; color: string }) {
  const max = Math.max(...heights, 1);
  return (
    <div className="dv2-mini-bars">
      {heights.map((h, i) => (
        <div
          key={i}
          className="dv2-mini-bar"
          style={{ height: `${(h / max) * 100}%`, background: color, opacity: 0.4 }}
        />
      ))}
    </div>
  );
}

// ── Card 1: Security Score ────────────────────────────────────────────────────

function SecurityScoreCard({ stats }: { stats: StatsData }) {
  const hasData    = stats.securityScore !== null && stats.securityScore !== undefined;
  const pct        = hasData ? Math.min(Math.max(stats.securityScore!, 0), 100) : 0;
  const delta      = stats.weeklyScoreDelta ?? 0;
  const isPositive = delta >= 0;
  const trend      = stats.dailyTrends?.securityScorePerDay ?? [];

  return (
    <div className="dv2-stat-card dv2-stat-card--cyan">
      <div className="dv2-stat-header-row">
        <span className="dv2-stat-label">Security Score</span>
        <span className="dv2-stat-icon dv2-stat-icon--cyan"><Scan size={14} /></span>
      </div>
      <div className="dv2-stat-number">
        {hasData ? (
          <>
            <CountUp end={pct} duration={1.4} />
            <span className="dv2-stat-denom">/100</span>
          </>
        ) : (
          <span className="dv2-stat-denom" style={{ fontSize: "2rem" }}>—</span>
        )}
      </div>
      {hasData && (
        <div className="dv2-stat-bar-wrap">
          <div className="dv2-stat-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      )}
      <div className={`dv2-stat-trend ${hasData ? (isPositive ? "dv2-stat-trend--green" : "dv2-stat-trend--red") : "dv2-stat-trend--muted"}`}>
        {hasData ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isPositive ? (
                <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
              ) : (
                <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>
              )}
            </svg>
            {isPositive ? "+" : ""}{delta.toFixed(1)} pts this week
          </>
        ) : "Run a scan to calculate score"}
      </div>
      {trend.length > 0 && <MiniBars heights={trend} color="#00E5FF" />}
    </div>
  );
}

// ── Card 2: Cloud Threats ─────────────────────────────────────────────────────

function CloudThreatsCard({ stats }: { stats: StatsData }) {
  const trend = stats.dailyTrends?.threatsPerDay ?? [];
  const { pct, isUp, hasData } = getDayOverDayTrend(trend);

  return (
    <div className="dv2-stat-card dv2-stat-card--blue">
      <div className="dv2-stat-header-row">
        <span className="dv2-stat-label">Cloud Threats</span>
        <span className="dv2-stat-icon dv2-stat-icon--blue"><Shield size={14} /></span>
      </div>
      <div className="dv2-stat-number">
        <CountUp end={stats.totalThreats} duration={1.4} />
      </div>
      {hasData ? (
        <div className={`dv2-stat-trend ${isUp ? "dv2-stat-trend--red" : "dv2-stat-trend--green"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isUp ? (
              <>
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                <polyline points="17 18 23 18 23 12" />
              </>
            ) : (
              <>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </>
            )}
          </svg>
          {pct}% vs previous period
        </div>
      ) : (
        <div className="dv2-stat-trend dv2-stat-trend--muted">No recent threat activity</div>
      )}
      {trend.length > 0 && <MiniBars heights={trend} color="#2B7FFF" />}
    </div>
  );
}

// ── Card 3: Critical Threats ──────────────────────────────────────────────────

function CriticalThreatsCard({ stats }: { stats: StatsData }) {
  const trend = stats.dailyTrends?.criticalPerDay ?? [];

  return (
    <div className="dv2-stat-card dv2-stat-card--red">
      <div className="dv2-stat-header-row">
        <span className="dv2-stat-label">Critical Threats</span>
        <span className="dv2-stat-icon dv2-stat-icon--red"><ShieldAlert size={14} /></span>
      </div>
      <div className="dv2-stat-number">
        <CountUp end={stats.criticalThreats} duration={1.4} />
      </div>
      <div className="dv2-stat-trend dv2-stat-trend--red">
        <ShieldAlert size={12} />
        {stats.criticalThreats > 0 ? "Immediate attention" : "No critical threats"}
      </div>
      {trend.length > 0 && <MiniBars heights={trend} color="#FB2C36" />}
    </div>
  );
}

// ── Card 4: Assets Monitored ──────────────────────────────────────────────────

function AssetsCard({ stats }: { stats: StatsData }) {
  const devices = stats.activeDevices ?? 0;
  const trend = stats.dailyTrends?.devicesPerDay ?? [];

  return (
    <div className="dv2-stat-card dv2-stat-card--purple">
      <div className="dv2-stat-header-row">
        <span className="dv2-stat-label">Assets Monitored</span>
        <span className="dv2-stat-icon dv2-stat-icon--purple"><Monitor size={14} /></span>
      </div>
      <div className="dv2-stat-number">
        <CountUp end={devices} duration={1.4} separator="," />
      </div>
      <div className="dv2-stat-trend dv2-stat-trend--muted">
        {devices > 0 ? "Devices reporting telemetry" : "No devices reporting yet"}
      </div>
      {trend.length > 0 && <MiniBars heights={trend} color="#AD46FF" />}
    </div>
  );
}

// ── Card 5: Quick Actions ─────────────────────────────────────────────────────

function QuickActionsCard({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const handleRunScan = async () => {
    if (scanning) return;
    setScanning(true);
    setScanDone(false);
    await onRefresh();
    setScanDone(true);
    setScanning(false);
    setTimeout(() => setScanDone(false), 3000);
  };

  const ACTIONS = [
    {
      label: scanning ? "Scanning..." : scanDone ? "Scan Complete ✓" : "Run Full Scan",
      icon: <Play size={14} />,
      cls: "dv2-quick-btn--cyan",
      onClick: handleRunScan,
    },
    {
      label: "Block IP Range",
      icon: <Ban size={14} />,
      cls: "dv2-quick-btn--red",
      onClick: () => router.push("/dashboard/network-shield"),
    },
    {
      label: "Export Report",
      icon: <Download size={14} />,
      cls: "dv2-quick-btn--blue",
      onClick: () => router.push("/dashboard/reports"),
    },
    {
      label: "View Event Logs",
      icon: <ScrollText size={14} />,
      cls: "dv2-quick-btn--purple",
      onClick: () => router.push("/dashboard/threat-intelligence"),
    },
    {
      label: "Firewall Rules",
      icon: <Flame size={14} />,
      cls: "dv2-quick-btn--orange",
      onClick: () => router.push("/dashboard/network-shield"),
    },
    {
      label: "Add Alert Rule",
      icon: <BellPlus size={14} />,
      cls: "dv2-quick-btn--yellow",
      onClick: () => router.push("/dashboard/settings"),
    },
  ];

  return (
    <div className="dv2-quick-card">
      <span className="dv2-quick-label">Quick Actions</span>
      <div className="dv2-quick-grid">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            className={`dv2-quick-btn ${a.cls}`}
            onClick={a.onClick}
            disabled={scanning && a.label !== (scanning ? "Scanning..." : "Run Full Scan")}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function PremiumStatsCards({ stats, onRefresh }: PremiumStatsCardsProps) {
  if (!stats) return null;

  return (
    <div className="dv2-stats-grid">
      <SecurityScoreCard   stats={stats} />
      <CloudThreatsCard    stats={stats} />
      <CriticalThreatsCard stats={stats} />
      <AssetsCard          stats={stats} />
      <QuickActionsCard    onRefresh={onRefresh} />
    </div>
  );
}