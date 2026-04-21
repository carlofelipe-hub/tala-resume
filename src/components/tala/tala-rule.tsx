import { cn } from "@/lib/utils";

interface TalaRuleProps {
  className?: string;
}

export function TalaRule({ className }: TalaRuleProps) {
  return <hr className={cn("border-0 h-px bg-tala-rule w-full", className)} />;
}
