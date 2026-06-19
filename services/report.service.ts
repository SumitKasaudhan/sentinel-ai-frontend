import { api } from "@/lib/api";

export const getReportSummary =
  async (id: string) => {

    const response =
      await api.get(
        `/reports/${id}/summary`
      );

    return response.data;
  };