import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — OutfitCheck AI",
  description: "Reset your OutfitCheck AI password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
