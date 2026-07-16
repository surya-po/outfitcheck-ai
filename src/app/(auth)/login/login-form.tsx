"use client";

import { useState, useTransition, useEffect } from "react";
import { signInWithEmail, signInWithGoogle } from "./actions";
import Link from "next/link";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);
  
  // State for Remember Me
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("outfitcheck_remembered_email");
    if (savedEmail) {
      setTimeout(() => {
        setEmail(savedEmail);
        setRemember(true);
      }, 0);
    }
  }, []);

  async function handleEmailLogin(formData: FormData) {
    setError(null);
    
    const submittedEmail = formData.get("email") as string;
    if (remember) {
      localStorage.setItem("outfitcheck_remembered_email", submittedEmail);
    } else {
      localStorage.removeItem("outfitcheck_remembered_email");
    }

    startTransition(async () => {
      const result = await signInWithEmail(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  async function handleGoogleLogin() {
    setError(null);
    setIsGooglePending(true);
    try {
      const result = await signInWithGoogle();
      if (result?.error) {
        setError(result.error);
        setIsGooglePending(false);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setIsGooglePending(false);
    }
  }

  const isLoading = isPending || isGooglePending;

  return (
    <div className="animate-scale-in">
      {/* Logo & Tagline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-card)] bg-gradient-to-br from-[#F7A8B8] via-[#E88CA0] to-[#D86A84] shadow-sm shadow-[#F7A8B8]/30 mb-4 animate-float">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2C14.5 2 13.2 2.8 12.5 4L8 11.5C7.3 12.7 7.3 14.3 8 15.5L12.5 23C13.2 24.2 14.5 25 16 25C17.5 25 18.8 24.2 19.5 23L24 15.5C24.7 14.3 24.7 12.7 24 11.5L19.5 4C18.8 2.8 17.5 2 16 2Z"
              fill="white"
              fillOpacity="0.9"
            />
            <circle cx="16" cy="13.5" r="3" fill="#D86A84" />
            <path
              d="M12 19C12 19 13.5 22 16 22C18.5 22 20 19 20 19"
              stroke="#D86A84"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 28L12 25H20L22 28"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-poppins)] tracking-tight">
          OutfitCheck
          <span className="bg-gradient-to-r from-[#D86A84] to-[#E88CA0] bg-clip-text text-transparent">
            {" "}AI
          </span>
        </h1>
        <p className="text-sm text-[#8C6B78] mt-1 tracking-wide">
          AI Personal Fashion Assistant
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[var(--radius-card)] shadow-xl shadow-[#F7A8B8]/10 border border-[#F7A8B8]/20 p-8">
        <h2 className="text-xl font-semibold text-foreground font-[family-name:var(--font-poppins)] mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-[#8C6B78] mb-6">
          Sign in to continue your style journey
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-[var(--radius-button)] bg-red-50 border border-red-200 text-red-600 text-sm animate-fade-in-up">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Email/Password Form */}
        <form action={handleEmailLogin} className="space-y-4">
          <input type="hidden" name="remember" value={remember ? "true" : "false"} />
          
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[#4A2030]">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#D86A84] transition-colors">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isLoading}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-[var(--radius-button)] bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#4A2030]">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#D86A84] transition-colors">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-[var(--radius-button)] bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label htmlFor="remember_ui" className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  id="remember_ui"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={isLoading}
                  className="peer sr-only"
                />
                <div className="w-4.5 h-4.5 rounded-md border border-border bg-background peer-checked:bg-gradient-to-br peer-checked:from-[#F7A8B8] peer-checked:to-[#D86A84] peer-checked:border-transparent transition-all duration-300 group-hover:border-primary">
                  <svg
                    className="w-4.5 h-4.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Visible check overlay */}
                <svg
                  className="absolute inset-0 w-4.5 h-4.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-[#6B3A4A] select-none">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[#D86A84] hover:text-[#C4506C] font-medium transition-colors duration-300 hover:underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-[var(--radius-button)] text-white font-semibold text-sm bg-gradient-to-r from-[#E88CA0] via-[#D86A84] to-[#C4506C] shadow-sm shadow-[#D86A84]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#D86A84]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm relative overflow-hidden group"
          >
            <span className={`flex items-center justify-center gap-2 ${isPending ? 'opacity-0' : ''}`}>
              Sign In
            </span>
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white/80 text-[#8C6B78] tracking-wider uppercase">
              or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-[var(--radius-button)] bg-white border border-border text-foreground font-medium text-sm transition-all duration-300 hover:border-primary hover:shadow-sm hover:shadow-[#F7A8B8]/10 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden"
        >
          {isGooglePending ? (
            <div className="w-5 h-5 border-2 border-primary/30 border-t-[#D86A84] rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>{isGooglePending ? "Connecting..." : "Continue with Google"}</span>
        </button>
      </div>

      {/* Register Link */}
      <p className="text-center mt-6 text-sm text-[#8C6B78]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#D86A84] hover:text-[#C4506C] font-semibold transition-colors duration-300 hover:underline underline-offset-2"
        >
          Create one
        </Link>
      </p>

      {/* Partner Login Link */}
      <div className="mt-4 pt-4 border-t border-[#F5D5E5]/60">
        <p className="text-center text-xs text-[#8C6B78]">
          Admin Butik Partner?{" "}
          <Link
            href="/partner-login"
            className="text-[#8C6B78] hover:text-[#C4506C] font-medium transition-colors underline underline-offset-2"
          >
            Masuk ke Partner Portal →
          </Link>
        </p>
      </div>
    </div>
  );
}



