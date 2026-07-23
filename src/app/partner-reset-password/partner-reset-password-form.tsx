"use client";

import { useState, useTransition } from "react";
import { updatePartnerPassword } from "./actions";
import Link from "next/link";
import { Store, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";

export function PartnerResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    startTransition(async () => {
      const result = await updatePartnerPassword(password);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ 
          type: "success", 
          text: "Password berhasil diperbarui! Anda dapat masuk sekarang." 
        });
        setPassword("");
        setConfirmPassword("");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[var(--radius-card)] shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 border border-pink-400/30 rounded-[var(--radius-card)] mx-auto mb-2">
              <Store className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Set Password Baru</h1>
              <p className="text-gray-400 text-sm mt-1">Buat password baru untuk akun Anda</p>
            </div>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`flex items-start gap-3 border rounded-[var(--radius-button)] p-4 text-sm animate-in fade-in-50 duration-200 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}>
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          {message?.type !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[var(--radius-button)] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all pr-12"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[var(--radius-button)] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all pr-12"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || !password || !confirmPassword}
                className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-[var(--radius-button)] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-pink-500/20"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Password Baru</span>
                )}
              </button>
            </form>
          ) : (
            <Link
              href="/partner-login"
              className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-[var(--radius-button)] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-pink-500/20"
            >
              Lanjutkan ke Login
            </Link>
          )}

          {/* Footer Link */}
          {message?.type !== "success" && (
            <div className="flex justify-center text-center">
              <Link
                href="/partner-login"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors underline underline-offset-4"
              >
                Batal
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          &copy; 2025 Fitcheck AI. Seluruh hak dilindungi.
        </p>
      </div>
    </div>
  );
}


