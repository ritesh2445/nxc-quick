"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060609] text-white flex flex-col md:flex-row antialiased select-none selection:bg-amber-500/30 selection:text-amber-200">
      {/* Executive Dark Luxury Sidebar */}
      <AdminSidebar pendingOrdersCount={2} unassignedCardsCount={2} />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-h-screen flex flex-col overflow-x-hidden w-full">
        {children}
      </main>
    </div>
  );
}
