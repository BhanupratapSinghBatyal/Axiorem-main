"use client";

import SessionHydrator from "@/providers/SessionHydrator";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionHydrator>{children}</SessionHydrator>;
}