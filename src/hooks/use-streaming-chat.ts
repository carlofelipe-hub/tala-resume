"use client";

import { useState, useCallback, useRef } from "react";
import type { MiningKey } from "@/types/interview";
import type { InterviewPhase } from "@/lib/ai/interview-prompts";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatMeta {
  phase: InterviewPhase;
  mined: MiningKey[];
  bullet: string | null;
  jobId: string | null;
}

interface StreamingChatOptions {
  api: string;
  context: Record<string, unknown>;
  initialMessages?: Message[];
  onMeta?: (meta: ChatMeta) => void;
}

const META_REGEX = /<!--\s*META:(.*?)-->/;

function parseAndStripMeta(text: string): { clean: string; meta: ChatMeta | null } {
  const match = text.match(META_REGEX);
  if (!match) return { clean: text, meta: null };

  try {
    const meta = JSON.parse(match[1]) as ChatMeta;
    const clean = text.replace(META_REGEX, "").trimEnd();
    return { clean, meta };
  } catch {
    return { clean: text, meta: null };
  }
}

let messageCounter = 0;
function genId() {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export function useStreamingChat({
  api,
  context,
  initialMessages = [],
  onMeta,
}: StreamingChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string, options?: { systemInstruction?: string }) => {
      const userMsg: Message = { id: genId(), role: "user", content: text };
      const assistantMsg: Message = { id: genId(), role: "assistant", content: "" };

      const updatedMessages = [...messages, userMsg];
      setMessages([...updatedMessages, assistantMsg]);
      setIsLoading(true);

      abortRef.current = new AbortController();

      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context,
            systemInstruction: options?.systemInstruction,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          accumulated += decoder.decode(value, { stream: true });

          const { clean } = parseAndStripMeta(accumulated);
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              content: clean,
            };
            return copy;
          });
        }

        const { clean, meta } = parseAndStripMeta(accumulated);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: clean,
          };
          return copy;
        });

        if (meta && onMeta) {
          onMeta(meta);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              content: "Sorry, something went wrong. Please try again.",
            };
            return copy;
          });
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, api, context, onMeta]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const resetMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
  }, []);

  return { messages, sendMessage, isLoading, stop, resetMessages };
}
