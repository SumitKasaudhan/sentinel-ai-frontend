"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import {
  getThreatById,
  getThreats,
  updateThreatStatus,
  analyzeThreat,
} from "@/services/threats.service";

import "@/styles/dashboard/threat-intelligence/threat-details.css";

interface Threat {
  id: string;
  threat_type: string;
  severity: "low" | "medium" | "high" | "critical" | "Low" | "Medium" | "High" | "Critical";
  status: "blocked" | "active" | "resolved" | "investigating";
  country: string;
  ip_address: string | null;
  device: string | null;
  domain: string | null;
  scan_id: string | null;
  created_at: string;
}

interface ThreatAnalysis {
  threatName: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  summary: string;
  attackVector: string;
  indicators: string[];
  immediateActions: string[];
  longTermRemediation: string[];
  affectedSystems: string[];
  confidence: number;
}

const STATUS_OPTIONS = ["active", "investigating", "blocked", "resolved"];

export default function ThreatDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const [threat, setThreat] = useState<Threat | null>(null);
  const [relatedThreats, setRelatedThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);

  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadThreat = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const [threatRes, listRes] = await Promise.all([
          getThreatById(params.id as string, token),
          getThreats(token),
        ]);

        const threatData: Threat = threatRes.data;
        setThreat(threatData);

        const allThreats: Threat[] = listRes.data || [];

        const related = allThreats.filter(
          (t) =>
            t.id !== threatData.id &&
            ((t.ip_address && t.ip_address === threatData.ip_address) ||
              (t.domain && t.domain === threatData.domain))
        );

        setRelatedThreats(related);
      } catch (error) {
        console.error("Threat Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadThreat();
  }, [params.id, getToken]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzeError(null);

    try {
      const token = await getToken();
      if (!token) return;

      const response = await analyzeThreat(params.id as string, token);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Analyze Error:", error);
      setAnalyzeError("AI analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!threat || newStatus === threat.status) return;

    setUpdatingStatus(true);

    try {
      const token = await getToken();
      if (!token) return;

      const response = await updateThreatStatus(params.id as string, newStatus, token);
      setThreat(response.data);
    } catch (error) {
      console.error("Status Update Error:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="threat-loading">Loading Threat Intelligence...</div>;
  }

  if (!threat) {
    return <div className="threat-error">Threat Not Found</div>;
  }

  // Normalize severity to lowercase for CSS class (backend sends Title Case)
  const severityClass = threat.severity?.toLowerCase() ?? "low";

  return (
    <div className="threat-details-page">

      {/* Back */}
      <div className="threat-back-container">
        <button
          className="threat-back-btn"
          onClick={() => router.push("/dashboard/threat-intelligence")}
        >
          ← Back to Threat Intelligence
        </button>
      </div>

      {/* Header */}
      <div className="threat-header">
        <h1>Threat Intelligence</h1>
        <span className={`severity-badge ${severityClass}`}>
          {severityClass.toUpperCase()}
        </span>
      </div>

      {/* Info Grid */}
      <div className="threat-grid">
        <div className="threat-card">
          <h3>Threat Type</h3>
          <p>{threat.threat_type}</p>
        </div>

        <div className="threat-card">
          <h3>Status</h3>
          <p style={{ textTransform: "capitalize" }}>{threat.status}</p>
        </div>

        <div className="threat-card">
          <h3>Country</h3>
          <p>{threat.country}</p>
        </div>

        <div className="threat-card">
          <h3>Device</h3>
          <p>{threat.device || "Not Available"}</p>
        </div>

        <div className="threat-card">
          <h3>IP Address</h3>
          <p>{threat.ip_address || "Not Available"}</p>
        </div>

        <div className="threat-card">
          <h3>Domain</h3>
          <p>{threat.domain || "Not Available"}</p>
        </div>

        <div className="threat-card">
          <h3>Detected</h3>
          <p>{new Date(threat.created_at).toLocaleString()}</p>
        </div>

        {threat.scan_id && (
          <div className="threat-card threat-card-link">
            <h3>Source Scan</h3>
            <button
              className="threat-link-btn"
              onClick={() => router.push(`/dashboard/reports/${threat.scan_id}`)}
            >
              View Full Scan Report →
            </button>
          </div>
        )}
      </div>

      {/* Status Control */}
      <div className="status-control-card">
        <h2>Update Status</h2>
        <div className="status-options">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option}
              disabled={updatingStatus || option === threat.status}
              className={`status-option-btn ${option === threat.status ? "status-option-active" : ""}`}
              onClick={() => handleStatusChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      <div className="ai-analysis-card">
        <div className="ai-analysis-header">
          <h2>AI Threat Assessment</h2>
          {!analysis && (
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
          )}
        </div>

        {analyzeError && <p className="analyze-error">{analyzeError}</p>}

        {analysis && (
          <div className="analysis-result">
            <div className="analysis-top">
              <div>
                <h3>{analysis.threatName}</h3>
                <span className={`risk-badge risk-${analysis.riskLevel.toLowerCase()}`}>
                  {analysis.riskLevel} Risk
                </span>
              </div>
              <div className="confidence-meter">
                Confidence: {analysis.confidence}%
              </div>
            </div>

            <p className="analysis-summary">{analysis.summary}</p>

            <div className="analysis-block">
              <h4>Attack Vector</h4>
              <p style={{ fontSize: 13, color: "#d1d5db" }}>{analysis.attackVector}</p>
            </div>

            <div className="analysis-columns">
              <div className="analysis-block">
                <h4>Indicators of Compromise</h4>
                <ul>{analysis.indicators.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="analysis-block">
                <h4>Immediate Actions</h4>
                <ul>{analysis.immediateActions.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="analysis-block">
                <h4>Long-Term Remediation</h4>
                <ul>{analysis.longTermRemediation.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="analysis-block">
                <h4>Affected Systems</h4>
                <ul>{analysis.affectedSystems.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Threats */}
      {relatedThreats.length > 0 && (
        <div className="related-threats-card">
          <h2>Related Threats</h2>
          <p className="related-threats-subtitle">
            Other threats sharing the same IP or domain
          </p>
          <div className="related-threats-list">
            {relatedThreats.map((rt) => {
              const rtSev = rt.severity?.toLowerCase() ?? "low";
              return (
                <div
                  key={rt.id}
                  className="related-threat-item"
                  onClick={() => router.push(`/dashboard/threat-intelligence/${rt.id}`)}
                >
                  <span className={`severity-badge ${rtSev}`}>
                    {rtSev.toUpperCase()}
                  </span>
                  <span className="related-threat-type">{rt.threat_type}</span>
                  <span className="related-threat-date">
                    {new Date(rt.created_at).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="timeline-card">
        <h2>Threat Timeline</h2>
        <div className="timeline-list">
          <div className="timeline-item">
            <div className="timeline-dot dot-detected">✓</div>
            <div className="timeline-content">
              <span className="timeline-label">Threat Detected</span>
              <span className="timeline-meta">{new Date(threat.created_at).toLocaleString()}</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot dot-status">◉</div>
            <div className="timeline-content">
              <span className="timeline-label" style={{ textTransform: "capitalize" }}>
                Current Status: {threat.status}
              </span>
              <span className="timeline-meta">Last updated</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}