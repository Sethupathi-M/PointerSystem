import type { Reward } from "@/generated/prisma";
import { api } from "@/lib/axios";

export const rewardApi = {
  // List all rewards
  getAll: async (): Promise<Reward[]> => {
    const { data } = await api.get("/reward");
    return data;
  },

  // Get available rewards (not redeemed)
  getAvailable: async (): Promise<Reward[]> => {
    const { data } = await api.get("/reward", { params: { available: true } });
    return data;
  },

  // Get redeemed rewards
  getRedeemed: async (): Promise<Reward[]> => {
    const { data } = await api.get("/reward", { params: { redeemed: true } });
    return data;
  },

  // Get one reward by id
  getById: async (id: string): Promise<Reward> => {
    const { data } = await api.get("/reward", { params: { id } });
    return data;
  },

  // Create new reward
  create: async (reward: {
    name: string;
    description: string;
    cost: number;
    imageCollection: string[];
  }): Promise<Reward> => {
    reward.cost = parseInt(reward.cost.toString());
    const { data } = await api.post("/reward", reward);
    return data;
  },

  // Update existing reward by id
  update: async (id: string, reward: Partial<{
    name: string;
    description: string;
    cost: number;
    imageCollection: string[];
    isRedeemed: boolean;
  }>): Promise<Reward> => {
    const { data } = await api.put("/reward", reward, { params: { id } });
    return data;
  },

  // Delete reward by id
  delete: async (id: string): Promise<void> => {
    await api.delete("/reward", { params: { id } });
  },

  // Redeem reward
  redeem: async (id: string): Promise<Reward> => {
    const { data } = await api.patch("/reward", {}, { params: { id } });
    return data;
  },
};
