"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Scan, ShieldCheck } from "lucide-react";

interface Threat {
  id: string;
  threat_type: string;
  severity: string;
  status: string;
  country?: string;
  device?: string;
  created_at?: string;
}

interface AISecurityInsightsProps {
  threats: Threat[];
}

interface Insight {
  level: "critical" | "warning" | "info";
  badge: string;
  text: string;
  icon: React.ReactNode;
}

export default function AISecurityInsights({ threats }: AISecurityInsightsProps) {
  const insights = useMemo<Insight[]>(() => {
    const results: Insight[] = [];

    // Insight 1 — Critical/high vulnerability from the most recent such threat
    const critical = threats.filter(
      (t) => t.severity?.toLowerCase() === "high" || t.severity?.toLowerCase() === "critical"
    );
    const topCritical = critical[0];

    if (topCritical) {
      results.push({
        level: "critical",
        badge: "Immediate",
        icon: <AlertTriangle size={14} />,
        text: `Critical ${topCritical.threat_type} detected on ${topCritical.device ?? "an unidentified host"} — patch immediately`,
      });
    } else {
      results.push({
        level: "info",
        badge: "Status",
        icon: <ShieldCheck size={14} />,
        text: "No critical or high-severity threats detected — systems are secure",
      });
    }

    // Insight 2 — Phishing / social-engineering surge, only if real data exists
    const phishing = threats.filter((t) =>
      t.threat_type?.toLowerCase().includes("phish") ||
      t.threat_type?.toLowerCase().includes("social")
    );
    if (phishing.length > 0) {
      const surgePct = Math.round((phishing.length / Math.max(threats.length, 1)) * 100);
      results.push({
        level: "warning",
        badge: "Warning",
        icon: <TrendingUp size={14} />,
        text: `${phishing.length} phishing/social-engineering threat${phishing.length > 1 ? "s" : ""} detected — ${surgePct}% of total threats`,
      });
    }

    // Insight 3 — Zero-day / exploit pattern, only if real data exists
    const zeroDay = threats.find((t) =>
      t.threat_type?.toLowerCase().includes("zero") ||
      t.threat_type?.toLowerCase().includes("exploit")
    );
    if (zeroDay) {
      results.push({
        level: "info",
        badge: "Info",
        icon: <Scan size={14} />,
        text: `AI model identified a ${zeroDay.threat_type} pattern — signatures updated`,
      });
    }

    // If nothing else qualified, give an honest "all clear" note instead of
    // padding the list with fake/generic content.
    if (results.length === 1 && !topCritical) {
      results.push({
        level: "info",
        badge: "Info",
        icon: <Scan size={14} />,
        text: "No anomalous patterns detected in current threat data",
      });
    }

    return results;
  }, [threats]);

  return (
    <motion.div
      className="dv2-insights-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="dv2-insights-header">
        <div className="dv2-insights-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
          </svg>
        </div>
        <span className="dv2-card-title">AI Security Insights</span>
      </div>

      {/* Insight items */}
      <div className="dv2-insights-list">
        {insights.map((item, i) => (
          <motion.div
            key={i}
            className={`dv2-insight-item dv2-insight-item--${item.level}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
          >
            <div className="dv2-insight-icon-wrap">{item.icon}</div>
            <div className="dv2-insight-body">
              <p className="dv2-insight-text">{item.text}</p>
              <span className={`dv2-insight-badge dv2-insight-badge--${item.level}`}>
                {item.badge}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}