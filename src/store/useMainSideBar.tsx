// with zustand create a store to manage the main side bar
import { create } from "zustand";

interface IMainSideBar {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useMainSideBar = create<IMainSideBar>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
