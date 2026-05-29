import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  taskModalOpen: boolean;
  editingTaskId: string | null;
  activeWorkspaceId: string | null;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  openTaskModal: (taskId?: string) => void;
  closeTaskModal: () => void;
  setActiveWorkspace: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  taskModalOpen: false,
  editingTaskId: null,
  activeWorkspaceId: null,

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openTaskModal: (taskId) => set({ taskModalOpen: true, editingTaskId: taskId ?? null }),
  closeTaskModal: () => set({ taskModalOpen: false, editingTaskId: null }),
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
}));
