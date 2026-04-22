export type MiningKey = "scope" | "metric" | "impact" | "names" | "tools";

export interface InterviewJob {
  id: string;
  role: string;
  company: string;
  dates: string;
  level: number;
  mined: Record<MiningKey, boolean>;
}

export interface ChatMessage {
  id: string;
  role: "tala" | "user";
  text: string;
  mining?: boolean;
  fresh?: boolean;
  timestamp: Date;
}

export interface BulletDraft {
  id: string;
  jobId: string;
  text: string;
  level: number;
  fresh: boolean;
}

export interface InterviewState {
  sessionId: string | null;
  jobs: InterviewJob[];
  activeJobId: string;
  messages: ChatMessage[];
  bullets: Record<string, BulletDraft[]>;
  liveBullet: { text: string; elapsed: number } | null;
  suggestions: string[];
  isTyping: boolean;
  completeness: number;
  coachTip: string;
}
