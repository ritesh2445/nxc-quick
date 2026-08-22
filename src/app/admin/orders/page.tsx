"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingBag, Package, Check, Truck, Clock } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "ord_1",
      orderNumber: "NXC-260821-1001",
      engravingName: "Ritesh Martawar",
      tier: "Atelier Bespoke",
      finish: "Obsidian Black",
      amount: 2999,
      currency: "INR",
      status: "delivered",
      gateway: "Razorpay",
      date: new Date(),
    },
    {
      id: "ord_2",
      orderNumber: "NXC-260821-1002",
      engravingName: "Aarav Mehta",
      tier: "Verse Metal",
      finish: "Obsidian Black",
      amount: 1599,
      currency: "INR",
      status: "delivered",
      gateway: "Razorpay",
      date: new Date(),
    },
    {
      id: "ord_3",
      orderNumber: "NXC-260821-1003",
      engravingName: "Julian Vance",
      tier: "Verse Metal",
      finish: "Brushed Titanium",
      amount: 20,
      currency: "USD",
      status: "shipped",
      gateway: "Stripe",
      date: new Date(),
    },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A32]">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            MANUFACTURING PIPELINE
          </span>
          <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
            Orders & Laser Engraving Queue
          </h1>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Manage precision laser engraving queue, NFC encryption pairing, and global courier dispatch.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#2A2A32] text-text-tertiary font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Order Number</th>
                <th className="pb-3">Laser Engraving Line</th>
                <th className="pb-3">Hardware Edition</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Gateway</th>
                <th className="pb-3">Fulfillment Status</th>
                <th className="pb-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A32]/40">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#18181C]/50 transition-colors">
                  <td className="py-4 font-mono text-accent-silver font-medium">
                    {ord.orderNumber}
                  </td>
                  <td className="py-4 font-mono text-text-primary font-medium">
                    {ord.engravingName}
                  </td>
                  <td className="py-4 text-text-secondary">
                    {ord.tier} · {ord.finish}
                  </td>
                  <td className="py-4 font-semibold text-text-primary">
                    {formatCurrency(ord.amount, ord.currency as "INR" | "USD")}
                  </td>
                  <td className="py-4 font-mono text-text-tertiary uppercase text-[10px]">
                    {ord.gateway}
                  </td>
                  <td className="py-4">
                    <span
                      className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] ${
                        ord.status === "delivered"
                          ? "bg-[#1A2E24] text-[#6FCF97] border border-[#26533D]"
                          : ord.status === "shipped"
                          ? "bg-[#182638] text-accent-titanium border border-[#2A3E5C]"
                          : "bg-[#2A241C] text-accent-champagne border border-[#4A3D2A]"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => updateStatus(ord.id, e.target.value)}
                      className="bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-2 py-1 text-xs text-text-primary focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="engraving">Laser Engraving</option>
                      <option value="shipped">Dispatched / Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
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
