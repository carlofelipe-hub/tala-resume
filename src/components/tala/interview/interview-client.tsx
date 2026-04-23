"use client";

import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import type { ChatMeta, Message as StreamingMessage } from "@/hooks/use-streaming-chat";
import type { InterviewPhase } from "@/lib/ai/interview-prompts";
import { InterviewTopBar } from "./interview-top-bar";
import { InterviewSidebar } from "./interview-sidebar";
import { ChatHeader } from "./chat-header";
import { ChatBubble } from "./chat-bubble";
import { ChatComposer } from "./chat-composer";
import { TypingIndicator } from "./typing-indicator";
import { RightPanel } from "./right-panel";
import { MobileTabBar, type MobileTab } from "./mobile-tab-bar";
import type { InterviewJob, ChatMessage, BulletDraft, MiningKey } from "@/types/interview";
import type { ResumeAnalysis } from "@/types/resume";

interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  dates: string | null;
  description: string | null;
  sort_order: number;
}

interface InterviewClientProps {
  userName: string;
  targetRole: string;
  experienceLevel: string;
  goal: string;
  languagePref: string;
  resumeText: string | null;
  resumeAnalysis: ResumeAnalysis | null;
  experiences: ResumeExperience[];
}

const SECTIONS = [
  { label: "Profile summary", state: "pending" as const },
  { label: "Education", state: "pending" as const },
  { label: "Skills", state: "pending" as const },
  { label: "Projects", state: "pending" as const },
];

const PHASE_TIPS: Record<InterviewPhase, string> = {
  warmup: "When you mention a number, Tala locks it in as a résumé bullet. Aim for 3–5 numbers per job.",
  mining: "Be specific! Instead of 'I helped the team', try 'I led a team of 5 engineers to ship the feature 2 weeks early.'",
  gaps: "Think about skills on the job posting that you haven't mentioned yet — certifications, tools, or side projects count too.",
  wrapup: "Almost done! Review your bullets on the right and click 'Preview résumé' when you're ready.",
};

function experiencesToJobs(experiences: ResumeExperience[]): InterviewJob[] {
  return experiences.map((exp) => ({
    id: exp.id,
    role: exp.role,
    company: exp.company,
    dates: exp.dates ?? "",
    level: 0,
    mined: { scope: false, metric: false, impact: false, names: false, tools: false },
  }));
}

function buildWelcomeMessage(
  userName: string,
  hasResume: boolean,
  firstJob: ResumeExperience | null
): string {
  const name = userName ? `, ${userName.split(" ")[0]}` : "";
  if (hasResume && firstJob) {
    return `Kumusta${name}! I'm Tala, your résumé coach. I see you've been working as ${firstJob.role} at ${firstJob.company} — let's dig deeper into that and mine the real wins. Kwento mo lang, walang pressure.`;
  }
  if (hasResume) {
    return `Kumusta${name}! I'm Tala, your résumé coach. I've looked at your resume — let's dig deeper and mine your real achievements. Kwento mo lang, walang pressure. Tell me about your most recent role — what did you actually do there?`;
  }
  return `Kumusta${name}! I'm Tala, your résumé coach. Let's build your résumé from scratch — I'll ask you about your experiences and pull out the good stuff. Kwento mo lang, walang pressure. What's been your most recent role?`;
}

function buildJobWelcome(job: InterviewJob | null, userName: string): string {
  const name = userName ? `, ${userName.split(" ")[0]}` : "";
  if (job?.role && job?.company) {
    return `Kumusta${name}! Let's dig into your time as ${job.role} at ${job.company}. Kwento mo lang — what was a typical project or responsibility you owned there?`;
  }
  if (job?.role) {
    return `Kumusta${name}! Let's talk about your role as ${job.role}. What did your day-to-day look like?`;
  }
  return `Kumusta${name}! Tell me about this role — what did you actually do there?`;
}

function buildSuggestions(hasResume: boolean, phase: InterviewPhase): string[] {
  if (phase === "wrapup") {
    return ["Show me a summary", "I want to add more", "Let's preview my résumé"];
  }
  if (phase === "gaps") {
    return ["I have certifications", "I know these tools", "I did side projects"];
  }
  if (hasResume) {
    return [
      "Let's start with my latest job",
      "I want to focus on a specific role",
      "I have achievements I didn't include",
      "I'm not sure what to highlight",
    ];
  }
  return [
    "I managed a team",
    "I worked on a big project",
    "I improved a process",
    "I don't know where to start",
  ];
}

function computeCompleteness(jobs: InterviewJob[], bullets: Record<string, BulletDraft[]>): number {
  if (jobs.length === 0) return 0;
  const totalKeys = jobs.length * 5;
  const minedKeys = jobs.reduce(
    (acc, j) => acc + Object.values(j.mined).filter(Boolean).length,
    0
  );
  const bulletCount = Object.values(bullets).reduce((acc, b) => acc + b.length, 0);
  const miningScore = (minedKeys / totalKeys) * 60;
  const bulletScore = Math.min((bulletCount / (jobs.length * 3)) * 40, 40);
  return Math.round(miningScore + bulletScore);
}

function computeJobLevel(mined: Record<MiningKey, boolean>, bulletCount: number): number {
  const minedCount = Object.values(mined).filter(Boolean).length;
  if (minedCount >= 4 && bulletCount >= 3) return 4;
  if (minedCount >= 3 && bulletCount >= 2) return 3;
  if (minedCount >= 2 && bulletCount >= 1) return 2;
  if (minedCount >= 1) return 1;
  return 0;
}

async function saveSession(data: {
  id?: string;
  phase: InterviewPhase;
  jobs: InterviewJob[];
  newMessages: Array<{ role: string; content: string }>;
  bullets: Record<string, BulletDraft[]>;
  completeness: number;
  activeJobId: string;
  resumeId?: string;
}) {
  try {
    const res = await fetch("/api/interview/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return null;
  }
}

export function InterviewClient({
  userName,
  targetRole,
  experienceLevel,
  goal,
  languagePref,
  resumeText,
  resumeAnalysis,
  experiences,
}: InterviewClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);
  const savedMsgCountByJobRef = useRef<Record<string, number>>({});
  const prevActiveJobIdRef = useRef<string>("");

  const initialJobs = useMemo(() => experiencesToJobs(experiences), [experiences]);
  const [jobs, setJobs] = useState<InterviewJob[]>(initialJobs);
  const [activeJobId, setActiveJobId] = useState<string>(initialJobs[0]?.id ?? "");
  const [phase, setPhase] = useState<InterviewPhase>("warmup");
  const [bulletsMap, setBulletsMap] = useState<Record<string, BulletDraft[]>>({});
  const [liveBullet, setLiveBullet] = useState<{ text: string; elapsed: number } | null>(null);
  const [messagesByJob, setMessagesByJob] = useState<Record<string, StreamingMessage[]>>({});
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");

  const hasResume = !!resumeText;
  const firstExp = experiences[0] ?? null;
  const welcomeMessage = useMemo(
    () => buildWelcomeMessage(userName, hasResume, firstExp),
    [userName, hasResume, firstExp]
  );

  const interviewContext = useMemo(
    () => ({
      targetRole: targetRole || "General",
      experienceLevel: experienceLevel || "entry",
      goal: goal || "first_job",
      languagePref: languagePref || "en",
      phase,
      activeJobId,
      jobs: jobs.map((j) => ({
        id: j.id,
        role: j.role,
        company: j.company,
        mined: j.mined,
      })),
      ...(resumeText ? { resumeText: resumeText.slice(0, 8000) } : {}),
    }),
    [targetRole, experienceLevel, goal, languagePref, resumeText, phase, activeJobId, jobs]
  );

  const handleMeta = useCallback(
    (meta: ChatMeta) => {
      if (meta.phase && meta.phase !== phase) {
        setPhase(meta.phase);
      }

      const targetJobId = meta.jobId || activeJobId;

      if (meta.mined.length > 0 && targetJobId) {
        setJobs((prev) =>
          prev.map((j) => {
            if (j.id !== targetJobId) return j;
            const updatedMined = { ...j.mined };
            for (const key of meta.mined) {
              if (key in updatedMined) {
                updatedMined[key as MiningKey] = true;
              }
            }
            const jobBullets = bulletsMap[j.id]?.length ?? 0;
            const newBulletCount = meta.bullet ? jobBullets + 1 : jobBullets;
            return {
              ...j,
              mined: updatedMined,
              level: computeJobLevel(updatedMined, newBulletCount),
            };
          })
        );
      }

      if (meta.bullet && targetJobId) {
        const newBullet: BulletDraft = {
          id: `bullet-${Date.now()}`,
          jobId: targetJobId,
          text: meta.bullet,
          level: 1,
          fresh: true,
        };

        setLiveBullet({ text: meta.bullet, elapsed: 0 });
        setTimeout(() => setLiveBullet(null), 4000);

        setBulletsMap((prev) => {
          const existing = prev[targetJobId] ?? [];
          const updated = [
            ...existing.map((b) => ({ ...b, fresh: false })),
            newBullet,
          ];
          return { ...prev, [targetJobId]: updated };
        });
      }
    },
    [phase, activeJobId, bulletsMap]
  );

  const { messages, sendMessage, isLoading, resetMessages } = useStreamingChat({
    api: "/api/interview/chat",
    context: interviewContext,
    initialMessages: [],
    onMeta: handleMeta,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (messages.length <= 1) return;

    const savedCount = savedMsgCountByJobRef.current[activeJobId] ?? 0;
    const unsaved = messages.slice(savedCount);
    if (unsaved.length === 0 && sessionIdRef.current) return;

    const newMessages = unsaved.map((m) => ({ role: m.role, content: m.content }));
    const comp = computeCompleteness(jobs, bulletsMap);

    saveSession({
      id: sessionIdRef.current ?? undefined,
      phase,
      jobs,
      newMessages,
      bullets: bulletsMap,
      completeness: comp,
      activeJobId,
    }).then((res) => {
      if (res?.session?.id && !sessionIdRef.current) {
        sessionIdRef.current = res.session.id;
      }
      savedMsgCountByJobRef.current[activeJobId] = messages.length;
    });
  }, [isLoading, messages.length, phase, jobs, bulletsMap, activeJobId, messages]);

  /* ------------------------------------------------------------------ */
  /* Initialise first-job welcome on mount                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (initialJobs.length === 0) return;
    const firstId = initialJobs[0].id;
    prevActiveJobIdRef.current = firstId;
    resetMessages([
      { id: `welcome-${firstId}`, role: "assistant", content: welcomeMessage },
    ]);
    savedMsgCountByJobRef.current[firstId] = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------ */
  /* Save current thread + restore new thread on job switch              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const prevId = prevActiveJobIdRef.current;
    if (prevId === activeJobId) return; // initial mount handled above

    // Save the thread we are leaving
    setMessagesByJob((prev) => ({ ...prev, [prevId]: messages }));
    savedMsgCountByJobRef.current[prevId] = messages.length;

    // Restore or create thread for the job we are entering
    const saved = messagesByJob[activeJobId];
    if (saved && saved.length > 0) {
      resetMessages(saved);
      savedMsgCountByJobRef.current[activeJobId] = saved.length;
    } else {
      const job = jobs.find((j) => j.id === activeJobId);
      resetMessages([
        {
          id: `welcome-${activeJobId}`,
          role: "assistant",
          content: buildJobWelcome(job ?? null, userName),
        },
      ]);
      savedMsgCountByJobRef.current[activeJobId] = 1;
    }

    prevActiveJobIdRef.current = activeJobId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJobId]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const chatMessages: ChatMessage[] = useMemo(
    () =>
      messages.map((m) => ({
        id: m.id,
        role: m.role === "assistant" ? ("tala" as const) : ("user" as const),
        text: m.content,
        timestamp: new Date(),
      })),
    [messages]
  );

  const activeJob = jobs.find((j) => j.id === activeJobId) ?? jobs[0] ?? null;
  const activeBullets = activeJob ? (bulletsMap[activeJob.id] ?? []) : [];
  const completeness = computeCompleteness(jobs, bulletsMap);
  const suggestions = messages.length <= 1 ? buildSuggestions(hasResume, phase) : [];
  const coachTip = PHASE_TIPS[phase];

  const handleJobSelect = useCallback(
    (newJobId: string) => {
      if (newJobId === activeJobId) return;
      // Save current thread before switching (the effect will also do this,
      // but doing it here ensures we capture the very latest messages)
      setMessagesByJob((prev) => ({ ...prev, [activeJobId]: messages }));
      savedMsgCountByJobRef.current[activeJobId] = messages.length;
      setActiveJobId(newJobId);
    },
    [activeJobId, messages]
  );

  const handleJobEdit = useCallback(
    (id: string, updates: { role: string; company: string; dates: string }) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
      );
    },
    []
  );

  const handleJobDelete = useCallback(
    (id: string) => {
      setJobs((prev) => {
        const next = prev.filter((j) => j.id !== id);
        if (id === activeJobId && next.length > 0) {
          setActiveJobId(next[0].id);
        }
        if (next.length === 0) {
          setMobileTab("chat");
        }
        return next;
      });
      setBulletsMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setMessagesByJob((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    },
    [activeJobId]
  );

  const handleJobAdd = useCallback(() => {
    const newJob: InterviewJob = {
      id: `new-${Date.now()}`,
      role: "",
      company: "",
      dates: "",
      level: 0,
      mined: { scope: false, metric: false, impact: false, names: false, tools: false },
    };
    setJobs((prev) => [...prev, newJob]);
    setActiveJobId(newJob.id);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <InterviewTopBar completeness={completeness} />

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[280px_1fr_420px] overflow-hidden">
        {/* Sidebar — desktop always, mobile only on Jobs tab */}
        <div className={cn("h-full overflow-auto", mobileTab !== "jobs" && "hidden lg:block")}>
          <InterviewSidebar
            jobs={jobs}
            activeJobId={activeJob?.id ?? ""}
            sections={SECTIONS}
            onJobSelect={handleJobSelect}
            onJobEdit={handleJobEdit}
            onJobDelete={handleJobDelete}
            onJobAdd={handleJobAdd}
            showSections={false}
            className="h-full"
          />
        </div>

        {/* Chat — desktop always, mobile only on Chat tab */}
        <div className={cn("flex flex-col h-full overflow-hidden relative", mobileTab !== "chat" && "hidden lg:flex")}>
          <div ref={scrollRef} className="flex-1 overflow-auto px-4 pt-4 lg:px-20 lg:pt-10">
            <ChatHeader activeJob={activeJob} />

            {chatMessages.map((msg, i) => {
              const prevRole = i > 0 ? chatMessages[i - 1].role : null;
              const nextRole =
                i < chatMessages.length - 1
                  ? chatMessages[i + 1].role
                  : null;

              return (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  showAvatar={msg.role !== prevRole}
                  isLast={msg.role !== nextRole}
                  isStreaming={
                    isLoading &&
                    i === chatMessages.length - 1 &&
                    msg.role === "tala"
                  }
                />
              );
            })}

            {isLoading &&
              chatMessages[chatMessages.length - 1]?.role !== "tala" && (
                <div className="pl-11 mt-2">
                  <TypingIndicator />
                </div>
              )}

            <div className="h-4" />
          </div>

          <ChatComposer
            suggestions={suggestions}
            onSend={handleSend}
            disabled={isLoading}
          />
        </div>

        {/* Right panel — desktop always, mobile only on Bullets tab */}
        <div className={cn("h-full overflow-auto flex flex-col", mobileTab !== "bullets" && "hidden lg:block")}>
          <div className="lg:hidden p-4 border-b border-tala-rule bg-tala-surface flex items-center justify-end gap-2 shrink-0">
            <a
              href={`/preview?session=${sessionIdRef.current ?? ""}`}
              className="text-xs font-medium text-tala-muted hover:text-tala-ink transition-colors"
            >
              Preview résumé
            </a>
            <button className="text-xs font-medium bg-tala-ink text-tala-bg rounded-full px-3 py-1.5 border-none cursor-pointer hover:opacity-90 transition-opacity">
              Export
            </button>
          </div>
          <RightPanel
            activeJob={activeJob}
            bullets={activeBullets}
            coachTip={coachTip}
            liveBullet={liveBullet}
          />
        </div>

        {/* Mobile tab bar */}
        <MobileTabBar
          activeTab={mobileTab}
          onChange={setMobileTab}
          className="lg:hidden shrink-0"
        />
      </div>
    </div>
  );
}
