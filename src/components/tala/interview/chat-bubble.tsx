"use client";

import { cn } from "@/lib/utils";
import { TalaAvatar } from "@/components/tala/tala-avatar";
import type { ChatMessage } from "@/types/interview";

interface ChatBubbleProps {
  message: ChatMessage;
  showAvatar: boolean;
  isLast: boolean;
  isStreaming?: boolean;
  className?: string;
}

export function ChatBubble({
  message,
  showAvatar,
  isLast,
  isStreaming = false,
  className,
}: ChatBubbleProps) {
  const isTala = message.role === "tala";

  return (
    <div
      className={cn(
        "flex gap-3 mb-3.5",
        isTala ? "flex-row" : "flex-row-reverse",
        "items-start",
        className
      )}
    >
      {showAvatar ? (
        isTala ? (
          <TalaAvatar initials="T" accent size="sm" />
        ) : (
          <TalaAvatar initials="ME" size="sm" />
        )
      ) : (
        <div className="w-8 shrink-0" />
      )}

      <div className="max-w-[85%] lg:max-w-[480px]">
        <div
          className={cn(
            "relative px-4 py-3.5 text-sm leading-relaxed",
            isTala
              ? "bg-tala-surface border border-tala-rule text-tala-ink"
              : "bg-tala-ink text-tala-bg",
            "rounded-2xl",
            isTala && isLast && "rounded-bl-[4px]",
            !isTala && isLast && "rounded-br-[4px]"
          )}
        >
          {message.mining && isTala && (
            <div className="absolute -top-2.5 left-3.5 bg-tala-accent-wash text-tala-accent-ink px-2 py-0.5 rounded-md font-mono text-[9px] tracking-[1.2px]">
              MINING
            </div>
          )}
          {message.text}
          {isStreaming && (
            <span className="inline-block w-[2px] h-3.5 bg-tala-ink ml-0.5 align-middle animate-blink" />
          )}
        </div>
      </div>
    </div>
  );
}
