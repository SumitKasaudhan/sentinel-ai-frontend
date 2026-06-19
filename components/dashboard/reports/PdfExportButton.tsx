"use client";

import {
  Download,
  Loader2,
} from "lucide-react";

import { usePdfExport }
from "@/hooks/usePdfExport";

interface Props {
  reportId: string;
}

export default function PdfExportButton({
  reportId,
}: Props) {

  const {
    exportPdf,
    loading,
  } = usePdfExport();

  return (

    <button
      className="pdf-export-btn"
      disabled={loading}
      onClick={() =>
        exportPdf(reportId)
      }
    >

      {loading ? (
        <>
          <Loader2
            size={18}
            className="spin"
          />
          Generating...
        </>
      ) : (
        <>
          <Download size={18} />
          Export PDF
        </>
      )}

    </button>

  );
}