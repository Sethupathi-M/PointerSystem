import { Reward } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { taskService } from "./taskService";

export const rewardService = {
  // Get all rewards
  getAllRewards: async (): Promise<Reward[]> => {
    return prisma.reward.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // Get a single reward by ID
  getRewardById: async (id: string): Promise<Reward | null> => {
    return prisma.reward.findUnique({
      where: { id },
    });
  },

  // Create a new reward
  createReward: async (data: {
    name: string;
    description: string;
    cost: number;
    imageCollection: string[];
  }): Promise<Reward> => {
    return prisma.reward.create({
      data: {
        name: data.name,
        description: data.description,
        cost: data.cost,
        imageCollection: data.imageCollection,
      },
    });
  },

  // Update a reward
  updateReward: async (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      cost: number;
      imageCollection: string[];
      isRedeemed: boolean;
    }>
  ): Promise<Reward> => {
    return prisma.reward.update({
      where: { id },
      data,
    });
  },

  // Delete a reward
  deleteReward: async (id: string): Promise<void> => {
    await prisma.reward.delete({
      where: { id },
    });
  },

  // Redeem a reward
  redeemReward: async (
    id: string
  ): Promise<{ reward: Reward; lockedTasks: any[] }> => {
    // First, get the reward to check its cost
    const reward = await prisma.reward.findUnique({
      where: { id },
    });

    if (!reward) {
      throw new Error("Reward not found");
    }

    // Lock tasks based on reward cost
    const { lockedTasks } = await taskService.lockTasksForReward(reward.cost);

    // Update the reward as redeemed
    const updatedReward = await prisma.reward.update({
      where: { id },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
      },
    });

    return {
      reward: updatedReward,
      lockedTasks,
    };
  },

  // Get available rewards (not redeemed)
  getAvailableRewards: async (): Promise<Reward[]> => {
    return prisma.reward.findMany({
      where: { isRedeemed: false },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get redeemed rewards
  getRedeemedRewards: async (): Promise<Reward[]> => {
    return prisma.reward.findMany({
      where: { isRedeemed: true },
      orderBy: { redeemedAt: "desc" },
    });
  },
};
