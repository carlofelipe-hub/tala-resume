import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TalaLogo } from "@/components/tala/tala-logo";
import { TalaMeta } from "@/components/tala/tala-meta";
import Link from "next/link";

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-tala-bg">
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-tala-rule bg-tala-surface">
        <div className="flex items-center gap-3.5">
          <TalaLogo size="sm" />
          <span className="w-px h-3.5 bg-tala-rule" />
          <TalaMeta>Preview · Editorial</TalaMeta>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/interview"
            className="inline-flex items-center justify-center rounded-lg border border-tala-rule bg-tala-surface px-3 py-1.5 text-sm font-medium text-tala-ink hover:bg-tala-bg transition-colors"
          >
            Back to interview
          </Link>
          <button
            disabled
            className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface opacity-50 cursor-not-allowed"
            title="Coming in next update"
          >
            Download PDF
          </button>
        </div>
      </header>

      {children}
    </div>
  );
}
