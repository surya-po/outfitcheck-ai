import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account — Fitcheck AI",
  description:
    "Create your Fitcheck AI account and start your personalized style journey with AI-powered fashion analysis.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}



