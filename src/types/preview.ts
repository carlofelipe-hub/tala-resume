import type { TypographyName, DensityName, PaletteName } from "@/lib/tokens";

export type TemplateName = "editorial" | "classic" | "modern" | "minimal";
export type PaperName = "letter" | "a4";
export type LanguageName = "english" | "filipino" | "bilingual";

export interface ResumeExperienceEntry {
  role: string;
  company: string;
  location?: string;
  dates: string;
  bullets: string[];
}

export interface ResumeEducationEntry {
  school: string;
  degree: string;
  dates: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  summary: string;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  skills: string[];
}

export interface PreviewSettings {
  template: TemplateName;
  typography: TypographyName;
  density: DensityName;
  accent: PaletteName;
  paper: PaperName;
  language: LanguageName;
}

export const defaultPreviewSettings: PreviewSettings = {
  template: "editorial",
  typography: "editorial",
  density: "regular",
  accent: "sun-gold",
  paper: "letter",
  language: "english",
};
