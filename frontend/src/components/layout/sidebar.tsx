"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  ShoppingCart,
  TrendingUp,
  FileText,
  UserX,
  BarChart3,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar-store";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/inventory", icon: Warehouse, label: "Inventory" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/sales", icon: ShoppingCart, label: "Sales" },
  { href: "/forecasting", icon: TrendingUp, label: "Forecasting" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/churn", icon: UserX, label: "Churn Risk" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-[rgba(0,0,0,0.06)] flex flex-col z-40 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-5 flex items-center justify-between border-b border-[rgba(0,0,0,0.06)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-[#111827] whitespace-nowrap"
            >
              BusinessOS
            </motion.span>
          )}
        </Link>
        <button
          onClick={toggle}
          className="w-7 h-7 rounded-lg bg-[#F9F7F4] flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#FF6A3D]/10 text-[#FF6A3D]"
                  : "text-[#6B7280] hover:bg-[#F9F7F4] hover:text-[#111827]"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#FF6A3D]" : ""}`} />
              {!isCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6A3D]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[rgba(0,0,0,0.06)]">
          <div className="p-4 bg-gradient-to-br from-[#FF6A3D]/10 to-[#FF8F6B]/5 rounded-2xl">
            <p className="text-xs font-semibold text-[#FF6A3D] mb-1">AI Assistant</p>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Ask anything about your business data
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
