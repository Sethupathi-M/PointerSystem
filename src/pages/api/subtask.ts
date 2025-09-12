import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
          return res.status(200).json(subtasks);
        }
        return res.status(400).json({ error: "Parent task ID required" });

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
        return res.status(201).json(newSubtask);

      case "PUT":
        // Update subtask
        if (!query.id)
          return res.status(400).json({ error: "Subtask ID required" });
        const updatedSubtask = await prisma.subTask.update({
          where: { id: query.id as string },
          data: {
            name: body.name,
            isActive: body.isActive,
            isAddedToToday: body.isAddedToToday,
          },
        });
        return res.status(200).json(updatedSubtask);

      case "DELETE":
        // Delete subtask
        if (!query.id)
          return res.status(400).json({ error: "Subtask ID required" });
        await prisma.subTask.delete({
          where: { id: query.id as string },
        });
        return res.status(200).json({ success: true });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Subtask API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
