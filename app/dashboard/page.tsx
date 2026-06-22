"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useNotify } from "@/components/dashboard/context/NotificationContext";
import DashboardSkeleton from "@/components/dashboard/skeletons/DashboardSkeleton";
import ActivityTable        from "@/components/dashboard/analytics/ActivityTable";
import VulnerabilityTrends  from "@/components/dashboard/analytics/VulnerabilityTrends";
import ExploitFlow          from "@/components/dashboard/analytics/ExploitFlow";
import TelemetryCards       from "@/components/dashboard/analytics/TelemetryCards";
import SeverityDistribution from "@/components/dashboard/analytics/SeverityDistribution";
import CountryAnalytics     from "@/components/dashboard/analytics/CountryAnalytics";
import PremiumStatsCards    from "@/components/dashboard/analytics/PremiumStatsCards";
import AISecurityInsights   from "@/components/dashboard/analytics/AISecurityInsights";

import { getDashboardStats } from "@/services/dashboard.service";
import { getThreats, deleteThreat } from "@/services/threats.service";

import "@/styles/dashboard/layout/dashboard.css";
import "@/styles/dashboard/layout/dashboardv2.css";

// ── IST date string ───────────────────────────────────────────────────────────
function getISTDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { getToken } = useAuth();
  const { user }     = useUser();
  const notify       = useNotify();

  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [refreshKey, setRefreshKey]         = useState(0);           // ← NEW
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [threats, setThreats]               = useState<any[]>([]);
  const [token, setToken]                   = useState<string | null>(null);
  const [lastScanSeconds, setLastScanSeconds] = useState(0);

  // ── Load dashboard data ────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    const startTime = Date.now();
    try {
      const t = await getToken();
      if (!t) { setLoading(false); return; }

      setToken(t);

      const [statsRes, threatsRes] = await Promise.all([
        getDashboardStats(t),
        getThreats(t),
      ]);

      setDashboardStats(statsRes.data);
      setThreats(threatsRes.data ?? []);
      setLastScanSeconds(0);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < 700) {
        await new Promise((r) => setTimeout(r, 700 - elapsed));
      }
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Last scan ticker
  useEffect(() => {
    const t = setInterval(() => setLastScanSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Refresh ────────────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshKey((k) => k + 1);                                     // ← NEW
    setRefreshing(false);
    notify("Dashboard Refreshed", "Latest threat data loaded", "success");
  };

  // ── Delete threat ──────────────────────────────────────────────────────────
  const handleDeleteThreat = useCallback(async (id: string) => {
    if (!token) return;

    let snapshot: any[] = [];

    setThreats((prev) => {
      snapshot = prev;
      return prev.filter((t) => t.id !== id);
    });

    try {
      await deleteThreat(id, token);
      const statsRes = await getDashboardStats(token);
      setDashboardStats(statsRes.data);
      notify("Threat Removed", "Record deleted successfully", "success");
    } catch (err) {
      console.error("Delete threat error:", err);
      setThreats(snapshot);
      notify("Delete Failed", "Could not remove threat record", "error");
    }
  }, [token, notify]);

  // ── Derived display values ─────────────────────────────────────────────────
  const displayName =
    user?.firstName
    || user?.username
    || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]
    || "Admin";

  const isNewUser = user?.createdAt
    ? Date.now() - new Date(user.createdAt).getTime() < 5 * 60 * 1000
    : false;

  const scanLabel = lastScanSeconds < 60
    ? `${lastScanSeconds}s ago`
    : `${Math.floor(lastScanSeconds / 60)}m ago`;

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dv2-page">

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="dv2-topbar">
        <div className="dv2-topbar-left">
          <span className="dv2-greeting">
            {isNewUser ? "Welcome" : "Welcome back"}, {displayName}
          </span>
          <span className="dv2-date">
            {getISTDateString()}
            {dashboardStats?.blockedThreats != null && (
              <> · {Number(dashboardStats.blockedThreats).toLocaleString()} threats blocked today</>
            )}
          </span>
          {isNewUser && (
            <p className="dv2-onboarding-hint">Run your first scan to see your security score.</p>
          )}
        </div>

        <div className="dv2-topbar-right">
          <div className="dv2-badge dv2-badge-green">
            <span className="dv2-pulse" />
            Security Status: Protected
          </div>
          <div className="dv2-badge dv2-badge-muted">
            <Clock size={12} />
            Last scan: {scanLabel}
          </div>
          <button
            className="dv2-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? "dv2-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="dv2-content">

        {/* Row 1 — Stats + Quick Actions */}
        <PremiumStatsCards
          stats={dashboardStats}
          onRefresh={handleRefresh}
        />

        {/* Row 2 — Threat Trend + Countries */}
        <div className="dv2-row dv2-row-2">
          <div className="dv2-col dv2-col-58">
            <VulnerabilityTrends key={refreshKey} />
          </div>
          <div className="dv2-col dv2-col-42">
            <CountryAnalytics key={refreshKey} />
          </div>
        </div>

        {/* Row 3 — AI Insights + Severity + Export Flow */}
        <div className="dv2-row dv2-row-3">
          <div className="dv2-col dv2-col-33">
            <AISecurityInsights threats={threats} />
          </div>
          <div className="dv2-col dv2-col-33">
            <SeverityDistribution key={refreshKey} />
          </div>
          <div className="dv2-col dv2-col-33">
            <ExploitFlow threats={threats} />
          </div>
        </div>

        {/* Row 4 — Security Process Overview */}
        <TelemetryCards token={token} key={refreshKey} />

        {/* Row 5 — Activity Table */}
        <ActivityTable
          threats={threats}
          token={token}
          onDeleteThreat={handleDeleteThreat}
        />

      </div>
    </div>
  );
}