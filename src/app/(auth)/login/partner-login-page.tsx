"use client";

import { useState, useTransition, useEffect } from "react";
import { signInAsPartner } from "@/app/(partner)/partner/login/actions";
import Link from "next/link";
import { Store, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function PartnerLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("outfitcheck_partner_remembered_email");
    if (savedEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const submittedEmail = formData.get("email") as string;
    if (remember) {
      localStorage.setItem("outfitcheck_partner_remembered_email", submittedEmail);
    } else {
      localStorage.removeItem("outfitcheck_partner_remembered_email");
    }
    startTransition(async () => {
      const result = await signInAsPartner(formData);
      if (result?.error) {
        setError(result.error);
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 border border-pink-400/30 rounded-2xl mx-auto mb-2">
              <Store className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Partner Portal</h1>
              <p className="text-gray-400 text-sm mt-1">Masuk ke dasbor butik Anda</p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-pink-500/10 border border-pink-400/20 text-pink-300 text-xs px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
              OutfitCheck AI — Partner Program
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 text-sm animate-in fade-in-50 duration-200">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} className="space-y-5">
            <input type="hidden" name="remember" value={remember ? "true" : "false"} />

            <div className="space-y-1.5">
              <label htmlFor="partner-email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="partner-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@butikanda.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="partner-password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="partner-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all pr-12"
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

            <div className="flex items-center gap-2">
              <input
                id="partner-remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500/50"
              />
              <label htmlFor="partner-remember" className="text-sm text-gray-400">
                Ingat email saya
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk ke Partner Portal"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-transparent px-3 text-gray-500">bukan admin butik?</span>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
            >
              ← Kembali ke Login Pengguna
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          &copy; 2025 OutfitCheck AI. Seluruh hak dilindungi.
        </p>
      </div>
    </div>
  );
}
