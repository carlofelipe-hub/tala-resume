import { TalaAvatar } from "@/components/tala/tala-avatar";
import type { InterviewJob } from "@/types/interview";

interface ChatHeaderProps {
  activeJob: InterviewJob | null;
}

export function ChatHeader({ activeJob }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <TalaAvatar initials="T" accent size="sm" />
      <div>
        <div className="text-sm font-semibold text-tala-ink">
          Tala · your résumé coach
        </div>
        {activeJob && (
          <div className="text-xs text-tala-muted">
            Mining{" "}
            <em className="text-tala-ink not-italic font-medium">
              {activeJob.role}
            </em>{" "}
            · {activeJob.company}
          </div>
        )}
      </div>
    </div>
  );
}
