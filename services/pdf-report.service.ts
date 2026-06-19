import {api} from "@/lib/api";

export function exportPdf(
  id: string
) {

  window.open(
    `${api.defaults.baseURL}/reports/${id}/export-pdf`,
    "_blank"
  );

}