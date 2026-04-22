import { cn } from "@/lib/utils";

interface CheckDotProps {
  state: "done" | "active" | "pending";
  className?: string;
}

export function CheckDot({ state, className }: CheckDotProps) {
  return (
    <div
      className={cn(
        "w-4 h-4 rounded-full shrink-0 flex items-center justify-center",
        state === "done" && "bg-tala-accent",
        state === "active" && "border-[1.5px] border-tala-accent",
        state === "pending" && "border-[1.5px] border-tala-rule",
        className
      )}
    >
      {state === "done" && (
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          stroke="var(--tala-accent-ink)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M2 5l2 2 4-4" />
        </svg>
      )}
    </div>
  );
}
