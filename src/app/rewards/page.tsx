"use client";

import OverlayDrawer from "@/components/OverlayDrawer";
import RewardItem from "@/components/RewardItem";
import { IReward } from "@/types";
import React, { useState } from "react";

const rewards: IReward[] = Array.from({ length: 50 }, () => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    name: "Reward " + Math.random().toString(36).substring(2, 15),
    description: "Description " + Math.random().toString(36).substring(2, 15),
    image: "placeholder.jpeg",
    price: Math.floor(Math.random() * 100),
    isLocked: true,
  };
});

export default function Rewards() {
  const [isRewardDetailsDrawerOpen, setIsRewardDetailsDrawerOpen] =
    useState(false);
  // create a array fill with 100 0s

  return (
    <div className="h-full mt-4 px-5">
      <div className="flex flex-row gap-3 flex-wrap justify-start items-start h-11/12 overflow-y-auto">
        {rewards.map((reward) => (
          <RewardItem
            reward={reward}
            key={reward.id}
            setIsRewardDetailsDrawerOpen={setIsRewardDetailsDrawerOpen}
          />
        ))}
        <OverlayDrawer
          isOpen={isRewardDetailsDrawerOpen}
          setIsOpen={setIsRewardDetailsDrawerOpen}
        >
          <div>Reward Drawer</div>
        </OverlayDrawer>
      </div>
    </div>
  );
}
