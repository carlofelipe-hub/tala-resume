"use client";

import { useState } from "react";
import Link from "next/link";
import { TalaButton } from "@/components/tala/tala-button";
import { TalaInput } from "@/components/tala/tala-input";
import { TalaRule } from "@/components/tala/tala-rule";
import { TalaMeta } from "@/components/tala/tala-meta";
import { signInWithGoogle, signInWithEmail } from "../actions";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleEmailLogin(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[14px] border border-tala-rule bg-tala-surface p-8">
      <h1 className="font-display text-2xl tracking-tight text-tala-ink mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-tala-muted mb-6">
        Log in to continue building your r&eacute;sum&eacute;.
      </p>

      {error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-11 rounded-full border border-tala-rule bg-tala-bg text-sm font-medium text-tala-ink flex items-center justify-center gap-3 hover:bg-tala-rule/30 transition-colors cursor-pointer disabled:opacity-50"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-4 my-6">
        <TalaRule className="flex-1" />
        <TalaMeta>or</TalaMeta>
        <TalaRule className="flex-1" />
      </div>

      <form action={handleEmailLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm text-tala-muted mb-1.5"
          >
            Email address
          </label>
          <TalaInput
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            required
          />
        </div>

        <TalaButton
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending…" : "Send magic link"}
        </TalaButton>
      </form>

      <p className="text-center text-sm text-tala-muted mt-6">
        Don&rsquo;t have an account?{" "}
        <Link
          href="/signup"
          className="text-tala-accent-ink font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
