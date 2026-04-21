"use server";

import { createClient } from "@/lib/supabase/server";
import { extractText } from "unpdf";
import { analyzeResume } from "@/lib/ai/analyze-resume";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadResume(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { error: "No file provided" };
  }

  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are accepted" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "File must be under 5MB" };
  }

  const resumeId = crypto.randomUUID();
  const filePath = `${user.id}/${resumeId}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, { contentType: "application/pdf" });

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const { error: insertError } = await supabase.from("resumes").insert({
    id: resumeId,
    user_id: user.id,
    file_name: file.name,
    file_path: filePath,
    file_size: file.size,
    status: "uploaded",
  });

  if (insertError) {
    return { error: `Failed to save record: ${insertError.message}` };
  }

  return { resumeId };
}

export async function processResume(resumeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { data: resume, error: fetchError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !resume) {
    return { error: "Resume not found" };
  }

  try {
    // Extract text
    await supabase
      .from("resumes")
      .update({ status: "extracting", updated_at: new Date().toISOString() })
      .eq("id", resumeId);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(resume.file_path);

    if (downloadError || !fileData) {
      throw new Error(`Download failed: ${downloadError?.message}`);
    }

    const buffer = new Uint8Array(await fileData.arrayBuffer());
    const { text: pages } = await extractText(buffer);
    const fullText = pages.join("\n");

    if (!fullText || fullText.trim().length === 0) {
      throw new Error(
        "Could not extract text from this PDF. It may be a scanned image."
      );
    }

    await supabase
      .from("resumes")
      .update({
        extracted_text: fullText,
        status: "analyzing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", resumeId);

    // Get user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("goal, experience_level, target_role")
      .eq("id", user.id)
      .single();

    const analysis = await analyzeResume(fullText, {
      goal: profile?.goal ?? "general",
      experienceLevel: profile?.experience_level ?? "entry",
      targetRole: profile?.target_role ?? "general",
    });

    if (!analysis.is_resume) {
      await supabase.storage.from("resumes").remove([resume.file_path]);
      await supabase.from("resumes").delete().eq("id", resumeId);
      revalidatePath("/upload");
      revalidatePath("/dashboard");
      return {
        error: analysis.rejection_reason ?? "Hindi ito résumé. / This doesn't appear to be a résumé.",
        rejected: true,
      };
    }

    await supabase
      .from("resumes")
      .update({
        analysis,
        status: "complete",
        updated_at: new Date().toISOString(),
      })
      .eq("id", resumeId);

    revalidatePath("/upload");
    return { success: true, resumeId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Processing failed";
    await supabase
      .from("resumes")
      .update({
        status: "error",
        error_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resumeId);

    revalidatePath("/upload");
    return { error: message };
  }
}

export async function deleteResume(resumeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { data: resume, error: fetchError } = await supabase
    .from("resumes")
    .select("id, file_path, user_id")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !resume) {
    return { error: "Resume not found" };
  }

  await supabase.storage.from("resumes").remove([resume.file_path]);
  await supabase.from("resumes").delete().eq("id", resumeId);

  revalidatePath("/upload");
  revalidatePath("/dashboard");
  return { success: true };
}
