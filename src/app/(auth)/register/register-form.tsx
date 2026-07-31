"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpWithEmail, signUpWithGoogle } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ============================================
// Validation Schema
// ============================================

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      error: "You must accept the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================
// Toast Component
// ============================================

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-fade-in-up p-4 rounded-[var(--radius-card)] shadow-sm border backdrop-blur-xl flex items-start gap-3 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
            toast.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
              : "bg-red-50/90 border-red-200 text-red-700"
          }`}
          onClick={() => onDismiss(toast.id)}
        >
          <div className={`w-5 h-5 shrink-0 mt-0.5 ${toast.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
            {toast.type === "success" ? (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Password Strength Indicator
// ============================================

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Lowercase", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
  ];

  const metCount = checks.filter((c) => c.met).length;

  if (!password) return null;

  return (
    <div className="mt-2 animate-fade-in-up">
      {/* Strength bar */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              metCount >= level
                ? metCount <= 1
                  ? "bg-red-400"
                  : metCount <= 2
                    ? "bg-orange-400"
                    : metCount <= 3
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                : "bg-[#F0D0D8]"
            }`}
          />
        ))}
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <div
              className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                check.met
                  ? "bg-emerald-400 scale-100"
                  : "bg-[#F0D0D8] scale-90"
              }`}
            >
              {check.met && (
                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              className={`text-xs transition-colors duration-300 ${
                check.met ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Register Form Component
// ============================================

export function RegisterForm() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: undefined,
    },
  });

  const passwordValue = watch("password", "");
  const isLoading = isSubmitting || isGooglePending;

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  async function onSubmit(data: RegisterFormData) {
    const result = await signUpWithEmail({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      addToast(result.error, "error");
      return;
    }

    const successMessage = result?.message || "Account created successfully! Redirecting to login...";
    addToast(successMessage, "success");
    setTimeout(() => {
      router.push("/login");
    }, 2500);
  }

  async function handleGoogleSignUp() {
    setIsGooglePending(true);
    try {
      const result = await signUpWithGoogle();
      if (result?.error) {
        addToast(result.error, "error");
        setIsGooglePending(false);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setIsGooglePending(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="animate-scale-in">
        {/* Logo & Tagline */}
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
            Fitcheck
            <span className="bg-gradient-to-r from-[#D86A84] to-[#E88CA0] bg-clip-text text-transparent">
              {" "}AI
            </span>
          </h1>
          <p className="text-sm text-[#8C6B78] dark:text-zinc-400 mt-1 tracking-wide">
            AI Personal Fashion Assistant
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[var(--radius-card)] shadow-xl shadow-[#F7A8B8]/10 border border-[#F7A8B8]/20 dark:border-zinc-800 p-8">
          <h2 className="text-xl font-semibold text-foreground font-[family-name:var(--font-poppins)] mb-1">
            Create your account
          </h2>
          <p className="text-sm text-[#8C6B78] dark:text-zinc-400 mb-6">
            Start your personalized style journey today
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium text-[#4A2030] dark:text-zinc-300">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#D86A84] transition-colors">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  disabled={isLoading}
                  placeholder="Jane Doe"
                  {...register("fullName")}
                  className={`w-full pl-12 pr-4 py-3 rounded-[var(--radius-button)] bg-background border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-zinc-950 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.fullName ? "border-red-300 focus:ring-red-200" : "border-border"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1 animate-fade-in-up">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#4A2030] dark:text-zinc-300">
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
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full pl-12 pr-4 py-3 rounded-[var(--radius-button)] bg-background border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-zinc-950 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email ? "border-red-300 focus:ring-red-200" : "border-border"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 animate-fade-in-up">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#4A2030] dark:text-zinc-300">
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
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-12 pr-4 py-3 rounded-[var(--radius-button)] bg-background border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-zinc-950 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password ? "border-red-300 focus:ring-red-200" : "border-border"
                  }`}
                />
              </div>
              <PasswordStrength password={passwordValue} />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 animate-fade-in-up">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#4A2030] dark:text-zinc-300">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#D86A84] transition-colors">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full pl-12 pr-4 py-3 rounded-[var(--radius-button)] bg-background border text-foreground placeholder:text-muted-foreground text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-zinc-950 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.confirmPassword ? "border-red-300 focus:ring-red-200" : "border-border"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 animate-fade-in-up">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="pt-1">
              <label htmlFor="terms" className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register("terms")}
                    className="peer sr-only"
                  />
                  <div className="w-4.5 h-4.5 rounded-md border border-border bg-background peer-checked:bg-gradient-to-br peer-checked:from-[#F7A8B8] peer-checked:to-[#D86A84] peer-checked:border-transparent transition-all duration-300 group-hover:border-primary" />
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
                <span className="text-sm text-[#6B3A4A] dark:text-zinc-300 select-none leading-snug">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-[#D86A84] hover:text-[#C4506C] font-medium transition-colors duration-300 hover:underline underline-offset-2"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-[#D86A84] hover:text-[#C4506C] font-medium transition-colors duration-300 hover:underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1.5 ml-7.5 animate-fade-in-up">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-[var(--radius-button)] text-white font-semibold text-sm bg-gradient-to-r from-[#E88CA0] via-[#D86A84] to-[#C4506C] shadow-sm shadow-[#D86A84]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#D86A84]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm relative overflow-hidden group mt-2"
            >
              <span className={`flex items-center justify-center gap-2 ${isSubmitting ? "opacity-0" : ""}`}>
                Create Account
              </span>
              {isSubmitting && (
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
              <span className="px-3 bg-white/80 dark:bg-zinc-900/80 text-[#8C6B78] dark:text-zinc-400 tracking-wider uppercase">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            type="button"
            className="w-full py-3 px-4 rounded-[var(--radius-button)] bg-white dark:bg-zinc-800 border border-border text-foreground font-medium text-sm transition-all duration-300 hover:border-primary hover:shadow-sm hover:shadow-[#F7A8B8]/10 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden"
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

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-[#8C6B78] dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#D86A84] hover:text-[#C4506C] font-semibold transition-colors duration-300 hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}



