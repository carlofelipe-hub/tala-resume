import { EditorialTemplate } from "./editorial";
import { ClassicTemplate } from "./classic";
import { ModernTemplate } from "./modern";
import { MinimalTemplate } from "./minimal";
import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";

export function getTemplate(name: string) {
  switch (name) {
    case "editorial":
      return EditorialTemplate;
    case "classic":
      return ClassicTemplate;
    case "modern":
      return ModernTemplate;
    case "minimal":
      return MinimalTemplate;
    default:
      return EditorialTemplate;
  }
}

export type TemplateComponent = React.FC<{
  data: ResumeData;
  settings: PreviewSettings;
}>;

export { EditorialTemplate, ClassicTemplate, ModernTemplate, MinimalTemplate };
