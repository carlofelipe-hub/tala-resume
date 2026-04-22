"use client";

import { cn } from "@/lib/utils";

export type MobileTab = "chat" | "jobs" | "bullets";

interface MobileTabBarProps {
  activeTab: MobileTab;
  onChange: (tab: MobileTab) => void;
  className?: string;
}

const TABS: Array<{ id: MobileTab; label: string }> = [
  { id: "chat", label: "Chat" },
  { id: "jobs", label: "Jobs" },
  { id: "bullets", label: "Bullets" },
];

function TabIcon({ tab }: { tab: MobileTab }) {
  if (tab === "chat") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (tab === "jobs") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

export function MobileTabBar({ activeTab, onChange, className }: MobileTabBarProps) {
  return (
    <div
      className={cn(
        "h-12 border-t border-tala-rule bg-tala-surface flex items-center justify-around",
        className
      )}
      role="tablist"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full cursor-pointer bg-transparent border-none",
              isActive ? "text-tala-ink" : "text-tala-muted"
            )}
          >
            <TabIcon tab={tab.id} />
            <span className="text-[10px] font-medium">{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-tala-accent rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
