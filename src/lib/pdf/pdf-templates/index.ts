import { PdfEditorial } from "./pdf-editorial";
import { PdfClassic } from "./pdf-classic";
import { PdfModern } from "./pdf-modern";
import { PdfMinimal } from "./pdf-minimal";

export function getPdfTemplate(name: string) {
  switch (name) {
    case "editorial": return PdfEditorial;
    case "classic": return PdfClassic;
    case "modern": return PdfModern;
    case "minimal": return PdfMinimal;
    default: return PdfEditorial;
  }
}
