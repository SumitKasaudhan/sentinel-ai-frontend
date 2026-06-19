import {api} from "@/lib/api";

export const downloadPdfReport = async (
  reportId: string
) => {

  const response = await api.get(
    `/reports/${reportId}/export-pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};