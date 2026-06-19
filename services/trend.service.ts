import { api } from "@/lib/api";

export const getTrendData =
  async (id: string) => {

    const response =
      await api.get(
        `/scans/${id}/trends`
      );

    return response.data;
  };