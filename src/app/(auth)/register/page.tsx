import { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
