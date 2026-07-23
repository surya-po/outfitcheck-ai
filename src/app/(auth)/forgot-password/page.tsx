import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — Fitcheck AI",
  description: "Reset your Fitcheck AI password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}



