"use client";

interface Props {
  riskLevel: string;
  summary: string;
  businessImpact: string;
  recommendations: string[];
}

export default function ExecutiveSummaryCard({
  riskLevel,
  summary,
  businessImpact,
  recommendations,
}: Props) {
  return (
    <div className="executive-summary-card">

      <div className="executive-header">
        <h2>AI Security Summary</h2>

        <span
          className={`risk-pill risk-${riskLevel.toLowerCase()}`}
        >
          {riskLevel}
        </span>
      </div>

      <div className="executive-content">

        <p>{summary}</p>

        <div className="impact-section">
          <h4>Business Impact</h4>

          <p>{businessImpact}</p>
        </div>

        <div className="recommendation-section">
          <h4>Priority Actions</h4>

          <ul>
            {recommendations.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

      </div>

    </div>
  );
}