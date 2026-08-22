import React from "react";
import { getUserDashboardData } from "@/lib/db/queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Package, Check, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const data = await getUserDashboardData("usr_ritesh");
  const orders = data?.orders || [];

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A32]">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            COMMISSIONS & INVOICES
          </span>
          <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
            Hardware Orders
          </h1>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Track manufacturing progress, precision laser engraving queue, and receipts.
          </p>
        </div>

        <Link href="/customize">
          <Button variant="primary" size="sm" className="text-xs">
            Commission New Card
          </Button>
        </Link>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#2A2A32] text-text-tertiary font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Order Number</th>
                <th className="pb-3">Hardware Edition</th>
                <th className="pb-3">Engraving Line</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Commission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A32]/40">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#18181C]/50 transition-colors">
                  <td className="py-4 font-mono text-accent-silver font-medium">
                    {ord.orderNumber}
                  </td>
                  <td className="py-4 capitalize text-text-primary">
                    {ord.tier} · {ord.finish}
                  </td>
                  <td className="py-4 font-mono text-text-secondary">
                    {ord.engravingName}
                  </td>
                  <td className="py-4 font-semibold text-text-primary">
                    {formatCurrency(ord.amount, ord.currency as "INR" | "USD")}
                  </td>
                  <td className="py-4">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] bg-[#1A2E24] text-[#6FCF97] border border-[#26533D]">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono text-text-tertiary">
                    {formatDate(ord.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
