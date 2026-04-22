import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TalaLogo } from "@/components/tala/tala-logo";
import { SignOutButton } from "./sign-out-button";

export default async function AppLayout({
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
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 max-w-[1440px] mx-auto border-b border-tala-rule">
        <a href="/dashboard">
          <TalaLogo size="sm" />
        </a>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm text-tala-muted truncate max-w-[120px] sm:max-w-[200px]">
            {user.email}
          </span>
          <SignOutButton />
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-8">
        {children}
      </main>
    </div>
  );
}
