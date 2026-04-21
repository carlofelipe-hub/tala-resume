"use server";

import { createClient } from "@/lib/supabase/server";

interface OnboardingData {
  goal: string;
  experience: string;
  targetRole: string;
  language: string;
}

export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      goal: data.goal,
      experience_level: data.experience,
      target_role: data.targetRole,
      language: data.language,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
