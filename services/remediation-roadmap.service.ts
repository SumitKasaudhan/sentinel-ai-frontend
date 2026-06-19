import {api} from "@/lib/api";

export async function getRemediationRoadmap(
  id: string
) {
  const response =
    await api.get(
      `/scans/${id}/remediation-roadmap`
    );

  return response.data;
}