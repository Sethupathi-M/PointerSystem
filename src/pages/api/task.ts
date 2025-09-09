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
          return res
            .status(200)
            .json(await taskService.getTaskById(query.id as string));
        } else if (query.isFavorited) {
          return res.status(200).json(
            await prisma.task.findMany({
              where: {
                isActive: true,
                isFavorited: true,
              },
            })
          );
        } else if (query.isAddedToToday) {
          return res.status(200).json(
            await prisma.task.findMany({
              where: {
                isActive: true,
                isAddedToToday: true,
              },
            })
          );
        } else {
          const { identityId, isActive } = query;
          console.log({ identityId, isActive });

          // Fix: Return the correct type for an array of tasks
          return res
            .status(200)
            .json(
              await taskService.getAllTasks(
                identityId as string,
                isActive === "true"
                  ? true
                  : isActive === "false"
                    ? false
                    : undefined
              )
            );
        }

      case "POST":
        // Create a new task
        const taskData: {
          name: string;
          taskType: TaskType;
          isFavorited: boolean;
          isActive: boolean;
          isAddedToToday: boolean;
          points: number;
          pointsType: PointsType;
          identityId: string;
        } = {
          name: body.name,
          taskType: body.taskType
            ? (body.taskType as TaskType)
            : TaskType.DEFAULT,
          isFavorited: body.isFavorited ?? false,
          isActive: body.isActive ?? false,
          isAddedToToday: body.isAddedToToday ?? false,
          points: body.points,
          pointsType: body.pointsType as PointsType,
          identityId: body.identityId,
        };

        const newTask = await prisma.task.create({
          data: taskData,
          include: { SubTask: true, counterTask: true },
        });

        // If it's a counter task, create the counter task record
        if (body.taskType === TaskType.COUNTER) {
          await prisma.counterTask.create({
            data: {
              taskId: newTask.id,
              count: parseInt(String(body.counterCurrent || 0), 10),
              target: parseInt(String(body.counterTarget || 1), 10),
            },
          });
        }

        return res.status(201).json({ success: true, data: newTask });

      case "PUT":
        // Special case: Update sort order (doesn't require task ID)
        if (query.action === "update-sort") {
          const { taskIds } = body;

          if (!Array.isArray(taskIds)) {
            return res
              .status(400)
              .json({ success: false, error: "taskIds must be an array" });
          }

          // Update sort values for all tasks
          const updatePromises = taskIds.map((taskId: string, index: number) =>
            prisma.task.update({
              where: { id: taskId },
              data: { sortValue: index },
            })
          );

          await Promise.all(updatePromises);

          return res.status(200).json({ success: true });
        }

        // Update task (requires task ID)
        if (!query.id)
          return res
            .status(400)
            .json({ success: false, error: "Task ID required" });

        // Special case: Update counter count only
        if (query.action === "increment-counter") {
          const counterTask = await prisma.counterTask.findUnique({
            where: { taskId: query.id as string },
          });

          if (!counterTask) {
            return res
              .status(404)
              .json({ success: false, error: "Counter task not found" });
          }

          const updatedCounter = await prisma.counterTask.update({
            where: { taskId: query.id as string },
            data: { count: counterTask.count + 1 },
          });

          return res.status(200).json(updatedCounter);
        }

        // Special case: Toggle pin status
        if (query.action === "toggle-pin") {
          const task = await prisma.task.findUnique({
            where: { id: query.id as string },
          });

          if (!task) {
            return res
              .status(404)
              .json({ success: false, error: "Task not found" });
          }

          const updatedTask = await prisma.task.update({
            where: { id: query.id as string },
            data: { isPinned: !task.isPinned },
            include: { SubTask: true, counterTask: true },
          });

          return res.status(200).json(updatedTask);
        }

        const updateData: Record<string, unknown> = { ...body };

        // Handle counter task updates
        if (body.taskType === TaskType.COUNTER) {
          // Update or create counter task
          await prisma.counterTask.upsert({
            where: { taskId: query.id as string },
            update: {
              count: parseInt(String(body.counterCurrent || 0), 10),
              target: parseInt(String(body.counterTarget || 1), 10),
            },
            create: {
              taskId: query.id as string,
              count: parseInt(String(body.counterCurrent || 0), 10),
              target: parseInt(String(body.counterTarget || 1), 10),
            },
          });
        } else if (body.taskType === TaskType.DEFAULT) {
          // Remove counter task if switching to default
          await prisma.counterTask.deleteMany({
            where: { taskId: query.id as string },
          });
        }

        // Remove counter-specific fields from task update
        delete updateData.counterTarget;
        delete updateData.counterCurrent;

        const updatedTask = await prisma.task.update({
          where: { id: query.id as string },
          data: updateData,
          include: { SubTask: true, counterTask: true },
        });
        return res.status(200).json(updatedTask);

      case "DELETE":
        // Delete task
        if (!query.id)
          return res
            .status(400)
            .json({ success: false, error: "Task ID required" });
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
