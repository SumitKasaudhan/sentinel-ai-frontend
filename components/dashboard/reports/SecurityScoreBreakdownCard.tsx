"use client";

import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";

interface Props {
  data: {
    finalScore: number;
    grade: string;
    breakdown: {
      factor: string;
      impact: number;
      type: string;
    }[];
  };
}

export default function SecurityScoreBreakdownCard({
  data,
}: Props) {

  const negativeImpact =
    data.breakdown
      .filter((item) => item.type === "negative")
      .reduce(
        (sum, item) => sum + item.impact,
        0
      );

  const positiveImpact =
    data.breakdown
      .filter((item) => item.type === "positive")
      .reduce(
        (sum, item) => sum + Math.abs(item.impact),
        0
      );

  const riskLevel =
    data.finalScore >= 80
      ? "LOW"
      : data.finalScore >= 60
      ? "MEDIUM"
      : data.finalScore >= 40
      ? "HIGH"
      : "CRITICAL";

  return (
    <section className="report-card score-breakdown-card">

      <div className="score-header">

        <div className="score-title">
          <ShieldAlert size={22} />
          Security Score Breakdown
        </div>

        <div className={`score-grade grade-${data.grade}`}>
          Grade {data.grade}
        </div>

      </div>

      {/* TOP SUMMARY */}

      <div className="score-summary-grid">

        <div className="score-hero-card">

          <div className="score-hero-label">
            Final Security Score
          </div>

          <div className="score-hero-value">
            {data.finalScore}
          </div>

          <div className={`risk-pill risk-${riskLevel.toLowerCase()}`}>
            {riskLevel} RISK
          </div>

        </div>

        <div className="score-stat-card">

          <TrendingDown size={18} />

          <span>Negative Impact</span>

          <strong>
            {negativeImpact}
          </strong>

        </div>

        <div className="score-stat-card">

          <TrendingUp size={18} />

          <span>Positive Impact</span>

          <strong>
            {positiveImpact}
          </strong>

        </div>

        <div className="score-stat-card">

          <BarChart3 size={18} />

          <span>Factors</span>

          <strong>
            {data.breakdown.length}
          </strong>

        </div>

      </div>

      {/* SCORE BAR */}

      <div className="score-progress-section">

        <div className="progress-top">
          <span>Security Posture</span>
          <span>{data.finalScore}/100</span>
        </div>

        <div className="score-progress">
          <div
            className="score-progress-fill"
            style={{
              width: `${data.finalScore}%`,
            }}
          />
        </div>

      </div>

      {/* BREAKDOWN */}

      <div className="score-breakdown-list">

        {data.breakdown.map((item, index) => {

          const width =
            Math.min(
              (Math.abs(item.impact) / 25) * 100,
              100
            );

          return (
            <div
              key={index}
              className={`score-row ${item.type}`}
            >

              <div className="score-row-left">

                {item.type === "positive" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}

                <span>
                  {item.factor}
                </span>

              </div>

              <div className="score-row-right">

                <div className="impact-bar">

                  <div
                    className={`impact-fill ${item.type}`}
                    style={{
                      width: `${width}%`,
                    }}
                  />

                </div>

                <div
                  className={`impact-badge ${item.type}`}
                >
                  {item.type === "positive"
                    ? `-${item.impact}`
                    : `+${item.impact}`}
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}