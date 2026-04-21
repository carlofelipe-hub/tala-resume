import { cn } from "@/lib/utils";
import { TalaSun } from "./tala-sun";

interface TalaLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { sun: 18, text: "text-lg", gap: "gap-1.5" },
  md: { sun: 24, text: "text-2xl", gap: "gap-2" },
  lg: { sun: 32, text: "text-3xl", gap: "gap-2.5" },
};

export function TalaLogo({ size = "md", className }: TalaLogoProps) {
  const s = sizes[size];
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <TalaSun size={s.sun} className="text-tala-accent" />
      <span
        className={cn(
          s.text,
          "font-display italic tracking-tight leading-none"
        )}
      >
        tala
      </span>
    </span>
  );
}
