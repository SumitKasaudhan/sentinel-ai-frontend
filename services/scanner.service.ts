// services/scanner.service.ts
import { api } from "@/lib/api";

export const getScanById = async (id: string, token: string) => {
  const response = await api.get(`/scanner/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getScanHistory = async (token: string) => {
  const response = await api.get("/scanner/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};