import { create } from "zustand";

interface SelectedTaskState {
  selectedTaskId: string | null;
  setSelectedTaskId: (taskId: string | null) => void;
  clearSelectedTask: () => void;
}

export const useSelectedTaskStore = create<SelectedTaskState>((set) => ({
  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
  clearSelectedTask: () => set({ selectedTaskId: null }),
}));
