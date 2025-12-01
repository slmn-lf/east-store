import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Eaststore",
  description: "Sign in to your Eaststore account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
