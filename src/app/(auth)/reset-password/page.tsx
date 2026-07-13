import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password — OutfitCheck AI",
  description: "Create a new password for your OutfitCheck AI account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
