import type { NextApiRequest, NextApiResponse } from "next";
import { rewardService } from "@/lib/services/rewardService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "GET":
        // Get all rewards or single reward by ID
        if (query.id) {
          const reward = await rewardService.getRewardById(query.id as string);
          if (!reward) {
            return res.status(404).json({ error: "Reward not found" });
          }
          return res.status(200).json(reward);
        } else if (query.available === "true") {
          return res.status(200).json(await rewardService.getAvailableRewards());
        } else if (query.redeemed === "true") {
          return res.status(200).json(await rewardService.getRedeemedRewards());
        } else {
          return res.status(200).json(await rewardService.getAllRewards());
        }

      case "POST":
        // Create new reward
        const { name, description, cost, imageCollection } = body;
        if (!name || !description || cost === undefined || !imageCollection) {
          return res.status(400).json({ 
            error: "Missing required fields: name, description, cost, imageCollection" 
          });
        }
        const newReward = await rewardService.createReward({
          name,
          description,
          cost,
          imageCollection,
        });
        return res.status(201).json(newReward);

      case "PUT":
        // Update reward
        if (!query.id) {
          return res.status(400).json({ error: "Reward ID required" });
        }
        const updatedReward = await rewardService.updateReward(
          query.id as string,
          body
        );
        return res.status(200).json(updatedReward);

      case "DELETE":
        // Delete reward
        if (!query.id) {
          return res.status(400).json({ error: "Reward ID required" });
        }
        await rewardService.deleteReward(query.id as string);
        return res.status(200).json({ success: true });

      case "PATCH":
        // Redeem reward
        if (!query.id) {
          return res.status(400).json({ error: "Reward ID required" });
        }
        const redemptionResult = await rewardService.redeemReward(query.id as string);
        return res.status(200).json(redemptionResult);

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Reward API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
