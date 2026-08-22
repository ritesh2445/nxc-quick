import React from "react";
import { getAdminOverview } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";
import { Users, CreditCard, ShoppingBag, Activity, ShieldCheck, Database, Radio } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminOverview();
  const { metrics, recentUsers, recentCards, recentOrders } = data;

  const adminStats = [
    {
      title: "Registered Identities",
      value: metrics.totalUsers.toString(),
      icon: Users,
      meta: "100% Sovereign accounts",
    },
    {
      title: "Commissioned Cards",
      value: metrics.totalCards.toString(),
      icon: CreditCard,
      meta: "NFC + Laser QR active",
    },
    {
      title: "Completed Orders",
      value: metrics.totalOrders.toString(),
      icon: ShoppingBag,
      meta: "Razorpay & Stripe synced",
    },
    {
      title: "Telemetry Ingestion",
      value: metrics.totalEvents.toString(),
      icon: Activity,
      meta: "Non-blocking edge events",
    },
  ];

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A32]">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            SYSTEM CONTROL · FLEET TELEMETRY
          </span>
          <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
            Executive Terminal
          </h1>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Fleet monitoring across Cloudflare Edge, D1 database storage, and NFC hardware fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#6FCF97] bg-[#1A2E24] px-3 py-1.5 rounded-[2px] border border-[#26533D]">
          <ShieldCheck className="w-4 h-4" /> EDGE NODES HEALTHY
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">{stat.title}</span>
                <Icon className="w-4 h-4 text-accent-silver" />
              </div>
              <p className="font-sans font-semibold text-3xl text-[#F2F0EC]">{stat.value}</p>
              <p className="font-sans text-[11px] text-text-secondary">{stat.meta}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders and Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Hardware Orders */}
        <div className="lg:col-span-6 bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A32] pb-3">
            <h3 className="font-sans font-semibold text-sm text-text-primary uppercase tracking-wider">
              Recent Hardware Commissions
            </h3>
            <Link href="/admin/orders" className="font-mono text-[10px] text-text-tertiary hover:text-text-primary uppercase">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="p-3 rounded-[2px] bg-[#18181C] border border-[#2A2A32] flex items-center justify-between text-xs font-sans">
                <div>
                  <p className="font-mono text-accent-silver font-medium">{ord.orderNumber}</p>
                  <p className="text-text-secondary mt-0.5">{ord.engravingName} · {ord.tier} {ord.finish}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-[#6FCF97] uppercase px-2 py-0.5 rounded-[2px] bg-[#1A2E24] border border-[#26533D]">
                    {ord.status}
                  </span>
                  <p className="font-mono text-[10px] text-text-tertiary mt-1">{formatDate(ord.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned NFC Chips */}
        <div className="lg:col-span-6 bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A32] pb-3">
            <h3 className="font-sans font-semibold text-sm text-text-primary uppercase tracking-wider">
              Recent NFC Chip Deployments
            </h3>
            <Link href="/admin/cards" className="font-mono text-[10px] text-text-tertiary hover:text-text-primary uppercase">
              Manage UIDs
            </Link>
          </div>

          <div className="space-y-3">
            {recentCards.map((c) => (
              <div key={c.id} className="p-3 rounded-[2px] bg-[#18181C] border border-[#2A2A32] flex items-center justify-between text-xs font-sans">
                <div>
                  <p className="font-mono text-accent-silver font-medium">{c.nfcUid || "UNASSIGNED CHIP"}</p>
                  <p className="text-text-secondary mt-0.5">Route: /{c.qrSlug} · {c.finish}</p>
                </div>
                <span className="font-mono text-[10px] text-accent-silver uppercase px-2 py-0.5 rounded-[2px] bg-[#111114] border border-[#2A2A32]">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
