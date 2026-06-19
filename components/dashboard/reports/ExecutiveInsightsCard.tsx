"use client";


import { useEffect, useState } from "react";
import {
AlertTriangle,
TrendingUp,
DollarSign,
ShieldAlert,
CheckCircle2,
} from "lucide-react";

interface ExecutiveInsights {
grade: string;
businessRisk: string;
financialImpact: string;
securityTrend: string;
executiveSummary: string;
boardRecommendation: string;
criticalActions: string[];
riskScore: number;
totalExposedServices: number;
}

interface Props {
scanId: string;
}

export default function ExecutiveInsightsCard({
scanId,
}: Props) {
const [data, setData] =
useState<Partial<ExecutiveInsights>>({});

const [loading, setLoading] =
useState(true);

useEffect(() => {
const fetchInsights = async () => {
try {
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/reports/${scanId}/executive-insights`
);

    
    const result = await res.json();

    console.log(
      "Executive API Response:",
      result
    );

    setData(result);
  } catch (error) {
    console.error(
      "Executive Insights Error:",
      error
    );
  } finally {
    setLoading(false);
  }
};

fetchInsights();


}, [scanId]);

if (loading) {
return ( <div className="rounded-2xl border border-white/10 bg-white/5 p-6"> <div className="animate-pulse">
Loading Executive Intelligence... </div> </div>
);
}

if (Object.keys(data).length === 0) {
return null;
}


return (
  <div className="report-section executive-container">

    <div className="executive-header">

      <div className="executive-title">
        <h2>Executive Intelligence</h2>

        <p>
          Business Risk Analysis & Strategic Guidance
        </p>
      </div>

      <div className="executive-grade">

        <div className="executive-grade-label">
          Risk Grade
        </div>

        <div className="executive-grade-value">
          {data.grade ?? "-"}
        </div>

      </div>

    </div>

    <div className="executive-grid">

      <div className="executive-card-item">
        <ShieldAlert size={24} />

        <div className="executive-label">
          Business Risk
        </div>

        <div
          className={`executive-value ${
            data.businessRisk === "CRITICAL"
              ? "risk-critical"
              : data.businessRisk === "HIGH"
              ? "risk-high"
              : data.businessRisk === "MEDIUM"
              ? "risk-medium"
              : "risk-low"
          }`}
        >
          {data.businessRisk ?? "-"}
        </div>
      </div>

      <div className="executive-card-item">
        <DollarSign size={24} />

        <div className="executive-label">
          Financial Impact
        </div>

        <div className="executive-value">
          {data.financialImpact ?? "-"}
        </div>
      </div>

      <div className="executive-card-item">
        <TrendingUp size={24} />

        <div className="executive-label">
          Security Trend
        </div>

        <div className="executive-value">
          {data.securityTrend ?? "-"}
        </div>
      </div>

      <div className="executive-card-item">
        <AlertTriangle size={24} />

        <div className="executive-label">
          Exposed Services
        </div>

        <div className="executive-value">
          {data.totalExposedServices ?? 0}
        </div>
      </div>

    </div>

    <div className="executive-block">

      <h3>Executive Summary</h3>

      <p>
        {data.executiveSummary ??
          "No executive summary available."}
      </p>

    </div>

    <div className="executive-block">

      <h3>Critical Actions</h3>

      <div className="executive-actions">

        {Array.isArray(data.criticalActions) &&
          data.criticalActions.map(
            (action, index) => (
              <div
                key={index}
                className="executive-action"
              >
                <CheckCircle2 size={18} />

                <span>{action}</span>
              </div>
            )
          )}

        {!Array.isArray(
          data.criticalActions
        ) && (
          <p>
            No critical actions available.
          </p>
        )}

      </div>

    </div>

    <div className="executive-board">

      <h3>Board Recommendation</h3>

      <p>
        {data.boardRecommendation ??
          "No recommendation available."}
      </p>

    </div>

  </div>
)}