"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FooterContent } from "./FooterContent";

export function Footer() {
  const pathname = usePathname();

  // Don't render footer on console/dashboard/login or public profile routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/@") ||
    (pathname !== "/" && pathname !== "/order" && !pathname.startsWith("/api"))
  ) {
    return null;
  }

  return <FooterContent />;
}
