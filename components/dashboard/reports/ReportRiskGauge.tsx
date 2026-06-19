"use client";

interface ReportRiskGaugeProps {
  score: number;
}

export default function ReportRiskGauge({
  score,
}: ReportRiskGaugeProps) {
  const getRiskColor = () => {
    if (score <= 40) return "#00ff88";
    if (score <= 70) return "#ffb020";
    return "#ff4d4f";
  };

  const getRiskLabel = () => {
    if (score <= 40) return "LOW";
    if (score <= 70) return "MEDIUM";
    return "HIGH";
  };

  return (
    <div className="risk-gauge-card">
      <h3>Risk Assessment</h3>

      <div
        className="risk-circle"
        style={{
          borderColor: getRiskColor(),
        }}
      >
        <span>{score}</span>
      </div>

      <div
        className="risk-label"
        style={{
          color: getRiskColor(),
        }}
      >
        {getRiskLabel()} RISK
      </div>
    </div>
  );
}