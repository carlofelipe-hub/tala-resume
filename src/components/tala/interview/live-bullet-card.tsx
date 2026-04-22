import { cn } from "@/lib/utils";
import { TalaMeta } from "@/components/tala/tala-meta";
import type { ReactNode } from "react";

interface LiveBulletCardProps {
  text: ReactNode;
  elapsed?: string;
  className?: string;
}

export function LiveBulletCard({
  text,
  elapsed = "0:00",
  className,
}: LiveBulletCardProps) {
  return (
    <div
      className={cn(
        "p-[18px] bg-tala-bg rounded-xl border border-tala-accent",
        className
      )}
    >
      <div className="text-[11px] text-tala-muted font-mono mb-2.5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-tala-accent animate-pulse" />
        DRAFTING · {elapsed}
      </div>
      <div className="text-sm leading-relaxed text-tala-ink">
        {text}
        <span className="inline-block w-[2px] h-3.5 bg-tala-ink ml-0.5 align-middle animate-blink" />
      </div>
    </div>
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-tala-accent-wash text-tala-accent-ink px-[3px] rounded-[3px]">
      {children}
    </mark>
  );
}
