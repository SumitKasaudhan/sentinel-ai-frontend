"use client";

import "@/styles/dashboard/modal/deploy-patch-modal.css";

import { AlertTriangle, Rocket, X, Terminal, CheckCircle2, Loader2, Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface ModalProps {
  onClose: () => void;
}

interface ThreatGroup {
  threatType: string;
  count: number;
  severityBreakdown: { critical: number; high: number; medium: number; low: number };
  threatIds: string[];
}

interface AIRemediationPlan {
  summary: string;
  actions: { threatType: string; action: string; threatsAffected: number }[];
  riskReduction: number;
  scoreImprovement: number;
}

interface DeployPatchPreview {
  groups: ThreatGroup[];
  totalThreats: number;
  scoreBefore: number;
  scoreAfter: number;
  riskReductionPercent: number;
  aiPlan: AIRemediationPlan;
  threatIds: string[];
}

interface ExecuteResult {
  operationId: string;
  threatsResolved: number;
  scoreBefore: number;
  scoreAfter: number;
  riskReductionPercent: number;
}

type ModalState = "loading" | "error" | "preview" | "deploying" | "completed";

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function DeployPatchModal({ onClose }: ModalProps) {
  const { getToken } = useAuth();

  const [modalState, setModalState] = useState<ModalState>("loading");
  const [preview, setPreview] = useState<DeployPatchPreview | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [safetyCheck, setSafetyCheck] = useState(false);
  const [executeResult, setExecuteResult] = useState<ExecuteResult | null>(null);
  const [logs, setLogs] = useState<string[]>(["[SYS] Initializing patch preview..."]);

  // ── Fetch preview on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const token = await getToken();

        // FIX: GET /preview — not execute
        const res = await fetch(`${BASE}/api/deploy-patch/preview`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        setPreview(json.data);
        setSelectedGroups(new Set(json.data.groups.map((g: ThreatGroup) => g.threatType)));
        setLogs([
          "[SYS] Preview loaded successfully.",
          `[SYS] ${json.data.totalThreats} unresolved threat(s) detected.`,
          `[SYS] Security score: ${json.data.scoreBefore}/100 → projected ${json.data.scoreAfter}/100 post-patch.`,
        ]);
        setModalState("preview");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load patch preview.");
        setModalState("error");
      }
    };

    fetchPreview();
  }, []);

  // ── Escape key ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ── Group selection ─────────────────────────────────────────────────────────
  const toggleGroup = (threatType: string) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      next.has(threatType) ? next.delete(threatType) : next.add(threatType);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!preview) return;
    const allSelected = preview.groups.every((g) => selectedGroups.has(g.threatType));
    setSelectedGroups(allSelected ? new Set() : new Set(preview.groups.map((g) => g.threatType)));
  };

  const selectedThreatIds = preview
    ? preview.groups.filter((g) => selectedGroups.has(g.threatType)).flatMap((g) => g.threatIds)
    : [];

  const canExecute = safetyCheck && selectedThreatIds.length > 0 && modalState === "preview";

  // ── Execute deployment ──────────────────────────────────────────────────────
  const executeDeployment = async () => {
    if (!canExecute || !preview) return;
    setModalState("deploying");

    const stageLogs = [
      "[STG] Compiling micro-patch bundle...",
      "[STG] Building encrypted payload package...",
      "[NET] Establishing secure tunnel...",
      "[EXEC] Streaming patch to threat engine...",
    ];

    stageLogs.forEach((log, i) => {
      setTimeout(() => setLogs((prev) => [...prev, log]), 750 * (i + 1));
    });

    setTimeout(async () => {
      try {
        const token = await getToken();

        // FIX: POST /execute with base URL
        const res = await fetch(`${BASE}/api/deploy-patch/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ threatIds: selectedThreatIds }),
        });

        const json = await res.json();

        if (json.success) {
          setExecuteResult(json.data);
          setLogs((prev) => [
            ...prev,
            "[EXEC] Applying patch sequence...",
            `[DONE] ${json.data.threatsResolved} threat(s) resolved.`,
            `[DONE] Security score: ${json.data.scoreBefore} → ${json.data.scoreAfter} (+${json.data.scoreAfter - json.data.scoreBefore} pts)`,
            `[DONE] Operation ID: ${json.data.operationId}`,
          ]);
          setModalState("completed");
        } else {
          setLogs((prev) => [...prev, `[ERR] ${json.message}`]);
          setModalState("preview");
        }
      } catch {
        setLogs((prev) => [...prev, "[ERR] Network error during execution."]);
        setModalState("preview");
      }
    }, 750 * stageLogs.length + 600);
  };

  const riskBefore = preview ? 100 - preview.scoreBefore : 0;
  const riskAfter  = executeResult
    ? 100 - executeResult.scoreAfter
    : preview
    ? 100 - preview.scoreAfter
    : 0;

  // ── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <div className="deploy-overlay">
      <div className="deploy-modal">

        {/* HEADER */}
        <div className="deploy-header">
          <div className="deploy-title">
            <Rocket size={22} />
            <div>
              <h2>Patch Deployment Console</h2>
              <span>
                {modalState === "completed" && executeResult
                  ? `OP-ID: ${executeResult.operationId}`
                  : "OP-ID: Pending execution"}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        {/* CONTENT */}
        <div className="deploy-content">

          {/* LOADING */}
          {modalState === "loading" && (
            <div className="deploy-full-state">
              <Loader2 size={40} className="spin-icon" />
              <p>Loading patch preview...</p>
            </div>
          )}

          {/* ERROR */}
          {modalState === "error" && (
            <div className="deploy-full-state error">
              <AlertTriangle size={40} />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* MAIN CONTENT */}
          {(modalState === "preview" || modalState === "deploying" || modalState === "completed") && preview && (
            <>
              {/* LEFT */}
              <div className="deploy-left">

                {/* THREAT GROUPS */}
                <div className="deploy-card">
                  <div className="card-header">
                    <h3>Threat Groups</h3>
                    <span>{selectedGroups.size} / {preview.groups.length} Selected</span>
                  </div>

                  {preview.totalThreats === 0 ? (
                    <div className="empty-state">
                      <CheckCircle2 size={28} />
                      <p>No unresolved threats — environment is fully remediated.</p>
                    </div>
                  ) : (
                    <div className="vuln-list">
                      {preview.groups.map((group) => {
                        const isSelected = selectedGroups.has(group.threatType);
                        const topSeverity =
                          group.severityBreakdown.critical > 0 ? "critical"
                          : group.severityBreakdown.high > 0 ? "high"
                          : "medium";

                        return (
                          <div
                            key={group.threatType}
                            className={`vuln-item ${isSelected ? "active" : ""}`}
                            onClick={() => toggleGroup(group.threatType)}
                          >
                            <div style={{ flex: 1 }}>
                              <div className="vuln-top">
                                <h4>{group.threatType}</h4>
                                <span className={topSeverity}>{topSeverity}</span>
                              </div>
                              <div className="severity-pills">
                                {group.severityBreakdown.critical > 0 && (
                                  <span className="sev-pill critical">{group.severityBreakdown.critical} Critical</span>
                                )}
                                {group.severityBreakdown.high > 0 && (
                                  <span className="sev-pill high">{group.severityBreakdown.high} High</span>
                                )}
                                {group.severityBreakdown.medium > 0 && (
                                  <span className="sev-pill medium">{group.severityBreakdown.medium} Medium</span>
                                )}
                                {group.severityBreakdown.low > 0 && (
                                  <span className="sev-pill low">{group.severityBreakdown.low} Low</span>
                                )}
                              </div>
                            </div>
                            <div className="group-count-badge">{group.count}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* AI REMEDIATION PLAN */}
                <div className="deploy-card">
                  <div className="card-header">
                    <h3><Brain size={15} /> AI Remediation Plan</h3>
                    <span className="ai-badge">Gemini AI</span>
                  </div>
                  <div className="ai-plan-body">
                    <p className="ai-summary">{preview.aiPlan.summary}</p>
                    {preview.aiPlan.actions.length > 0 && (
                      <div className="ai-actions-list">
                        {preview.aiPlan.actions.map((action, i) => (
                          <div key={i} className="ai-action-item">
                            <div className="ai-action-header">
                              <span className="ai-action-type">{action.threatType}</span>
                              <span className="ai-action-count">{action.threatsAffected} threats</span>
                            </div>
                            <p className="ai-action-text">{action.action}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="deploy-right">

                {/* SIMULATED IMPACT */}
                <div className="deploy-card">
                  <div className="card-header">
                    <h3>Simulated Impact</h3>
                  </div>
                  <div className="risk-box">
                    <div className="risk-row">
                      <span>Current Risk Score</span>
                      <h2 className="danger-score">{riskBefore.toFixed(1)}</h2>
                    </div>
                    <div className="risk-row">
                      <span>Post-Deployment Score</span>
                      <h2 className="safe-score">{riskAfter.toFixed(1)}</h2>
                    </div>
                    <div className="risk-bar">
                      <div className="risk-fill" style={{ width: `${Math.max(riskAfter, 2)}%` }} />
                    </div>
                    <p className="reduction">
                      {modalState === "completed" && executeResult
                        ? `✓ ${executeResult.riskReductionPercent}% Risk Reduced`
                        : `-${preview.riskReductionPercent}% Projected Reduction`}
                    </p>
                    <div className="impact-stats">
                      <div className="impact-stat">
                        <span>Threats Selected</span>
                        <strong>{selectedThreatIds.length}</strong>
                      </div>
                      <div className="impact-stat">
                        <span>Score Improvement</span>
                        <strong>+{preview.scoreAfter - preview.scoreBefore} pts</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOGS */}
                <div className="deploy-card logs-card">
                  <div className="card-header">
                    <h3><Terminal size={14} /> STAGING LOGS</h3>
                  </div>
                  <div className="logs-window">
                    {logs.map((log, i) => (
                      <p
                        key={i}
                        className={
                          log.startsWith("[DONE]") ? "log-done"
                          : log.startsWith("[ERR]") ? "log-err"
                          : ""
                        }
                      >
                        {log}
                      </p>
                    ))}
                    {modalState === "deploying" && <div className="typing">▋</div>}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="deploy-footer">
          <label className="toggle-wrap">
            <input
              type="checkbox"
              checked={safetyCheck}
              onChange={() => setSafetyCheck(!safetyCheck)}
            />
            <span className="toggle"></span>
            <p>Acknowledge simulation results & bypass safety checks</p>
          </label>

          <div className="footer-actions">
            {preview && preview.groups.length > 0 && modalState === "preview" && (
              <button className="select-all-btn" onClick={toggleSelectAll} type="button">
                {preview.groups.every((g) => selectedGroups.has(g.threatType))
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}
            <button
              className={`execute-btn ${modalState === "completed" ? "completed" : ""} ${
                !canExecute && modalState !== "completed" ? "disabled-btn" : ""
              }`}
              onClick={executeDeployment}
              disabled={modalState === "deploying" || modalState === "completed" || !canExecute}
              title={
                !safetyCheck
                  ? "Enable safety check to proceed"
                  : selectedThreatIds.length === 0
                  ? "Select at least one threat group"
                  : ""
              }
            >
              {modalState === "completed" ? (
                <><CheckCircle2 size={18} /> DEPLOYMENT COMPLETE</>
              ) : modalState === "deploying" ? (
                <><Loader2 size={18} className="spin-icon" /> DEPLOYING...</>
              ) : (
                "EXECUTE DEPLOYMENT"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}