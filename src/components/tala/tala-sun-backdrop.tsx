import { cn } from "@/lib/utils";
import { TalaSun } from "./tala-sun";

interface TalaSunBackdropProps {
  className?: string;
  size?: number;
}

export function TalaSunBackdrop({
  className,
  size = 600,
}: TalaSunBackdropProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute opacity-[0.06] select-none",
        className
      )}
      aria-hidden="true"
    >
      <TalaSun size={size} strokeWidth={0.5} className="text-tala-accent" />
    </div>
  );
}
