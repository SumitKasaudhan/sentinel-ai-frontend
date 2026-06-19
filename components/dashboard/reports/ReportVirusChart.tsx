"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
}

export default function ReportVirusChart({
  harmless,
  malicious,
  suspicious,
  undetected,
}: Props) {
  const data = [
    {
      name: "Harmless",
      value: harmless,
    },
    {
      name: "Malicious",
      value: malicious,
    },
    {
      name: "Suspicious",
      value: suspicious,
    },
    {
      name: "Undetected",
      value: undetected,
    },
  ];

  const COLORS = [
    "#00ff88",
    "#ff4d4f",
    "#ffb020",
    "#1d9bf0",
  ];

  return (
    <div className="virus-chart-card">
      <h3>VirusTotal Analysis</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}