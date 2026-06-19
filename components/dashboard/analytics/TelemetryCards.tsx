"use client";

import { useEffect, useState } from "react";
import { Cpu, AlertTriangle, Activity, Bug, Clock, ChevronRight } from "lucide-react";
import { getTelemetry } from "@/services/telemetry.service";

interface Props { token: string | null; }

function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "No data yet";

  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function TelemetryCards({ token }: Props) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    getTelemetry(token).then(setData).catch(console.error);
  }, [token]);

  const items = data
    ? [
        { icon: <Cpu size={16} />,           iconCls: "dv2-tel-icon-box--cyan",   num: data.threatsNeutralized ?? 0,            label: "Threats Neutralized" },
        { icon: <AlertTriangle size={16} />, iconCls: "dv2-tel-icon-box--orange", num: data.criticalAlerts ?? 0,                label: "Critical Alerts" },
        { icon: <Activity size={16} />,      iconCls: "dv2-tel-icon-box--purple", num: `${data.networkLoad ?? 0}%`,             label: "Network Load" },
        { icon: <Bug size={16} />,           iconCls: "dv2-tel-icon-box--red",    num: data.activeDevices ?? 0,                 label: "Active Devices" },
        { icon: <Clock size={16} />,         iconCls: "dv2-tel-icon-box--muted",  num: formatRelativeTime(data.latestThreatAt), label: "Last Threat Detected" },
      ]
    : null;

  return (
    <div className="dv2-telemetry-card">
      <div className="dv2-telemetry-header">
        <span className="dv2-telemetry-header-left">Security Process Overview</span>
        <button className="dv2-telemetry-view-all">
          View all <ChevronRight size={12} />
        </button>
      </div>

      {!items ? (
        <div style={{ color: "#62748E", fontSize: 12 }}>Loading telemetry...</div>
      ) : (
        <div className="dv2-telemetry-items">
          {items.map((item, i) => (
            <div key={i} className="dv2-telemetry-item">
              <div className={`dv2-tel-icon-box ${item.iconCls}`}>{item.icon}</div>
              <div className="dv2-tel-text">
                <span className="dv2-tel-num">{item.num}</span>
                <span className="dv2-tel-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}