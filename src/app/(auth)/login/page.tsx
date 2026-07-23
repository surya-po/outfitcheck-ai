import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In — Fitcheck AI",
  description: "Sign in to Fitcheck AI, your AI personal fashion assistant.",
};

export default function LoginPage() {
  return <LoginForm />;
}



