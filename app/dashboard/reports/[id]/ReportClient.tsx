"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import ReportRiskGauge from "@/components/dashboard/reports/ReportRiskGauge";
import ReportVirusChart from "@/components/dashboard/reports/ReportVirusChart";
import ReportHeaderMatrix from "@/components/dashboard/reports/ReportHeaderMatrix";
import ReportPortTable from "@/components/dashboard/reports/ReportPortTable";
import ExecutiveSummaryCard from "@/components/dashboard/reports/ExecutiveSummaryCard";
import ScanComparisonCard from "@/components/dashboard/reports/ScanComparisonCard";
import SecurityTrendChart from "@/components/dashboard/reports/SecurityTrendChart";
import ThreatTimelineCard from "@/components/dashboard/reports/ThreatTimelineCard";
import AttackSurfaceCard from "@/components/dashboard/reports/AttackSurfaceCard";
import SecurityScoreBreakdownCard from "@/components/dashboard/reports/SecurityScoreBreakdownCard";
import RiskHeatmapCard from "@/components/dashboard/reports/RiskHeatmapCard";
import RemediationRoadmapCard from "@/components/dashboard/reports/RemediationRoadmapCard";
import PdfExportButton from "@/components/dashboard/reports/PdfExportButton";
import ExecutiveInsightsCard from "@/components/dashboard/reports/ExecutiveInsightsCard";

import {
  getRemediationRoadmap,
}
from "@/services/remediation-roadmap.service";

import {
  getRiskHeatmap,
} from "@/services/risk-heatmap.service";

import {
  getSecurityScore,
} from "@/services/security-score.service";

import {
  getAttackSurface,
} from "@/services/attack-surface.service";

import {
  getTimeline,
} from "@/services/timeline.service";

import { useRouter } from "next/navigation";

import {
  getTrendData,
} from "@/services/trend.service";

import {
  getComparison,
} from "@/services/comparison.service";

import {
  getReportSummary,
} from "@/services/report.service";

import "@/styles/dashboard/reports/report.css";

import {
  getScanById,
} from "@/services/scanner.service";

export default function ReportClient() {
  const params = useParams();

  const router = useRouter();

  // ── ADDED: get session token ──────────────────────────────
  const { getToken, userId } = useAuth();
  // ─────────────────────────────────────────────────────────

  const [report, setReport] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [summary, setSummary] =
  useState<any>(null);

  const [comparison, setComparison] =
  useState<any>(null);

  const [trend, setTrend] =
  useState<any>(null);

  const [timeline, setTimeline] =
  useState<any>(null);

  const [attackSurface, setAttackSurface] =
  useState<any>(null);

  const [
  scoreBreakdown,
  setScoreBreakdown,
] = useState<any>(null);

const [
  riskHeatmap,
  setRiskHeatmap,
] = useState<any>(null);

const [
  roadmap,
  setRoadmap,
] = useState<any>(null);

  useEffect(() => {
  console.log("REPORT", report);
}, [report]);

useEffect(() => {
  console.log("SUMMARY", summary);
}, [summary]);

useEffect(() => {
  console.log("COMPARISON", comparison);
}, [comparison]);

useEffect(() => {
  console.log("TREND", trend);
}, [trend]);

useEffect(() => {
  console.log(
    "TIMELINE",
    timeline
  );
}, [timeline]);

  useEffect(() => {
    const loadReport =
      async () => {
        try {

          // ── ADDED: extract token from session ─────────────
          const token = await getToken() ?? "";
          // ──────────────────────────────────────────────────

const [
  reportData,
  summaryData,
  comparisonData,
  trendData,
  timelineData,
  attackSurfaceData,
  scoreBreakdownData,
  riskHeatmapData,
  roadmapData,
] = await Promise.all([
  getScanById(params.id as string, token),  // ── FIXED: token passed
  getReportSummary(params.id as string),
  getComparison(params.id as string),
  getTrendData(params.id as string),
  getTimeline(params.id as string, token),
  getAttackSurface(params.id as string),
  getSecurityScore(params.id as string),
  getRiskHeatmap(params.id as string),
  getRemediationRoadmap(params.id as string),
]);

setReport(reportData);
setSummary(summaryData);
setComparison(comparisonData);
setTrend(trendData);
setTimeline(timelineData);
setAttackSurface(attackSurfaceData);
setScoreBreakdown(scoreBreakdownData);
setRiskHeatmap(riskHeatmapData);
setRoadmap(roadmapData);

        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    if (params.id) {
      loadReport();
    }
  }, [params.id]); // ── ADDED: session in deps

  if (loading) {
    return (
      <div className="report-page">
        Loading Report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-page">
        Report Not Found
      </div>
    );
  }


  const scan = report.scan;

  return (
    <div className="report-page">

{/* HEADER */}

<div className="report-header">

  <div className="report-header-left">

    <div className="report-back-container">

      <button
        className="report-back-btn"
        onClick={() =>
          router.push(
            "/dashboard/threat-intelligence"
          )
        }
      >
        ← Back to Threat Intelligence
      </button>

    </div>

    <div className="report-title">

      <h1>Security Report</h1>

      <p>{scan.target}</p>

    </div>

  </div>

  <div className="report-header-right">

    <div className="report-risk">

      <div className="risk-score">
        {scan.risk_score}
      </div>

      <div className="security-grade">
        Grade {report.securityGrade}
      </div>

    </div>

    <PdfExportButton
      reportId={params.id as string}
    />

  </div>

</div>

{/* AI EXECUTIVE SUMMARY */}

{summary?.success && (

  <div className="report-section">

    <ExecutiveSummaryCard
      riskLevel={
        summary.riskLevel
      }

      summary={
        summary.summary
      }

      businessImpact={
        summary.businessImpact
      }

      recommendations={
        summary.recommendations
      }
    />

  </div>

)}

<div className="report-section">

  <ExecutiveInsightsCard
    scanId={params.id as string}
  />

</div>

{/* SECURITY IMPROVEMENT */}

{comparison?.success && (

  <div className="report-section">

    <ScanComparisonCard

      currentScore={
        comparison.currentScore
      }

      previousScore={
        comparison.previousScore
      }

      scoreDelta={
        comparison.scoreDelta
      }

      resolvedFindings={
        comparison.resolvedFindings
      }

      newFindings={
        comparison.newFindings
      }

      firstScan={
        comparison.firstScan
      }

    />

  </div>

)}

{trend?.success && (

  <div className="report-section">

    <SecurityTrendChart
      history={trend.history}
    />

  </div>

)}

{timeline?.success && (

  <div className="report-section">

    <ThreatTimelineCard
      timeline={timeline.timeline}
    />

  </div>

)}

{attackSurface?.success && (

  <div className="report-section">

    <AttackSurfaceCard
      data={attackSurface}
    />

  </div>

)}

{scoreBreakdown?.success && (

  <div className="report-section">

    <SecurityScoreBreakdownCard
      data={scoreBreakdown}
    />

  </div>

)}

{riskHeatmap?.success && (

  <div className="report-section">

    <RiskHeatmapCard
      data={riskHeatmap}
    />

  </div>

)}

{roadmap?.success && (

  <div className="report-section">

    <RemediationRoadmapCard
      data={roadmap}
    />

  </div>

)}

{/* TOP METRICS */}

<div className="report-section">

  <div className="dashboard-top-grid">

    <ReportRiskGauge
      score={scan.risk_score}
    />

    <ReportVirusChart
      harmless={scan.virus_total?.harmless || 0}
      malicious={scan.virus_total?.malicious || 0}
      suspicious={scan.virus_total?.suspicious || 0}
      undetected={scan.virus_total?.undetected || 0}
    />

  </div>

</div>
      {/* FINDINGS */}

      <div className="report-section">

        <h2>Findings Summary</h2>

        <div className="summary-grid">

          <div className="summary-card">
            <h3>Critical</h3>
            <p>
              {report.severityCounts?.critical || 0}
            </p>
          </div>

          <div className="summary-card">
            <h3>High</h3>
            <p>
              {report.severityCounts?.high || 0}
            </p>
          </div>

          <div className="summary-card">
            <h3>Medium</h3>
            <p>
              {report.severityCounts?.medium || 0}
            </p>
          </div>

          <div className="summary-card">
            <h3>Low</h3>
            <p>
              {report.severityCounts?.low || 0}
            </p>
          </div>

        </div>
      </div>

      {/* RECOMMENDATIONS */}

      <div className="report-section">

        <h2>Recommendations</h2>

        <div className="recommendations-grid">

          {report.recommendations?.map(
            (
              item: any,
              index: number
            ) => (
              <div
                key={index}
                className="recommendation-card"
              >
                <h4>
                  {item.title}
                </h4>

                <p>
                  {item.remediation}
                </p>
              </div>
            )
          )}

        </div>

      </div>

      {/* TECHNICAL DATA */}

      <div className="report-section">

        <h2>Technical Intelligence</h2>

        <div className="info-grid">

          <div className="info-card">
            <h3>DNS</h3>

            <div className="info-item">
              <div className="info-label">
                IP Address
              </div>

              <div className="info-value">
                {scan.dns?.ip}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">
                Family
              </div>

              <div className="info-value">
                IPv{scan.dns?.family}
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>SSL</h3>

            <div className="badges">

              <div
                className={`security-badge ${
                  scan.ssl?.valid
                    ? "badge-success"
                    : "badge-danger"
                }`}
              >
                {scan.ssl?.valid
                  ? "VALID"
                  : "INVALID"}
              </div>

            </div>

            <br />

            <div className="info-item">
              <div className="info-label">
                Issuer
              </div>

              <div className="info-value">
                {scan.ssl?.issuer}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">
                Expires
              </div>

              <div className="info-value">
                {scan.ssl?.expiresAt}
              </div>
            </div>

          </div>

          <div className="info-card">
            <h3>WHOIS</h3>

            <div className="info-item">
              <div className="info-label">
                Registrar
              </div>

              <div className="info-value">
                {scan.whois?.registrar}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">
                Created
              </div>

              <div className="info-value">
                {scan.whois?.creationDate}
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>Geo Location</h3>

            <div className="info-item">
              <div className="info-label">
                Country
              </div>

              <div className="info-value">
                {scan.geoip?.country}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">
                City
              </div>

              <div className="info-value">
                {scan.geoip?.city}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* SECURITY HEADERS */}

<div className="report-section">
  <ReportHeaderMatrix
    headers={scan.security_headers}
  />
</div>

      {/* PORTS */}

<div className="report-section">
  <ReportPortTable
    ports={
      scan.ports?.openPorts || []
    }
  />
</div>

    </div>
  );
}