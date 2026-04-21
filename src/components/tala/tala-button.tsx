import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface TalaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-tala-ink text-tala-bg hover:opacity-90",
  accent:
    "bg-tala-accent text-tala-accent-ink hover:opacity-90",
  secondary:
    "bg-transparent border border-tala-rule text-tala-ink hover:bg-tala-rule/40",
  ghost:
    "bg-transparent text-tala-ink hover:bg-tala-rule/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-4 text-sm gap-1.5",
  md: "h-10 px-6 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2.5",
};

export const TalaButton = forwardRef<HTMLButtonElement, TalaButtonProps>(
  (
    { variant = "primary", size = "md", icon, iconRight, className, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tala-accent",
          "active:scale-[0.97]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

TalaButton.displayName = "TalaButton";
