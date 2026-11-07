"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import AIAssistant from "@/components/layout/ai-assistant";
import { useSidebarStore } from "@/stores/sidebar-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const { isCollapsed, isAIOpen } = useSidebarStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Allow rendering even if not authenticated for demo purposes
  // In production, uncomment the redirect
  // useEffect(() => {
  //   if (!isAuthenticated) router.push("/login");
  // }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen bg-[#F9F7F4] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* AI Assistant Panel */}
      {isAIOpen && <AIAssistant />}
    </div>
  );
}
