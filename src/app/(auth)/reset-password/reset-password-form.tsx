"use client";

import { useState, useTransition } from "react";
import { resetPassword } from "./actions";
import { useRouter } from "next/navigation";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(password);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ 
          type: "success", 
          text: "Password has been successfully reset! Redirecting to dashboard..." 
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    });
  }

  return (
    <div className="animate-scale-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F7A8B8] via-[#E88CA0] to-[#D86A84] shadow-lg shadow-[#F7A8B8]/30 mb-4 animate-float">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C14.5 2 13.2 2.8 12.5 4L8 11.5C7.3 12.7 7.3 14.3 8 15.5L12.5 23C13.2 24.2 14.5 25 16 25C17.5 25 18.8 24.2 19.5 23L24 15.5C24.7 14.3 24.7 12.7 24 11.5L19.5 4C18.8 2.8 17.5 2 16 2Z" fill="white" fillOpacity="0.9"/>
            <circle cx="16" cy="13.5" r="3" fill="#D86A84"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#2D1F24] font-[family-name:var(--font-poppins)] tracking-tight">
          Create New Password
        </h1>
        <p className="text-sm text-[#8C6B78] mt-1 tracking-wide">
          Please enter your new password below
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#F7A8B8]/10 border border-[#F7A8B8]/20 p-8">
        {message && (
          <div className={`mb-4 p-3 rounded-xl border text-sm animate-fade-in-up ${
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
            <label htmlFor="password" className="text-sm font-medium text-[#4A2030]">
              New Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C4A0AE] group-focus-within:text-[#D86A84] transition-colors">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={isPending || message?.type === "success"}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FFF5F7] border border-[#F0D0D8] text-[#2D1F24] placeholder:text-[#C4A0AE] text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7A8B8] focus:border-[#E88CA0] focus:bg-white hover:border-[#E88CA0] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#4A2030]">
              Confirm New Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C4A0AE] group-focus-within:text-[#D86A84] transition-colors">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={isPending || message?.type === "success"}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FFF5F7] border border-[#F0D0D8] text-[#2D1F24] placeholder:text-[#C4A0AE] text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7A8B8] focus:border-[#E88CA0] focus:bg-white hover:border-[#E88CA0] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !password || !confirmPassword || message?.type === "success"}
            className="w-full mt-2 py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#E88CA0] via-[#D86A84] to-[#C4506C] shadow-lg shadow-[#D86A84]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#D86A84]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg relative overflow-hidden group"
          >
            <span className={`flex items-center justify-center gap-2 ${isPending ? 'opacity-0' : ''}`}>
              Reset Password
            </span>
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>
      </div>
    </div>
  );
}
