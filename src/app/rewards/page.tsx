"use client";

import { RewardCard } from "@/components/RewardCard/RewardCard";
import RewardDetailsDrawer from "@/components/Drawers/RewardDetailsDrawer";
import { useDrawerStore } from "@/store/useDrawerStore";
import { useSelectedRewardStore } from "@/store/useSelectedRewardStore";
import { DrawerType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { rewardApi } from "@/lib/api/rewardApi";
// import type { Reward } from "@/generated/prisma";
import { useState } from "react";
import { Plus } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function Rewards() {
  const [filter, setFilter] = useState<"all" | "available" | "redeemed">("all");
  const { isOpen, openDrawer, toggleDrawer } = useDrawerStore();
  const { clearSelectedReward } = useSelectedRewardStore();

  // Fetch rewards based on filter
  const {
    data: rewards = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reward", filter],
    queryFn: () => {
      switch (filter) {
        case "available":
          return rewardApi.getAvailable();
        case "redeemed":
          return rewardApi.getRedeemed();
        default:
          return rewardApi.getAll();
      }
    },
  });

  const handleCreateReward = () => {
    clearSelectedReward();
    openDrawer(DrawerType.REWARD_DETAILS);
  };

  if (error) {
    return (
      <div className="h-full mt-4 px-5 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-lg font-semibold">Error loading rewards</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full mt-4 relative flex flex-col px-5`}>
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Rewards</h1>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "available" | "redeemed")
            }
            className="px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Rewards</option>
            <option value="available">Available</option>
            <option value="redeemed">Redeemed</option>
          </select>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : rewards && rewards.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-lg font-semibold mb-2">No rewards found</h3>
            <p className="text-sm text-center">
              {filter === "all"
                ? "Create your first reward to get started!"
                : `No ${filter} rewards at the moment.`}
            </p>
          </div>
        )}
      </div>

      {/* Add Reward Button */}
      <button
        onClick={handleCreateReward}
        className="fixed bottom-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full shadow-lg transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        Add Reward
      </button>

      {/* Reward Details Drawer */}
      <RewardDetailsDrawer
        isOpen={isOpen(DrawerType.REWARD_DETAILS)}
        setIsOpen={(open) => {
          if (!open) {
            clearSelectedReward();
            toggleDrawer(DrawerType.REWARD_DETAILS);
          }
        }}
      />
    </div>
  );
}
