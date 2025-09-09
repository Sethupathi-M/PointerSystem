import { create } from "zustand";

interface SelectedRewardState {
  selectedRewardId: string | null;
  setSelectedRewardId: (rewardId: string) => void;
  clearSelectedReward: () => void;
}

export const useSelectedRewardStore = create<SelectedRewardState>((set) => ({
  selectedRewardId: null,
  setSelectedRewardId: (rewardId) => set({ selectedRewardId: rewardId }),
  clearSelectedReward: () => set({ selectedRewardId: null }),
}));
