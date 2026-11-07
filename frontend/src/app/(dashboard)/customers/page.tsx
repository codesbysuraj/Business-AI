"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { customersAPI } from "@/lib/api";
import type { Customer } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DEMO_CUSTOMERS: Customer[] = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", total_spending: 45200, purchase_count: 12, avg_order_value: 3766, created_at: "" },
  { id: 2, name: "Priya Patel", email: "priya@example.com", phone: "+91 87654 32109", total_spending: 32150, purchase_count: 8, avg_order_value: 4018, created_at: "" },
  { id: 3, name: "Amit Kumar", email: "amit@example.com", phone: "+91 76543 21098", total_spending: 12500, purchase_count: 3, avg_order_value: 4166, created_at: "" },
  { id: 4, name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 65432 10987", total_spending: 5400, purchase_count: 1, avg_order_value: 5400, created_at: "" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customersAPI.list();
        if (res.data && res.data.length > 0) {
          setCustomers(res.data);
        }
      } catch (e) {
        // Use demo
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827]">Customers</h1>
          <p className="text-[#6B7280] mt-1">Manage your customer relationships and analytics.</p>
        </div>
        <button className="btn-primary !px-6 bg-[#10B981] hover:bg-[#059669]">
          <UserPlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="card-static overflow-hidden">
        <div className="p-4 border-b border-[rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#F9F7F4]/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#10B981]/30 focus:ring-2 focus:ring-[#10B981]/10 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F7F4]/80 border-b border-[rgba(0,0,0,0.06)]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Customer</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Contact</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Total Spent</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Orders</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Avg Value</th>
                <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.04)]">
              {filteredCustomers.map((customer) => {
                const isVIP = customer.total_spending > 20000;
                
                return (
                  <tr key={customer.id} className="hover:bg-[#F9F7F4]/50 transition-colors group cursor-pointer">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 flex items-center justify-center shrink-0 border border-[#10B981]/20">
                          <span className="text-[#10B981] font-bold text-sm">
                            {customer.name.split(" ").map(n => n[0]).join("").substring(0,2)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#111827] group-hover:text-[#10B981] transition-colors">{customer.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {customer.email}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {customer.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-bold text-[#111827]">₹{customer.total_spending.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm text-[#6B7280]">{customer.purchase_count}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm text-[#6B7280]">₹{customer.avg_order_value.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {isVIP ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center gap-1 w-fit mx-auto">
                          <TrendingUp className="w-3.5 h-3.5" /> VIP
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#6B7280]/10 text-[#6B7280] flex items-center justify-center w-fit mx-auto">
                          Regular
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
