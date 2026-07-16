import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account — OutfitCheck AI",
  description:
    "Create your OutfitCheck AI account and start your personalized style journey with AI-powered fashion analysis.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}



