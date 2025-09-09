import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TaskType, PointsType } from "../../generated/prisma";
import { taskService } from "@/lib/services/taskService";

const prisma = new PrismaClient();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "GET":
        // Get all tasks or single task by ID
        if (query.id) { 
          return res.status(200).json(await taskService.getTaskById(query.id as string));
        } else if (query.isFavorited) {
          return res.status(200).json(await prisma.task.findMany({
            where: {
              isActive: true,
              isFavorited: true,
            },
          }));
        } else if (query.isAddedToToday) {
          return res.status(200).json(await prisma.task.findMany({
            where: {
              isActive: true,
              isAddedToToday: true,
            },
          }));
        }
        else {
          const { identityId, isActive } = query;
     console.log({identityId, isActive});
     
          // Fix: Return the correct type for an array of tasks
          return res.status(200).json(await taskService.getAllTasks(identityId as string, isActive === "true" ? true : isActive === "false" ? false : undefined));
        }
        
      case "POST":
        // Create a new task
        const newTask = await prisma.task.create({
          data: {
            name: body.name,
            taskType: body.taskType ? (body.taskType as TaskType) : TaskType.DEFAULT,
            isFavorited: body.isFavorited ?? false,
            isActive: body.isActive ?? false,
            isAddedToToday: body.isAddedToToday ?? false,
            points: body.points,
            pointsType: body.pointsType as PointsType,
            identityId: body.identityId,
          },
          include: { SubTask: true, counterTask: true },
        });
        return res.status(201).json({ success: true, data: newTask });

      case "PUT":
        // Update task
        if (!query.id) return res.status(400).json({ success: false, error: "Task ID required" });
        const updatedTask = await prisma.task.update({
          where: { id: query.id as string },
          data: body,
          include: { SubTask: true, counterTask: true },
        });
        return res.status(200).json(updatedTask);

      case "DELETE":
        // Delete task
        if (!query.id) return res.status(400).json({ success: false, error: "Task ID required" });
        const deletedTask = await prisma.task.deleteMany({
          where: { id: query.id as string },
        });
        return res.status(200).json(deletedTask);

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Task API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
