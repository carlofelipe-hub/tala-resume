import { TalaLogo } from "@/components/tala/tala-logo";
import { TalaSunBackdrop } from "@/components/tala/tala-sun-backdrop";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-tala-bg px-4">
      <TalaSunBackdrop
        size={500}
        className="top-[-100px] right-[-100px] z-0"
      />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="flex justify-center mb-8">
          <a href="/">
            <TalaLogo size="lg" />
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
