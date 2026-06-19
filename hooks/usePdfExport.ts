"use client";

import { useState } from "react";

import { downloadPdfReport }
from "@/services/pdf.service";

export function usePdfExport() {

  const [loading, setLoading] =
    useState(false);

  const exportPdf = async (
    reportId: string
  ) => {

    try {

      setLoading(true);

      const blob =
        await downloadPdfReport(
          reportId
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `Sentinel-Report-${reportId}.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

    } finally {

      setLoading(false);

    }
  };

  return {
    exportPdf,
    loading,
  };
}