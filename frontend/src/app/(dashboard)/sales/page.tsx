"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react";
import { salesAPI } from "@/lib/api";
import type { Sale } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DEMO_SALES: Sale[] = [
  { id: 1042, customer_name: "Rahul Sharma", total_amount: 8499, status: "completed", items: [{ id: 1, product_id: 2, quantity: 1, unit_price: 8499, total: 8499 }], created_at: new Date().toISOString() },
  { id: 1041, customer_name: "Priya Patel", total_amount: 3598, status: "completed", items: [{ id: 2, product_id: 1, quantity: 2, unit_price: 1799, total: 3598 }], created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 1040, customer_name: "Amit Kumar", total_amount: 12999, status: "refunded", items: [{ id: 3, product_id: 4, quantity: 1, unit_price: 12999, total: 12999 }], created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 1039, customer_name: "Walk-in Customer", total_amount: 599, status: "completed", items: [{ id: 4, product_id: 6, quantity: 1, unit_price: 599, total: 599 }], created_at: new Date(Date.now() - 172800000).toISOString() },
];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(DEMO_SALES);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await salesAPI.list();
        if (res.data && res.data.length > 0) {
          setSales(res.data);
        }
      } catch (e) {}
    };
    fetchSales();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-[#10B981]/10 text-[#10B981]';
      case 'pending': return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'refunded': return 'bg-[#EF4444]/10 text-[#EF4444]';
      default: return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827]">Sales Transactions</h1>
          <p className="text-[#6B7280] mt-1">Record new sales and view transaction history.</p>
        </div>
        <button className="btn-primary !px-6 bg-[#8B5CF6] hover:bg-[#7C3AED]">
          <Plus className="w-4 h-4" /> New Sale
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div variants={fadeUp} className="card-static p-6 stat-accent-orange">
          <p className="text-sm text-[#6B7280] mb-1">Total Sales Today</p>
          <p className="text-2xl font-extrabold text-[#111827]">₹45,280</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#10B981]">
            <ArrowUpRight className="w-3 h-3" /> +12.5% from yesterday
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="card-static p-6 stat-accent-blue">
          <p className="text-sm text-[#6B7280] mb-1">Orders Today</p>
          <p className="text-2xl font-extrabold text-[#111827]">24</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#10B981]">
            <ArrowUpRight className="w-3 h-3" /> +3 orders
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="card-static p-6 stat-accent-yellow">
          <p className="text-sm text-[#6B7280] mb-1">Avg Order Value</p>
          <p className="text-2xl font-extrabold text-[#111827]">₹1,886</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#EF4444]">
            <ArrowDownRight className="w-3 h-3" /> -2.4% from yesterday
          </div>
        </motion.div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="card-static overflow-hidden">
        <div className="p-4 border-b border-[rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#F9F7F4]/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl text-sm text-[#111827] outline-none focus:border-[#8B5CF6]/30 focus:ring-2 focus:ring-[#8B5CF6]/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F7F4]/80 border-b border-[rgba(0,0,0,0.06)]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Transaction</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Date</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Customer</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Items</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Total</th>
                <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.04)]">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#F9F7F4]/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-[#111827]">#{sale.id.toString().padStart(5, '0')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(sale.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-[#111827]">{sale.customer_name || "Walk-in"}</td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{sale.items?.length || 0} items</td>
                  <td className="py-4 px-6 text-right font-bold text-[#111827]">₹{sale.total_amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
