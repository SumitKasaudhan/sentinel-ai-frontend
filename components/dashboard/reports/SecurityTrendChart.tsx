"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  history: {
    date: string;
    score: number;
  }[];
}

export default function SecurityTrendChart({
  history,
}: Props) {

  if (!history || history.length < 2) {
    return (
      <div className="trend-card">

        <h2>
          Security Trend Analysis
        </h2>

        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "#9db5d3",
          }}
        >
          At least 2 scans are required
          to generate trend analysis.
        </div>

      </div>
    );
  }

  const latestScore =
    history[history.length - 1]?.score || 0;

  const previousScore =
    history[history.length - 2]?.score || 0;

  const delta =
    previousScore - latestScore;

  const improving =
    delta > 0;

  return (
    <div className="trend-card">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >

        <h2>
          Security Trend Analysis
        </h2>

        <div
          style={{
            color: improving
              ? "#00ff88"
              : "#ff5252",
            fontWeight: 700,
          }}
        >
          {improving
            ? `↓ ${Math.abs(delta)} Risk Improved`
            : `↑ ${Math.abs(delta)} Risk Increased`}
        </div>

      </div>

      <div
        style={{
          width: "100%",
          height: 320,
        }}
      >

        <ResponsiveContainer>

          <LineChart data={history}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(
                  value
                ).toLocaleDateString()
              }
            />

            <YAxis
              domain={[0, 100]}
            />

            <Tooltip
              formatter={(value) => [
                `${value}`,
                "Risk Score",
              ]}
              labelFormatter={(label) =>
                new Date(
                  label
                ).toLocaleDateString()
              }
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#00e5ff"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
              activeDot={{
                r: 8,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}