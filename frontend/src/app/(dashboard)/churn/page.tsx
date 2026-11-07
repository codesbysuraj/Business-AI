"use client";

import { motion } from "framer-motion";
import { UserX, AlertCircle, Phone, Mail, ShieldAlert, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CHURN_DATA = [
  { id: 1, name: "Sneha Reddy", email: "sneha@example.com", risk: 85, days_since_last: 45, spend_drop: "40%", reasons: ["Decreased order frequency", "Support ticket unresolved"], action: "Call immediately" },
  { id: 2, name: "Amit Kumar", email: "amit@example.com", risk: 72, days_since_last: 30, spend_drop: "25%", reasons: ["Hasn't logged in for 3 weeks"], action: "Send retention offer" },
  { id: 3, name: "Pooja Shah", email: "pooja@example.com", risk: 68, days_since_last: 28, spend_drop: "15%", reasons: ["Skipped usual reorder cycle"], action: "Send automated email" },
];

export default function ChurnPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#EF4444]/10 to-[#F59E0B]/10 rounded-full mb-3">
          <Zap className="w-3.5 h-3.5 text-[#EF4444]" />
          <span className="text-xs font-bold text-[#111827]">AI Module</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111827]">Churn Risk Analysis</h1>
        <p className="text-[#6B7280] mt-1">Machine learning identifies customers who might stop buying from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card-static p-6 bg-gradient-to-br from-[#EF4444] to-[#B91C1C] text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <UserX className="w-5 h-5 text-white" />
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">High Risk Customers</p>
          <p className="text-4xl font-extrabold mb-2">3</p>
          <p className="text-xs text-white/70">Require immediate attention</p>
        </motion.div>
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="card-static p-6 stat-accent-yellow">
          <div className="w-10 h-10 rounded-xl bg-[#F9F7F4] flex items-center justify-center mb-4">
            <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <p className="text-sm text-[#6B7280] font-medium mb-1">Revenue at Risk</p>
          <p className="text-3xl font-extrabold text-[#111827] mb-2">₹42,500</p>
          <p className="text-xs text-[#6B7280]">Based on their average LTV</p>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="card-static overflow-hidden">
        <div className="p-5 border-b border-[rgba(0,0,0,0.06)] bg-[#F9F7F4]/50">
          <h3 className="font-bold text-[#111827]">At-Risk Customers</h3>
        </div>
        <div className="divide-y divide-[rgba(0,0,0,0.04)]">
          {CHURN_DATA.map((customer) => (
            <div key={customer.id} className="p-6 hover:bg-[#F9F7F4]/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${
                    customer.risk > 80 ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                  }`}>
                    <span className="font-bold">{customer.risk}%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#111827]">{customer.name}</h4>
                    <p className="text-sm text-[#6B7280]">{customer.email}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F3F4F6] text-[#6B7280]">
                        {customer.days_since_last} days since last order
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F3F4F6] text-[#6B7280]">
                        Spend dropped by {customer.spend_drop}
                      </span>
                    </div>

                    <div className="mt-4 p-3 bg-white border border-[#F3F4F6] rounded-xl shadow-sm">
                      <p className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">AI Risk Factors</p>
                      <ul className="space-y-1.5">
                        {customer.reasons.map((r, i) => (
                          <li key={i} className="text-sm text-[#6B7280] flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 md:w-48">
                  <p className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">Recommended Action</p>
                  <p className="text-sm font-medium text-[#FF6A3D] mb-3">{customer.action}</p>
                  <button className="btn-secondary w-full justify-center !py-2 text-sm bg-white hover:bg-gray-50">
                    <Mail className="w-4 h-4 mr-2" /> Email Offer
                  </button>
                  <button className="btn-secondary w-full justify-center !py-2 text-sm bg-white hover:bg-gray-50">
                    <Phone className="w-4 h-4 mr-2" /> Call Customer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
