import { EditorialTemplate } from "./editorial";
import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";

export function getTemplate(name: string) {
  switch (name) {
    case "editorial":
      return EditorialTemplate;
    default:
      return EditorialTemplate;
  }
}

export type TemplateComponent = React.FC<{
  data: ResumeData;
  settings: PreviewSettings;
}>;

export { EditorialTemplate };
