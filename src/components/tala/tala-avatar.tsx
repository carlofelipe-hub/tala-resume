import { cn } from "@/lib/utils";

interface TalaAvatarProps {
  initials: string;
  accent?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function TalaAvatar({
  initials,
  accent = false,
  size = "md",
  className,
}: TalaAvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium select-none",
        accent
          ? "bg-tala-accent-wash text-tala-accent-ink"
          : "bg-tala-rule text-tala-muted",
        sizeClasses[size],
        className
      )}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
