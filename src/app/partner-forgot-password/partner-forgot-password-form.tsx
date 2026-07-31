"use client";

import { useState, useTransition } from "react";
import { resetPasswordForPartnerEmail } from "./actions";
import Link from "next/link";
import { Store, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="min-h-screen bg-muted flex items-center justify-center p-4 sm:p-8">
      {/* Background decorations for a premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(242,107,138,0.1),rgba(255,255,255,0))]" />
      </div>

      <div className="relative w-full max-w-[440px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-card border border-border rounded-[var(--radius-card)] shadow-sm mx-auto mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Lupa Password</h1>
          <p className="text-muted-foreground text-sm mt-1">Masukkan email partner Anda</p>
        </div>

        {/* Forgot Password Card */}
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@butikanda.com"
                className="h-12"
                disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending || !email}
              className="w-full h-12 text-base font-semibold shadow-sm mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim Tautan...
                </>
              ) : (
                "Kirim Tautan Reset"
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="flex justify-center text-center mt-6">
            <Link
              href="/partner-login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              ← Kembali ke Login Partner
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; {new Date().getFullYear()} Fitcheck AI. Seluruh hak dilindungi.
        </p>
      </div>
    </div>
  );
}


