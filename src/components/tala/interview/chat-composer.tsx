"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { TalaChip } from "@/components/tala/tala-chip";

interface ChatComposerProps {
  suggestions: string[];
  onSend: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatComposer({
  suggestions,
  onSend,
  disabled = false,
  className,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChipClick(text: string) {
    if (disabled) return;
    onSend(text);
  }

  return (
    <div className={cn("border-t border-tala-rule px-4 lg:px-20 py-3 lg:py-5 lg:pb-7 bg-tala-bg", className)}>
      {suggestions.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleChipClick(s)} disabled={disabled}>
              <TalaChip variant="ghost" className="cursor-pointer hover:bg-tala-rule/40 transition-colors">
                {s}
              </TalaChip>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3 border border-tala-rule rounded-2xl px-3.5 py-3 bg-tala-surface">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mag-type na lang... or tap a chip above"
          rows={2}
          disabled={disabled}
          className="flex-1 border-none bg-transparent resize-none outline-none font-sans text-sm text-tala-ink leading-relaxed placeholder:text-tala-faint disabled:opacity-50"
        />
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-transparent border border-tala-rule flex items-center justify-center text-tala-muted hover:bg-tala-rule/40 transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M7 2v10M2 7h10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="w-9 h-9 rounded-full bg-tala-ink text-tala-bg border-none flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7h10m-4-4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-[11px] text-tala-muted">
        <span>EN / FIL · Tala auto-translates</span>
        <span className="font-mono">⌘ ↵ to send</span>
      </div>
    </div>
  );
}
