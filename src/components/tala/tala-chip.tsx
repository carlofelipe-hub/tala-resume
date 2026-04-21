import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ChipVariant = "default" | "filled" | "accent" | "ghost";

interface TalaChipProps {
  variant?: ChipVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<ChipVariant, string> = {
  default: "bg-tala-rule/50 text-tala-ink",
  filled: "bg-tala-ink text-tala-bg",
  accent: "bg-tala-accent-wash text-tala-accent-ink",
  ghost: "bg-transparent border border-tala-rule text-tala-muted",
};

export function TalaChip({
  variant = "default",
  children,
  className,
}: TalaChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
