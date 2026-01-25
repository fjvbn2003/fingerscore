"use client";

import { SystemGuard } from "@/components/admin/system-guard";

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SystemGuard>{children}</SystemGuard>;
}
