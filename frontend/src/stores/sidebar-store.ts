import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  isAIOpen: boolean;
  toggle: () => void;
  toggleAI: () => void;
  setAIOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isAIOpen: false,
  toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  toggleAI: () => set((s) => ({ isAIOpen: !s.isAIOpen })),
  setAIOpen: (open) => set({ isAIOpen: open }),
}));
