import { cn } from "@/lib/utils";

interface TalaSunProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export function TalaSun({
  size = 24,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
}: TalaSunProps) {
  const cx = 12;
  const cy = 12;
  const innerR = 6;
  const outerR = 9.5;

  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    return {
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy + outerR * Math.sin(angle),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <circle cx={cx} cy={cy} r={3.5} fill={color} stroke="none" />
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
      ))}
    </svg>
  );
}
