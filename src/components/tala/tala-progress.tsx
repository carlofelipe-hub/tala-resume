import { cn } from "@/lib/utils";

interface TalaProgressProps {
  value: number; // 0–100
  className?: string;
}

export function TalaProgress({ value, className }: TalaProgressProps) {
  return (
    <div
      className={cn("h-[3px] w-full rounded-full bg-tala-rule", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-tala-accent transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
