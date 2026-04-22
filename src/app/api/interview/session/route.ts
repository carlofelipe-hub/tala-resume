import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: session } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ session: null });
  }

  const { data: messages } = await supabase
    .from("interview_messages")
    .select("id, role, content, created_at, job_id")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });

  // Group messages by job_id for per-job chat histories
  const messagesByJob: Record<string, Array<{ role: string; content: string }>> = {};
  for (const m of messages ?? []) {
    const jid = m.job_id ?? "default";
    if (!messagesByJob[jid]) messagesByJob[jid] = [];
    messagesByJob[jid].push({ role: m.role, content: m.content });
  }

  return NextResponse.json({ session, messagesByJob });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.id) {
    const { error } = await supabase
      .from("interview_sessions")
      .update({
        phase: body.phase,
        jobs: body.jobs,
        bullets: body.bullets,
        completeness: body.completeness,
        active_job_id: body.activeJobId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.newMessages?.length) {
      const rows = body.newMessages.map((m: { role: string; content: string }) => ({
        session_id: body.id,
        user_id: user.id,
        role: m.role,
        content: m.content,
        job_id: body.activeJobId ?? null,
      }));
      await supabase.from("interview_messages").insert(rows);
    }

    return NextResponse.json({ ok: true });
  }

  const { data: session, error } = await supabase
    .from("interview_sessions")
    .insert({
      user_id: user.id,
      resume_id: body.resumeId ?? null,
      phase: body.phase ?? "warmup",
      jobs: body.jobs ?? [],
      bullets: body.bullets ?? {},
      completeness: body.completeness ?? 0,
      active_job_id: body.activeJobId ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.newMessages?.length) {
    const rows = body.newMessages.map((m: { role: string; content: string }) => ({
      session_id: session.id,
      user_id: user.id,
      role: m.role,
      content: m.content,
      job_id: body.activeJobId ?? null,
    }));
    await supabase.from("interview_messages").insert(rows);
  }

  return NextResponse.json({ session });
}
