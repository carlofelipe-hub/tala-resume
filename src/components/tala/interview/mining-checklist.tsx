import { cn } from "@/lib/utils";
import { CheckDot } from "./check-dot";
import type { MiningKey } from "@/types/interview";

const MINING_ITEMS: Array<{
  key: MiningKey;
  label: string;
  prompt: string;
}> = [
  { key: "scope", label: "Team size / accounts", prompt: "How big?" },
  { key: "metric", label: "Hard numbers", prompt: "By how much?" },
  { key: "impact", label: "Who noticed", prompt: "Customers, mgr, NPS?" },
  { key: "names", label: "Named companies/clients", prompt: "Any flagship accounts?" },
  { key: "tools", label: "Tools & stack", prompt: "Zendesk? Salesforce?" },
];

interface MiningChecklistProps {
  mined: Record<MiningKey, boolean>;
  className?: string;
}

export function MiningChecklist({ mined, className }: MiningChecklistProps) {
  return (
    <div
      className={cn(
        "p-3.5 bg-tala-bg rounded-xl border border-tala-rule flex flex-col gap-1.5",
        className
      )}
    >
      {MINING_ITEMS.map(({ key, label, prompt }) => {
        const done = mined[key];
        return (
          <div key={key} className="flex items-center gap-2.5 py-1.5">
            <CheckDot state={done ? "done" : "pending"} />
            <div className="flex-1">
              <div
                className={cn(
                  "text-xs font-medium",
                  done ? "text-tala-ink" : "text-tala-muted"
                )}
              >
                {label}
              </div>
              {!done && (
                <div className="text-[11px] text-tala-muted italic">
                  &ldquo;{prompt}&rdquo;
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
