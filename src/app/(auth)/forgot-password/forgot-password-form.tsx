"use client";

import { useState, useTransition } from "react";
import { resetPasswordForEmail } from "./actions";
import Link from "next/link";
import Image from "next/image";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await resetPasswordForEmail(email);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ 
          type: "success", 
          text: "If an account exists with this email, a password reset link has been sent to it." 
        });
      }
    });
  }

  return (
    <div className="animate-scale-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-card)] shadow-sm shadow-[#F7A8B8]/30 mb-4 animate-float overflow-hidden bg-background">
          <Image 
            src="/logo.jpg" 
            alt="Fitcheck Logo" 
            width={64} 
            height={64} 
            className="w-full h-full object-cover" 
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-poppins)] tracking-tight">
          Forgot Password
        </h1>
        <p className="text-sm text-[#8C6B78] dark:text-zinc-400 mt-1 tracking-wide">
          Enter your email to receive a reset link
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[var(--radius-card)] shadow-xl shadow-[#F7A8B8]/10 border border-[#F7A8B8]/20 dark:border-zinc-800 p-8">
        {message && (
          <div className={`mb-4 p-3 rounded-[var(--radius-button)] border text-sm animate-fade-in-up ${
            message.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {message.type === "success" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                )}
              </svg>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[#4A2030] dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#D86A84] transition-colors">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isPending}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-[var(--radius-button)] bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-zinc-950 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !email}
            className="w-full mt-2 py-3 px-4 rounded-[var(--radius-button)] text-white font-semibold text-sm bg-gradient-to-r from-[#E88CA0] via-[#D86A84] to-[#C4506C] shadow-sm shadow-[#D86A84]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#D86A84]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm relative overflow-hidden group"
          >
            <span className={`flex items-center justify-center gap-2 ${isPending ? 'opacity-0' : ''}`}>
              Send Reset Link
            </span>
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-[#D86A84] hover:text-[#C4506C] font-semibold transition-colors hover:underline underline-offset-2 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-8 7h18" />
            </svg>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}



