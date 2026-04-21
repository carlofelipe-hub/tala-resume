import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TalaInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TalaInput = forwardRef<HTMLInputElement, TalaInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-[10px] border border-tala-rule bg-tala-surface px-3 text-sm text-tala-ink",
          "placeholder:text-tala-faint",
          "focus:outline-none focus:ring-2 focus:ring-tala-accent/40 focus:border-tala-accent",
          "transition-colors duration-150",
          className
        )}
        {...props}
      />
    );
  }
);

TalaInput.displayName = "TalaInput";
