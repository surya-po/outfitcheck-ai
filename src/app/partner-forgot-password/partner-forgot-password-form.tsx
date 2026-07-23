"use client";

import { useState, useTransition } from "react";
import { resetPasswordForPartnerEmail } from "./actions";
import Link from "next/link";
import { Store, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export function PartnerForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await resetPasswordForPartnerEmail(email);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ 
          type: "success", 
          text: "Jika akun terdaftar, tautan reset password telah dikirim ke email tersebut." 
        });
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
              <h1 className="text-2xl font-bold text-white tracking-tight">Lupa Password</h1>
              <p className="text-gray-400 text-sm mt-1">Masukkan email partner Anda</p>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@butikanda.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[var(--radius-button)] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all"
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !email}
              className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-[var(--radius-button)] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-pink-500/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirim Tautan...</span>
                </>
              ) : (
                <span>Kirim Tautan Reset</span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="flex justify-center text-center">
            <Link
              href="/partner-login"
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors underline underline-offset-4"
            >
              ← Kembali ke Login Partner
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          &copy; 2025 Fitcheck AI. Seluruh hak dilindungi.
        </p>
      </div>
    </div>
  );
}


