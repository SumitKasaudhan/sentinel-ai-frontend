import {api} from "@/lib/api";

export async function getSecurityScore(
  id: string
) {
  const response = await api.get(
    `/scans/${id}/score-breakdown`
  );

  return response.data;
}