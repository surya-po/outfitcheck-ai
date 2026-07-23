import type { Metadata } from "next";
import { PartnerForgotPasswordForm } from "./partner-forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Password Partner — Fitcheck AI",
  description: "Reset password untuk akun partner Fitcheck AI.",
};

export default function PartnerForgotPasswordPage() {
  return <PartnerForgotPasswordForm />;
}


