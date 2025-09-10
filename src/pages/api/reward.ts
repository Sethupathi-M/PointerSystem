import type { NextApiRequest, NextApiResponse } from "next";
import { rewardService } from "@/lib/services/rewardService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "GET":
        // Get all rewards or single reward by ID
        if (query.id) {
          const reward = await rewardService.getRewardById(query.id as string);
          if (!reward) {
            res.status(404).json({ error: "Reward not found" });
            return;
          }
          res.status(200).json(reward);
          return;
        } else if (query.available === "true") {
          res.status(200).json(await rewardService.getAvailableRewards());
          return;
        } else if (query.redeemed === "true") {
          res.status(200).json(await rewardService.getRedeemedRewards());
          return;
        } else {
          res.status(200).json(await rewardService.getAllRewards());
          return;
        }

      case "POST":
        // Create new reward
        const { name, description, cost, imageCollection } = body;
        if (!name || !description || cost === undefined || !imageCollection) {
          res.status(400).json({
            error:
              "Missing required fields: name, description, cost, imageCollection",
          });
          return;
        }
        const newReward = await rewardService.createReward({
          name,
          description,
          cost,
          imageCollection,
        });
        res.status(201).json(newReward);
        return;

      case "PUT":
        // Update reward
        if (!query.id) {
          res.status(400).json({ error: "Reward ID required" });
          return;
        }
        const updatedReward = await rewardService.updateReward(
          query.id as string,
          body
        );
        res.status(200).json(updatedReward);
        return;

      case "DELETE":
        // Delete reward
        if (!query.id) {
          res.status(400).json({ error: "Reward ID required" });
          return;
        }
        await rewardService.deleteReward(query.id as string);
        res.status(200).json({ success: true });
        return;

      case "PATCH":
        // Redeem reward
        if (!query.id) {
          res.status(400).json({ error: "Reward ID required" });
          return;
        }
        const redemptionResult = await rewardService.redeemReward(
          query.id as string
        );
        res.status(200).json(redemptionResult);
        return;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        return;
    }
  } catch (error) {
    console.error("Reward API error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
