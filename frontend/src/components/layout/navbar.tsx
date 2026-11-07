"use client";

import { Search, Bell, Bot, ChevronDown, User } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAuthStore } from "@/stores/auth-store";

export default function Navbar() {
  const { toggleAI, isAIOpen } = useSidebarStore();
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] px-6 flex items-center justify-between shrink-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search products, customers, sales..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F9F7F4] border border-[rgba(0,0,0,0.06)] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF6A3D]/30 focus:ring-2 focus:ring-[#FF6A3D]/10 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* AI Assistant Toggle */}
        <button
          onClick={toggleAI}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
            isAIOpen
              ? "bg-[#FF6A3D] text-white shadow-md shadow-[#FF6A3D]/20"
              : "bg-[#FF6A3D]/10 text-[#FF6A3D] hover:bg-[#FF6A3D]/20"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="text-sm font-semibold hidden md:inline">AI Assistant</span>
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl bg-[#F9F7F4] flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-[#6B7280]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6A3D] rounded-full" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-[#F9F7F4] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-[#111827] leading-tight">{user?.name || "Admin"}</p>
            <p className="text-[11px] text-[#6B7280]">Owner</p>
          </div>
          <ChevronDown className="w-4 h-4 text-[#9CA3AF] hidden md:block" />
        </button>
      </div>
    </header>
  );
}
