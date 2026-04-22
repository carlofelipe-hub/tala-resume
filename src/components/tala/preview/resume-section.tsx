"use client";

interface ResumeSectionProps {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}

export function ResumeSection({ label, children, last = false }: ResumeSectionProps) {
  return (
    <div style={{ marginTop: 18, marginBottom: last ? 0 : 0 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8.5,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#888",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
