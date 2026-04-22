"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface opacity-70">
        Loading PDF...
      </span>
    ),
  }
);

interface DownloadButtonProps {
  data: ResumeData;
  settings: PreviewSettings;
}

export function DownloadButton({ data, settings }: DownloadButtonProps) {
  const [pdfDoc, setPdfDoc] = useState<React.ReactNode>(null);

  const handleClick = async () => {
    if (pdfDoc) return;
    
    const { getPdfTemplate } = await import("@/lib/pdf/pdf-templates");
    const PdfTemplate = getPdfTemplate(settings.template);
    
    setPdfDoc(<PdfTemplate data={data} />);
  };

  const fileName = `${data.name.replace(/\s+/g, "_") || "resume"}_resume.pdf`;

  if (pdfDoc) {
    return (
      <PDFDownloadLink
        document={pdfDoc as any}
        fileName={fileName}
        className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface hover:opacity-90 transition-opacity"
      >
        Download PDF
      </PDFDownloadLink>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface hover:opacity-90 transition-opacity"
    >
      Download PDF
    </button>
  );
}
