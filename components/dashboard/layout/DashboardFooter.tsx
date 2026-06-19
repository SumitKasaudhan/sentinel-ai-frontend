"use client";

import {
  ShieldCheck,
  Activity,
} from "lucide-react";

import "@/styles/dashboard/layout/dashboard-footer.css";

export default function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer__left">
        <ShieldCheck size={14} />

        <span>
          © 2026 Sentinel AI
        </span>
      </div>

      <div className="dashboard-footer__center">
        <span className="footer-status-dot" />

        <span>
          AI Security Matrix Active
        </span>
      </div>

      <div className="dashboard-footer__right">
        <Activity size={14} />

        <span>Latency: 12ms</span>
      </div>
    </footer>
  );
}