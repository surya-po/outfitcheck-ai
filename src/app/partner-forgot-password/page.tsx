import type { Metadata } from "next";
import { PartnerForgotPasswordForm } from "./partner-forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Password Partner — OutfitCheck AI",
  description: "Reset password untuk akun partner OutfitCheck AI.",
};

export default function PartnerForgotPasswordPage() {
  return <PartnerForgotPasswordForm />;
}
