import { TalaMeta } from "@/components/tala/tala-meta";
import Link from "next/link";

function MailIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-tala-accent"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function CheckEmailPage() {
  return (
    <div className="rounded-[14px] border border-tala-rule bg-tala-surface p-8 text-center">
      <div className="flex justify-center mb-4">
        <MailIcon />
      </div>

      <h1 className="font-display text-2xl tracking-tight text-tala-ink mb-2">
        Check your email
      </h1>
      <p className="text-sm text-tala-muted mb-6 leading-relaxed">
        We sent you a magic link. Click the link in your email to sign
        in&mdash;walang password needed.
      </p>

      <TalaMeta className="mb-4">Didn&rsquo;t get it? Check spam.</TalaMeta>

      <Link
        href="/login"
        className="text-sm text-tala-accent-ink font-medium hover:underline"
      >
        &larr; Back to login
      </Link>
    </div>
  );
}
