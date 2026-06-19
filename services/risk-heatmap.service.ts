import {api} from "@/lib/api";

export async function getRiskHeatmap(
  id: string
) {
  const response =
    await api.get(
      `/scans/${id}/risk-heatmap`
    );

  return response.data;
}