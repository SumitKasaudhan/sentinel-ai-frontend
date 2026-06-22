"use client";

import "@/styles/dashboard/ai-terminal/ai-terminal.css";

import {
  ShieldAlert,
  FileBarChart,
  FileText,
  Cpu,
  Terminal,
  RefreshCcw,
  Send,
  AlertTriangle,
  Trash2,
  BrainCircuit,
  ShieldCheck,
} from "lucide-react";
import AITerminalSkeleton from "@/components/dashboard/skeletons/AITerminalSkeleton";
import { useEffect, useRef, useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { useAuth } from "@clerk/nextjs";

import {
  sendAICommand,
  getAIMetrics,
  getAIActivity,
  AITerminalMetrics,
  AIActivityItem,
} from "@/services/ai-terminal.service";

import { useNotify } from "@/components/dashboard/context/NotificationContext";

interface TerminalLine {
  id: string;
  text: string;
  type?: "success" | "warning" | "danger" | "info";
}

const BOOT_LINES: Omit<TerminalLine, "id">[] = [
  { text: "Sentinel AI Copilot Ready", type: "success" },
  { text: "Connected to:", type: "info" },
  { text: "  ✓ Threat Intelligence", type: "success" },
  { text: "  ✓ Dashboard Analytics", type: "success" },
  { text: "  ✓ Telemetry", type: "success" },
  { text: "  ✓ Reports", type: "success" },
  { text: "  ✓ Gemini AI", type: "success" },
  { text: 'Type "help" to see available commands.', type: "info" },
];

const getBootLines = (): TerminalLine[] =>
  BOOT_LINES.map((l) => ({ ...l, id: nanoid() }));

export default function AITerminalPage() {
  const { getToken } = useAuth();
  const notify = useNotify();

  const [command, setCommand] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(
    getBootLines()
  );

  const [metrics, setMetrics] = useState<AITerminalMetrics | null>(null);
  const [feeds, setFeeds] = useState<AIActivityItem[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const appendLine = (
    text: string,
    type?: "success" | "warning" | "danger" | "info"
  ) => {
    setTerminalLines((prev) => [...prev, { id: nanoid(), text, type }]);
  };

  const appendMultiline = (
    text: string,
    type?: "success" | "warning" | "danger" | "info"
  ) => {
    const lines = text.split("\n").filter((l) => l.length > 0);

    setTerminalLines((prev) => [
      ...prev,
      ...lines.map((line) => ({ id: nanoid(), text: line, type })),
    ]);
  };

  /* DATA FETCHING */

  const loadMetrics = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const data = await getAIMetrics(token);
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load AI terminal metrics:", err);
    } finally {
      setMetricsLoading(false);
    }
  }, [getToken]);

  const loadActivity = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const data = await getAIActivity(token);
      setFeeds(data);
    } catch (err) {
      console.error("Failed to load AI terminal activity:", err);
    }
  }, [getToken]);

  useEffect(() => {
    const startTime = Date.now();

    Promise.all([loadMetrics(), loadActivity()]).finally(async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 700) {
        await new Promise((r) => setTimeout(r, 700 - elapsed));
      }
      setPageLoading(false);
    });

    const interval = setInterval(() => {
      loadActivity();
    }, 15000);

    return () => clearInterval(interval);
  }, [loadMetrics, loadActivity]);

  /* COMMAND EXECUTION */

  const runCommand = async (message: string) => {
    if (!message.trim() || isSending) return;

    appendLine(`> ${message}`, "info");
    setIsSending(true);

    try {
      const token = await getToken();

      if (!token) {
        appendLine("Authentication error. Please refresh and log in again.", "danger");
        notify("Authentication Error", "Please refresh and log in again.", "error");
        return;
      }

      const result = await sendAICommand(message, token, conversationId);

      setConversationId(result.conversationId);
      appendMultiline(result.reply);

      // Trigger notifications based on intent type
      switch (result.intent) {
        case "run_scan": {
          // Try to extract domain + risk score from the reply for a richer toast
          const domainMatch = result.reply.match(/SCAN COMPLETE:\s*(\S+)/);
          const riskMatch = result.reply.match(/Risk Score:\s*(\d+\/100\s*\([^)]+\))/);

          if (domainMatch) {
            notify(
              "Scan Complete",
              riskMatch
                ? `${domainMatch[1]} — Risk Score: ${riskMatch[1]}`
                : `Scan finished for ${domainMatch[1]}`,
              "success"
            );
          } else if (result.reply.toLowerCase().startsWith("scan failed")) {
            notify("Scan Failed", result.reply, "error");
          }

          loadActivity();
          loadMetrics();
          break;
        }

        case "generate_executive_report":
          notify("Executive Report Generated", "Your executive security report is ready.", "success");
          loadActivity();
          loadMetrics();
          break;

        case "generate_soc_report":
          notify("SOC Report Generated", "Your SOC report is ready in the terminal.", "success");
          loadActivity();
          loadMetrics();
          break;

        case "ai_error":
          notify(
            "AI Engine Unavailable",
            "Rate limit or quota reached. Try again shortly.",
            "warning"
          );
          break;

        default:
          break;
      }
    } catch (err: any) {
      console.error("AI terminal command error:", err);

      const message =
        err?.response?.data?.message ||
        "Failed to process command. Please try again.";

      appendLine(message, "danger");
      notify("Command Failed", message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const executeCommand = () => {
    const value = command;
    setCommand("");
    runCommand(value);
  };

  /* QUICK ACTIONS */

  const runScript = (message: string) => {
    runCommand(message);
  };

  const refreshIntelligence = async () => {
    appendLine("Refreshing threat intelligence and metrics...", "info");
    await Promise.all([loadMetrics(), loadActivity()]);
    appendLine("Intelligence refreshed.", "success");
    notify("Intelligence Refreshed", "Metrics and activity feed updated.", "info");
  };

  const clearTerminal = () => {
    setTerminalLines(getBootLines());
    setConversationId(undefined);
    notify("Terminal Cleared", "Started a new conversation.", "info");
  };

  if (pageLoading) {
    return <AITerminalSkeleton />;
  }

  return (
    <div className="terminal-page">
      {/* LEFT PANEL */}

      <div className="models-panel">
        <div className="panel-header">
          <h2>NEURAL_MODELS</h2>
          <div className="live-dot"></div>
        </div>

        {/* MODEL CARD 1 — Oracle_Eye */}

        <div className="model-card">
          <div className="model-top">
            <div className="model-title">
              <div className="model-icon oracle">
                <BrainCircuit size={18} />
              </div>
              <h3>Oracle_Eye</h3>
            </div>

            <span className="status-pill">
              <span className="status-dot"></span>
              ACTIVE
            </span>
          </div>

          <p>Pattern Recognition Engine</p>

          <div className="metric">
            <div className="metric-row">
              <label>Detection Coverage</label>
              <span>
                {metricsLoading ? "—" : `${metrics?.detectionCoverage ?? 0}%`}
              </span>
            </div>

            <div className="bar">
              <div
                className="fill"
                style={{ width: `${metrics?.detectionCoverage ?? 0}%` }}
              ></div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-row">
              <label>Scan Success Rate</label>
              <span>
                {metricsLoading ? "—" : `${metrics?.scanSuccessRate ?? 0}%`}
              </span>
            </div>

            <div className="bar">
              <div
                className="fill secondary"
                style={{ width: `${metrics?.scanSuccessRate ?? 0}%` }}
              ></div>
            </div>
          </div>

          <div className="model-footer">
            <span className="model-footer-label">Threats Analyzed</span>
            <span className="model-footer-value">
              {metricsLoading ? "—" : metrics?.threatsAnalyzed ?? 0}
            </span>
          </div>
        </div>

        {/* MODEL CARD 2 — Sentinel_Guard */}

        <div className="model-card">
          <div className="model-top">
            <div className="model-title">
              <div className="model-icon guard">
                <ShieldCheck size={18} />
              </div>
              <h3>Sentinel_Guard</h3>
            </div>

            <span className="status-pill">
              <span className="status-dot"></span>
              ACTIVE
            </span>
          </div>

          <p>Behavioral Heuristics Engine</p>

          <div className="metric">
            <div className="metric-row">
              <label>Security Score</label>
              <span>
                {metricsLoading ? "—" : `${metrics?.securityScore ?? 0}/100`}
              </span>
            </div>

            <div className="bar">
              <div
                className="fill"
                style={{ width: `${metrics?.securityScore ?? 0}%` }}
              ></div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-row">
              <label>Critical Threat Ratio</label>
              <span>
                {metricsLoading
                  ? "—"
                  : `${metrics?.criticalThreats ?? 0} / ${metrics?.threatsAnalyzed ?? 0}`}
              </span>
            </div>

            <div className="bar">
              <div
                className="fill danger-fill"
                style={{
                  width: `${Math.min(
                    ((metrics?.criticalThreats ?? 0) /
                      Math.max(metrics?.threatsAnalyzed ?? 1, 1)) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="model-footer">
            <span className="model-footer-label">Active Threats</span>
            <span className="model-footer-value">
              {metricsLoading ? "—" : metrics?.activeThreats ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* TERMINAL */}

      <div className="terminal-wrapper">
        <div className="terminal-header">
          <div className="terminal-left">
            <Terminal size={16} />
            <span>root@sentinel-core:~</span>
          </div>

          <button
            className="clear-btn"
            onClick={clearTerminal}
            disabled={isSending}
            title="Clear terminal and start a new conversation"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>

        <div className="terminal-body" ref={terminalRef}>
          {terminalLines.map((line) => (
            <div key={line.id} className={`terminal-line ${line.type || ""}`}>
              {line.text}
            </div>
          ))}

          {isSending && (
            <div className="terminal-line info">Processing...</div>
          )}

          <div className="terminal-cursor">▋</div>
        </div>

        <div className="terminal-input">
          <span>{">"}</span>

          <input
            type="text"
            placeholder="Enter command... (try 'help')"
            value={command}
            disabled={isSending}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && executeCommand()}
          />

          <button onClick={executeCommand} disabled={isSending}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="right-panel">
        {/* SCRIPTS */}

        <div className="script-card">
          <div className="script-header">
            <AlertTriangle size={16} />
            <h2>TACTICAL_SCRIPTS</h2>
          </div>

          <button
            onClick={() => runScript("show critical threats")}
            disabled={isSending}
          >
            ANALYZE CRITICAL THREATS
            <ShieldAlert size={16} />
          </button>

          <button
            onClick={() => runScript("generate soc report")}
            disabled={isSending}
          >
            GENERATE SOC REPORT
            <FileText size={16} />
          </button>

          <button
            onClick={() => runScript("generate executive report")}
            disabled={isSending}
          >
            GENERATE EXECUTIVE REPORT
            <FileBarChart size={16} />
          </button>

          <button onClick={refreshIntelligence} disabled={isSending}>
            REFRESH INTELLIGENCE
            <RefreshCcw size={16} />
          </button>
        </div>

        {/* FEED */}

        <div className="feed-card">
          <div className="feed-header">
            <Cpu size={16} />
            <h2>REMEDIATION_FEED</h2>
          </div>

          <div className="feed-list">
            {feeds.length === 0 ? (
              <div className="feed-empty">No recent activity yet.</div>
            ) : (
              feeds.map((feed) => (
                <div key={feed.id} className={`feed-item ${feed.type}`}>
                  <div className="feed-line"></div>

                  <div>
                    <span>
                      {new Date(feed.created_at).toLocaleTimeString()}
                    </span>
                    <p>{feed.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}