import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password — OutfitCheck AI",
  description: "Reset your OutfitCheck AI password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="animate-scale-in text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F7A8B8] via-[#E88CA0] to-[#D86A84] shadow-lg shadow-[#F7A8B8]/30 mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C14.5 2 13.2 2.8 12.5 4L8 11.5C7.3 12.7 7.3 14.3 8 15.5L12.5 23C13.2 24.2 14.5 25 16 25C17.5 25 18.8 24.2 19.5 23L24 15.5C24.7 14.3 24.7 12.7 24 11.5L19.5 4C18.8 2.8 17.5 2 16 2Z" fill="white" fillOpacity="0.9"/>
          <circle cx="16" cy="13.5" r="3" fill="#D86A84"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[#2D1F24] font-[family-name:var(--font-poppins)]">
        Reset Password
      </h1>
      <p className="text-sm text-[#8C6B78] mt-1 mb-6">Coming soon in Phase 2</p>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#F7A8B8]/10 border border-[#F7A8B8]/20 p-8">
        <p className="text-[#6B3A4A] mb-4">Password reset form will be implemented here.</p>
        <Link
          href="/login"
          className="text-[#D86A84] hover:text-[#C4506C] font-semibold text-sm transition-colors hover:underline underline-offset-2"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
