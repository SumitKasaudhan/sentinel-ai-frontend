"use client";

import {
  ShieldCheck,
  Activity,
  ServerCrash,
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalThreats: number;
    blockedThreats: number;
    criticalThreats: number;
    riskScore: number;
    networkHealth: string;
  } | null;
}

export default function StatsCards({
  stats,
}: StatsCardsProps) {
  if (!stats) {
    return null;
  }

  return (
    <section className="stats-grid">
      <div className="dashboard-card">
        <div className="card-top">
          <div className="card-title">
            Global Risk Score
          </div>

          <ShieldCheck size={20} />
        </div>

        <div className="risk-circle">
          <div className="risk-inner">
            <h2>{stats.riskScore}</h2>
            <span>/100</span>
          </div>
        </div>

        <div className="card-bottom">
          <span>Threat level monitored</span>

<strong
  className={
    stats.riskScore <= 40
      ? "success"
      : stats.riskScore <= 70
      ? "warning"
      : "danger"
  }
>
  {stats.networkHealth?.toUpperCase()}
</strong>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-top">
          <div className="card-title">
            Real-time Scans
          </div>

          <Activity size={20} />
        </div>

        <h1 className="scan-number">
          {stats.totalThreats}
        </h1>

        <p className="muted-text">
          Total threats detected
        </p>

<div className="scan-engine-status">
  <span className="scan-dot"></span>
  SCAN ENGINE ACTIVE
</div>

<div className="scan-bars">
  {[...Array(8)].map((_, i) => (
    <span
      key={i}
      className={
        i <
        Math.min(
          Math.ceil(
            stats.totalThreats / 10
          ),
          8
        )
          ? "active"
          : ""
      }
    />
  ))}
</div>

<p className="scan-time">
  Last Scan: Just Now
</p>

      </div>
      

      <div className="dashboard-card">
        <div className="card-top">
          <div className="card-title">
            System Nodes
          </div>

          <ServerCrash size={20} />
        </div>

        <div className="nodes-list">
          <div>
            <span>Blocked Threats</span>
            <strong>
              {stats.blockedThreats}
            </strong>
          </div>

          <div>
            <span>Total Threats</span>
            <strong>
              {stats.totalThreats}
            </strong>
          </div>

          <div>
            <span>Critical Threats</span>

            <strong
              className={
                stats.criticalThreats > 5
                  ? "danger"
                  : "success"
              }
            >
              {stats.criticalThreats}
            </strong>
          </div>
          <div className="system-status">
  ✓ All Systems Operational
</div>
        </div>
      </div>
    </section>
  );
}