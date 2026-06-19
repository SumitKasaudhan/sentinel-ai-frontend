import { api } from "@/lib/api";

export const getComparison =
  async (id: string) => {

    const response =
      await api.get(
        `/scans/${id}/compare`
      );

    return response.data;
  };