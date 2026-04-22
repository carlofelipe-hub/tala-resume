import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TalaMetaProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TalaMeta({ children, className, style }: TalaMetaProps) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[11px] uppercase tracking-[1.2px] text-tala-muted",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
