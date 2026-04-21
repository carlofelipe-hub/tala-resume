import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TalaMetaProps {
  children: ReactNode;
  className?: string;
}

export function TalaMeta({ children, className }: TalaMetaProps) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[11px] uppercase tracking-[1.2px] text-tala-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
