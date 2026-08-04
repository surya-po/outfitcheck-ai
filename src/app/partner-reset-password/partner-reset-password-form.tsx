"use client";

import { useState, useTransition } from "react";
import { updatePartnerPassword } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { Store, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="min-h-screen bg-muted flex items-center justify-center p-4 sm:p-8">
      {/* Background decorations for a premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(242,107,138,0.1),rgba(255,255,255,0))]" />
      </div>

      <div className="relative w-full max-w-[440px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-card)] shadow-sm shadow-[#F7A8B8]/30 mx-auto mb-4 animate-float overflow-hidden bg-background">
            <Image 
              src="/logo.jpeg" 
              alt="Fitcheck Logo" 
              width={64} 
              height={64} 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Set Password Baru</h1>
          <p className="text-muted-foreground text-sm mt-1">Buat password baru untuk akun Anda</p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border/60 rounded-[var(--radius-card)] shadow-lg p-6 sm:p-8">
          {/* Alert Message */}
          {message && (
            <div className={`flex items-start gap-3 border rounded-[var(--radius-button)] p-4 text-sm mb-6 animate-in fade-in-50 duration-200 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 border-destructive/20 text-destructive"
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
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 pr-12"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 pr-12"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending || !password || !confirmPassword}
                className="w-full h-12 text-base font-semibold shadow-sm mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Password Baru"
                )}
              </Button>
            </form>
          ) : (
            <div className="mt-4">
              <Link href="/partner-login" className="block w-full">
                <Button className="w-full h-12 text-base font-semibold shadow-sm">
                  Lanjutkan ke Login
                </Button>
              </Link>
            </div>
          )}

          {/* Footer Link */}
          {message?.type !== "success" && (
            <div className="flex justify-center text-center mt-6">
              <Link
                href="/partner-login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Batal
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; {new Date().getFullYear()} Fitcheck AI. Seluruh hak dilindungi.
        </p>
      </div>
    </div>
  );
}


