import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { buildInterviewSystemPrompt } from "@/lib/ai/interview-prompts";
import type { InterviewPhase } from "@/lib/ai/interview-prompts";

export async function POST(req: Request) {
  const { messages, context, systemInstruction } = await req.json();

  let systemPrompt = buildInterviewSystemPrompt({
    targetRole: context?.targetRole ?? "General",
    experienceLevel: context?.experienceLevel ?? "entry",
    goal: context?.goal ?? "first_job",
    languagePref: context?.languagePref ?? "en",
    resumeText: context?.resumeText,
    phase: context?.phase as InterviewPhase | undefined,
    jobs: context?.jobs,
    activeJobId: context?.activeJobId,
  });

  if (systemInstruction) {
    systemPrompt += `\n\n## Immediate instruction\n${systemInstruction}`;
  }

  const result = streamText({
    model: openai("gpt-4.1-mini"),
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
    maxOutputTokens: 512,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
