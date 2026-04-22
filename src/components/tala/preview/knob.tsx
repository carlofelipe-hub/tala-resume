"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KnobProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function Knob({ label, value, options, onChange }: KnobProps) {
  return (
    <div className="mb-4">
      <div className="text-xs text-tala-muted mb-1.5">{label}</div>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="w-full h-9 text-sm bg-tala-bg border-tala-rule">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-sm">
              {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/-/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
