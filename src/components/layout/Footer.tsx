"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FooterContent } from "./FooterContent";

export function Footer() {
  const pathname = usePathname();

  const isLegalRoute =
    pathname.startsWith("/legal") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/refund") ||
    pathname.startsWith("/shipping");

  // Don't render footer on console/dashboard/login or public profile routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/@") ||
    (!isLegalRoute && pathname !== "/" && pathname !== "/order" && !pathname.startsWith("/api"))
  ) {
    return null;
  }

  return <FooterContent />;
}
