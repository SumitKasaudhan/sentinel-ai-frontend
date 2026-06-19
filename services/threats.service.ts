import { api } from "@/lib/api";

export const getThreats = async (token: string) => {
  const response = await api.get("/threats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getThreatById = async (id: string, token: string) => {
  const response = await api.get(`/threats/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteThreat = async (id: string, token: string) => {
  const response = await api.delete(`/threats/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ── NEW ──────────────────────────────────────────────────────────────────

export const updateThreatStatus = async (
  id: string,
  status: string,
  token: string
) => {
  const response = await api.patch(
    `/threats/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const analyzeThreat = async (id: string, token: string) => {
  const response = await api.post(
    `/threats/${id}/analyze`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};