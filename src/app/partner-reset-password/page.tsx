import type { Metadata } from "next";
import { PartnerResetPasswordForm } from "./partner-reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password Partner — OutfitCheck AI",
  description: "Set password baru untuk akun partner OutfitCheck AI Anda.",
};

export default function PartnerResetPasswordPage() {
  return <PartnerResetPasswordForm />;
}


