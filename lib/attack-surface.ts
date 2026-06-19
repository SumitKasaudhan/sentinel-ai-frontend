import { api } from "@/lib/api";

export const getAttackSurface = async (
  scanId: string,
  token: string
) => {
  const response = await api.get(
    `/api/scans/${scanId}/attack-surface`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};