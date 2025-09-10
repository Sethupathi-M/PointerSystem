import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "GET":
        // Get subtasks for a specific task
        if (query.parentTaskId) {
          const subtasks = await prisma.subTask.findMany({
            where: { parentTaskId: query.parentTaskId as string },
            orderBy: { createdAt: "asc" },
          });
          res.status(200).json(subtasks);
          return;
        }
        res.status(400).json({ error: "Parent task ID required" });
        return;

      case "POST":
        // Create a new subtask
        const newSubtask = await prisma.subTask.create({
          data: {
            name: body.name,
            parentTaskId: body.parentTaskId,
            isActive: body.isActive ?? false,
            isAddedToToday: body.isAddedToToday ?? false,
          },
        });
        res.status(201).json(newSubtask);
        return;

      case "PUT":
        // Update subtask
        if (!query.id) {
          res.status(400).json({ error: "Subtask ID required" });
          return;
        }
        const updatedSubtask = await prisma.subTask.update({
          where: { id: query.id as string },
          data: {
            name: body.name,
            isActive: body.isActive,
            isAddedToToday: body.isAddedToToday,
          },
        });
        res.status(200).json(updatedSubtask);
        return;

      case "DELETE":
        // Delete subtask
        if (!query.id) {
          res.status(400).json({ error: "Subtask ID required" });
          return;
        }
        await prisma.subTask.delete({
          where: { id: query.id as string },
        });
        res.status(200).json({ success: true });
        return;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        return;
    }
  } catch (error) {
    console.error("Subtask API error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
