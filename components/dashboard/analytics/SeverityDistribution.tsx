"use client";


import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { getSeverityDistribution } from "@/services/analytics.service";

const SEV_COLORS = ["#EF4444", "#F97316", "#EAB308", "#22D3EE"];
const SEV_LABELS = ["Critical", "High", "Medium", "Low"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0D1A2E",
      border: "0.8px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "8px 12px",
      fontSize: 11,
      color: "#94A3B8",
    }}>
      <strong style={{ color: "#fff" }}>{payload[0].name}</strong>: {payload[0].value}
    </div>
  );
};

export default function SeverityDistribution() {

  const { getToken } = useAuth();

  const [data, setData] = useState<
    { name: string; value: number }[]
  >([]);

useEffect(() => {
  const loadData = async () => {
    try {

      const token = await getToken();

      if (!token) return;

      const result =
        await getSeverityDistribution(token);

      console.log(
        "Severity API:",
        result
      );

      const severity =
        result?.data || {};

      setData([
        {
          name: "Critical",
          value: severity.critical ?? 0,
        },
        {
          name: "High",
          value: severity.high ?? 0,
        },
        {
          name: "Medium",
          value: severity.medium ?? 0,
        },
        {
          name: "Low",
          value: severity.low ?? 0,
        },
      ]);

    } catch (error) {
      console.error(
        "Severity Error:",
        error
      );
    }
  };

  loadData();
}, [getToken]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      className="dv2-severity-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className="dv2-card-header">
        <span className="dv2-card-title">Severity Distribution</span>
        <button style={{
          background: "transparent", border: "none", color: "#62748E",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          width: 22, height: 22, borderRadius: 4,
        }}>
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Donut chart */}
      <div className="dv2-sev-chart-wrap">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={52}
              outerRadius={74}
              paddingAngle={2}
              dataKey="value"
              stroke="#0C1624"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={SEV_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />

            {/* Center text */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-6" fill="#fff" fontSize="20" fontWeight="400">{total}</tspan>
              <tspan x="50%" dy="18" fill="#62748E" fontSize="9">total</tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="dv2-sev-legend">
        {data.map((item, i) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} className="dv2-sev-legend-row">
              <div className="dv2-sev-legend-left">
                <div className="dv2-sev-dot" style={{ background: SEV_COLORS[i] }} />
                <span className="dv2-sev-name">{item.name}</span>
              </div>
              <span className="dv2-sev-val">
                {item.value} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}