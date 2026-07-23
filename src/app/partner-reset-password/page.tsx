import type { Metadata } from "next";
import { PartnerResetPasswordForm } from "./partner-reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password Partner — Fitcheck AI",
  description: "Set password baru untuk akun partner Fitcheck AI Anda.",
};

export default function PartnerResetPasswordPage() {
  return <PartnerResetPasswordForm />;
}


