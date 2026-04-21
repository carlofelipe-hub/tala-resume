import { cn } from "@/lib/utils";
import { TalaMeta } from "./tala-meta";
import type { ReactNode } from "react";

interface TalaSectionHeadProps {
  kicker?: string;
  title: ReactNode;
  subtitle?: string;
  className?: string;
}

export function TalaSectionHead({
  kicker,
  title,
  subtitle,
  className,
}: TalaSectionHeadProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {kicker && <TalaMeta>{kicker}</TalaMeta>}
      <h2 className="font-display text-[36px] leading-tight tracking-tight text-tala-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-tala-muted max-w-prose">{subtitle}</p>
      )}
    </div>
  );
}
