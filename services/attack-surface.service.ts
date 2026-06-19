import {api}from "@/lib/api";

export async function getAttackSurface(
  id: string
) {
  const response = await api.get(
    `/scans/${id}/attack-surface`
  );

  return response.data;
}