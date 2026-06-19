// services/timeline.service.ts
import { api } from "@/lib/api";

export const getTimeline = async (id: string, token: string) => {
  const response = await api.get(`/scans/${id}/timeline`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};