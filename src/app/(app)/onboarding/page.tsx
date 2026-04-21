"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TalaButton } from "@/components/tala/tala-button";
import { TalaInput } from "@/components/tala/tala-input";
import { TalaProgress } from "@/components/tala/tala-progress";
import { TalaMeta } from "@/components/tala/tala-meta";
import { TalaLogo } from "@/components/tala/tala-logo";
import { TalaSunBackdrop } from "@/components/tala/tala-sun-backdrop";
import { saveOnboarding } from "./actions";

const TOTAL_STEPS = 4;

const goals = [
  { value: "first-job", label: "Land my first job", desc: "Fresh grad or career starter" },
  { value: "career-switch", label: "Switch careers", desc: "Moving to a new field" },
  { value: "promotion", label: "Level up", desc: "Aiming for a promotion or better role" },
  { value: "ofw", label: "Work abroad", desc: "OFW or international opportunities" },
];

const experienceLevels = [
  { value: "student", label: "Student / Fresh grad", desc: "Less than 1 year" },
  { value: "entry", label: "Entry level", desc: "1–2 years" },
  { value: "mid", label: "Mid level", desc: "3–7 years" },
  { value: "senior", label: "Senior", desc: "8+ years" },
];

const languages = [
  { value: "en", label: "English", desc: "Full English experience" },
  { value: "fil", label: "Filipino", desc: "Tagalog / Filipino" },
  { value: "both", label: "Both", desc: "Mix of English and Filipino" },
];

function OptionCard({
  selected,
  onClick,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-[14px] border p-4 transition-all cursor-pointer ${
        selected
          ? "border-tala-accent bg-tala-accent-wash"
          : "border-tala-rule bg-tala-surface hover:border-tala-muted"
      }`}
    >
      <p
        className={`text-sm font-medium ${
          selected ? "text-tala-accent-ink" : "text-tala-ink"
        }`}
      >
        {label}
      </p>
      <p className="text-xs text-tala-muted mt-0.5">{desc}</p>
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [language, setLanguage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = (step / TOTAL_STEPS) * 100;

  function canProceed() {
    switch (step) {
      case 1:
        return !!goal;
      case 2:
        return !!experience;
      case 3:
        return targetRole.trim().length > 0;
      case 4:
        return !!language;
      default:
        return false;
    }
  }

  async function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    setSaving(true);
    setError(null);

    const result = await saveOnboarding({ goal, experience, targetRole, language });

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
  }

  const stepTitles: Record<number, { tagalog: string; english: string }> = {
    1: { tagalog: "Ano ang goal mo?", english: "What's your goal?" },
    2: {
      tagalog: "Gaano ka na katagal nagwo-work?",
      english: "How much experience do you have?",
    },
    3: {
      tagalog: "Anong role ang gusto mo?",
      english: "What role are you targeting?",
    },
    4: {
      tagalog: "Paano mo gustong makipag-usap?",
      english: "What language do you prefer?",
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-tala-bg">
      <TalaSunBackdrop
        size={400}
        className="top-[-80px] right-[-80px] z-0"
      />

      {/* Top bar */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-5 max-w-[1440px] mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <TalaLogo size="sm" />
          <TalaMeta>
            Step {step} of {TOTAL_STEPS}
          </TalaMeta>
        </div>
        <TalaProgress value={progress} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-6 pt-8 md:pt-16">
        <div className="w-full max-w-[480px]">
          <h1 className="font-display text-3xl md:text-4xl tracking-tight text-tala-ink mb-1">
            {stepTitles[step].tagalog}
          </h1>
          <p className="text-sm text-tala-muted mb-8">
            {stepTitles[step].english}
          </p>

          {error && (
            <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((g) => (
                <OptionCard
                  key={g.value}
                  selected={goal === g.value}
                  onClick={() => setGoal(g.value)}
                  label={g.label}
                  desc={g.desc}
                />
              ))}
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experienceLevels.map((e) => (
                <OptionCard
                  key={e.value}
                  selected={experience === e.value}
                  onClick={() => setExperience(e.value)}
                  label={e.label}
                  desc={e.desc}
                />
              ))}
            </div>
          )}

          {/* Step 3: Target Role */}
          {step === 3 && (
            <div>
              <TalaInput
                placeholder="e.g. Software Engineer, Marketing Manager, Nurse"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
              <p className="text-xs text-tala-faint mt-2">
                Don&rsquo;t worry, you can always change this later.
              </p>
            </div>
          )}

          {/* Step 4: Language */}
          {step === 4 && (
            <div className="grid grid-cols-1 gap-3">
              {languages.map((l) => (
                <OptionCard
                  key={l.value}
                  selected={language === l.value}
                  onClick={() => setLanguage(l.value)}
                  label={l.label}
                  desc={l.desc}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <TalaButton
                variant="ghost"
                onClick={() => setStep(step - 1)}
              >
                Back
              </TalaButton>
            ) : (
              <div />
            )}

            <TalaButton
              onClick={handleNext}
              disabled={!canProceed() || saving}
            >
              {step === TOTAL_STEPS
                ? saving
                  ? "Saving…"
                  : "Tara na!"
                : "Next"}
            </TalaButton>
          </div>
        </div>
      </div>
    </div>
  );
}
