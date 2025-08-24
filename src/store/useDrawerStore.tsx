import { DrawerType } from "@/types";
import { create } from "zustand";

interface DrawerState {
  isOpen: (drawer: DrawerType) => boolean;
  currentDrawer: DrawerType | null;
  openDrawer: (drawer: DrawerType) => void;
  closeDrawer: () => void;
  toggleDrawer: (drawer: DrawerType) => void;
}

export const useDrawerStore = create<DrawerState>((set, get) => ({
  currentDrawer: null,
  isOpen: (drawer: DrawerType) => get().currentDrawer === drawer,
  openDrawer: (drawer) => set({ currentDrawer: drawer }),
  closeDrawer: () => set({ currentDrawer: null }),
  toggleDrawer: (drawer) =>
    set((state) => ({
      currentDrawer: state.currentDrawer === drawer ? null : drawer,
    })),
}));
