import React from "react";
import { getUserDashboardData } from "@/lib/db/queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Package, Check, Download, ExternalLink, Sparkles, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const data = await getUserDashboardData("usr_ritesh");
  const orders = data?.orders || [];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> COMMISSIONS & INVOICES
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Hardware Orders
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
            Track manufacturing progress, precision laser engraving queue, and receipts.
          </p>
        </div>

        <Link href="/order" className="w-full sm:w-auto btn-interactive">
          <Button variant="primary" size="sm" className="w-full sm:w-auto text-xs tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
            COMMISSION NEW CARD
          </Button>
        </Link>
      </div>

      {/* Orders Container */}
      <div className="bg-[#060608]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-6 space-y-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-cinzel font-medium text-sm sm:text-base text-white tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-[#00A2FF]" />
            Order Ledger
          </h3>
          <span className="font-mono text-[10px] text-[#8E8E98] uppercase">
            {orders.length} {orders.length === 1 ? "RECORD" : "RECORDS"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 space-y-4 px-4">
            <Package className="w-10 h-10 text-[#42424E] mx-auto stroke-[1.2]" />
            <div className="space-y-1">
              <h4 className="font-sans font-medium text-base text-white">No hardware commissions found</h4>
              <p className="font-sans text-xs text-[#8E8E98] max-w-sm mx-auto">
                Commission your bespoke aerospace metal card with permanent NFC chip and laser engraved QR matrix.
              </p>
            </div>
            <Link href="/order">
              <Button variant="primary" size="sm" className="text-xs rounded-full">
                Order a Card
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Order Cards (< md screens) */}
            <div className="md:hidden divide-y divide-white/[0.05]">
              {orders.map((ord: any) => (
                <div key={ord.id} className="py-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#80D0FF] font-semibold">
                      {ord.orderNumber}
                    </span>
                    <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30">
                      {ord.paymentStatus || ord.orderStatus || "paid"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium capitalize">
                      {ord.tier} Edition · {ord.finish.replace("_", " ")}
                    </span>
                    <span className="font-mono text-white font-bold">
                      {formatCurrency(ord.amount, ord.currency as "INR" | "USD")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8E8E98] pt-1">
                    <span className="font-mono truncate max-w-[180px]">
                      Engraving: "{ord.engravingName}"
                    </span>
                    <span className="font-mono text-[#70707C]">
                      {formatDate(ord.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8E8E98] font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-3 px-2">Order Number</th>
                    <th className="pb-3 px-2">Hardware Edition</th>
                    <th className="pb-3 px-2">Engraving Line</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Commission Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {orders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-2 font-mono text-[#80D0FF] font-medium">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-2 capitalize text-white">
                        {ord.tier} · {ord.finish.replace("_", " ")}
                      </td>
                      <td className="py-4 px-2 font-mono text-[#C8C6C0]">
                        {ord.engravingName}
                      </td>
                      <td className="py-4 px-2 font-semibold text-white font-mono">
                        {formatCurrency(ord.amount, ord.currency as "INR" | "USD")}
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30">
                          {ord.paymentStatus || ord.orderStatus || "paid"}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right font-mono text-[11px] text-[#70707C]">
                        {formatDate(ord.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
