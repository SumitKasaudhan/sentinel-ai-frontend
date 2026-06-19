import { api } from "@/lib/api";

export interface AITerminalCommandResponse {
  conversationId: string;
  reply: string;
  intent: string;
}

export const sendAICommand = async (
  message: string,
  token: string,
  conversationId?: string
): Promise<AITerminalCommandResponse> => {
  const res = await api.post(
    "/ai-terminal/command",
    { message, conversationId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data.data;
};

export interface AITerminalMetrics {
  threatsAnalyzed: number;
  activeThreats: number;
  criticalThreats: number;
  detectionCoverage: number;
  scanSuccessRate: number;
  securityScore: number;
}

export const getAIMetrics = async (
  token: string
): Promise<AITerminalMetrics> => {
  const res = await api.get("/ai-terminal/metrics", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data;
};

export interface AIActivityItem {
  id: string;
  action: string;
  description: string;
  type: "safe" | "info" | "danger" | "warning";
  created_at: string;
}

export const getAIActivity = async (
  token: string
): Promise<AIActivityItem[]> => {
  const res = await api.get("/ai-terminal/activity", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data;
};