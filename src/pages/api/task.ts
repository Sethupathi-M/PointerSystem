import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TaskType, PointsType } from "../../generated/prisma";
import { taskService } from "@/lib/services/taskService";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "GET":
        // Get all tasks or single task by ID
        if (query.id) {
          res
            .status(200)
            .json(await taskService.getTaskById(query.id as string));
          return;
        } else if (query.isFavorited) {
          res.status(200).json(
            await prisma.task.findMany({
              where: {
                isActive: true,
                isFavorited: true,
              },
              include: {
                SubTask: true,
                counterTask: {
                  include: {
                    CounterDayPoints: true,
                  },
                },
              },
            })
          );
          return;
        } else if (query.isAddedToToday) {
          res.status(200).json(
            await prisma.task.findMany({
              where: {
                isActive: true,
                isAddedToToday: true,
              },
              include: {
                SubTask: true,
                counterTask: {
                  include: {
                    CounterDayPoints: true,
                  },
                },
              },
            })
          );
          return;
        } else {
          const { identityId } = query;
          console.log({ identityId });

          // Fix: Return the correct type for an array of tasks
          res
            .status(200)
            .json(await taskService.getAllTasks(identityId as string));
          return;
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
          include: {
            SubTask: true,
            counterTask: {
              include: {
                CounterDayPoints: true,
              },
            },
          },
        });

        // If it's a counter task, create the counter task record
        if (body.taskType === TaskType.COUNTER) {
          await prisma.counterTask.create({
            data: {
              taskId: newTask.id,
              count: parseInt(String(body.counterCurrent || 0), 10),
              target: parseInt(String(body.counterTarget || 1), 10),
              defaultPoints: parseInt(String(body.defaultPoints || 100), 10),
            },
          });
        }

        res.status(201).json({ success: true, data: newTask });
        return;

      case "PUT":
        // Special case: Update sort order (doesn't require task ID)
        if (query.action === "update-sort") {
          const { taskIds } = body;

          if (!Array.isArray(taskIds)) {
            res
              .status(400)
              .json({ success: false, error: "taskIds must be an array" });
            return;
          }

          // Update sort values for all tasks
          const updatePromises = taskIds.map((taskId: string, index: number) =>
            prisma.task.update({
              where: { id: taskId },
              data: { sortValue: index },
            })
          );

          await Promise.all(updatePromises);

          res.status(200).json({ success: true });
          return;
        }

        // Update task (requires task ID)
        if (!query.id) {
          res.status(400).json({ success: false, error: "Task ID required" });
          return;
        }

        // Special case: Update counter count only
        if (query.action === "increment-counter") {
          const counterTask = await prisma.counterTask.findUnique({
            where: { taskId: query.id as string },
          });

          if (!counterTask) {
            res
              .status(404)
              .json({ success: false, error: "Counter task not found" });
            return;
          }

          const updatedCounter = await prisma.counterTask.update({
            where: { taskId: query.id as string },
            data: { count: counterTask.count + 1 },
          });

          res.status(200).json(updatedCounter);
          return;
        }

        // Special case: Update counter with daily points tracking
        if (query.action === "increment-counter-with-points") {
          const { points, pointsType } = body;

          if (!points || !pointsType) {
            res.status(400).json({
              success: false,
              error: "Points and pointsType are required",
            });
            return;
          }

          try {
            const result = await taskService.incrementCounterWithPoints(
              query.id as string,
              points,
              pointsType
            );

            res.status(200).json(result);
            return;
          } catch (error) {
            console.error("Error incrementing counter with points:", error);
            res.status(500).json({
              success: false,
              error: "Failed to increment counter with points",
            });
            return;
          }
        }

        // Special case: Toggle pin status
        if (query.action === "toggle-pin") {
          const task = await prisma.task.findUnique({
            where: { id: query.id as string },
          });

          if (!task) {
            res.status(404).json({ success: false, error: "Task not found" });
            return;
          }

          const updatedTask = await prisma.task.update({
            where: { id: query.id as string },
            data: { isPinned: !task.isPinned },
            include: {
              SubTask: true,
              counterTask: {
                include: {
                  CounterDayPoints: true,
                },
              },
            },
          });

          res.status(200).json(updatedTask);
          return;
        }

        const updateData: Record<string, unknown> = { ...body };

        // Remove counter-specific fields from task update
        delete updateData.counterTarget;
        delete updateData.counterCurrent;
        delete updateData.defaultPoints;

        // Handle counter task updates
        if (body.taskType === TaskType.COUNTER) {
          // Update or create counter task
          await prisma.counterTask.upsert({
            where: { taskId: query.id as string },
            update: {
              count: parseInt(String(body.counterCurrent || 0), 10),
              target: parseInt(String(body.counterTarget || 1), 10),
              defaultPoints: parseInt(String(body.defaultPoints || 100), 10),
            },
            create: {
              taskId: query.id as string,
              count: parseInt(String(body.counterCurrent || 0), 10),
              target: parseInt(String(body.counterTarget || 1), 10),
              defaultPoints: parseInt(String(body.defaultPoints || 100), 10),
            },
          });
        } else if (body.taskType === TaskType.DEFAULT) {
          // Remove counter task if switching to default
          await prisma.counterTask.deleteMany({
            where: { taskId: query.id as string },
          });
        }

        // Use taskService for updates to handle counter task completion logic
        await taskService.updateTask(query.id as string, updateData);

        // Fetch the updated task with all relations
        const taskWithRelations = await prisma.task.findUnique({
          where: { id: query.id as string },
          include: {
            SubTask: true,
            counterTask: {
              include: {
                CounterDayPoints: true,
              },
            },
          },
        });
        res.status(200).json(taskWithRelations);
        return;

      case "DELETE":
        // Delete task
        if (!query.id) {
          res.status(400).json({ success: false, error: "Task ID required" });
          return;
        }

        // First, check if it's a counter task and delete related data
        const taskToDelete = await prisma.task.findUnique({
          where: { id: query.id as string },
          include: {
            counterTask: true,
          },
        });

        if (taskToDelete?.counterTask) {
          // Delete counter day points first
          await prisma.counterDayPoints.deleteMany({
            where: { counterTaskId: taskToDelete.counterTask.id },
          });

          // Delete the counter task
          await prisma.counterTask.delete({
            where: { id: taskToDelete.counterTask.id },
          });
        }

        // Delete subtasks if any
        await prisma.subTask.deleteMany({
          where: { parentTaskId: query.id as string },
        });

        // Finally, delete the task
        const deletedTask = await prisma.task.delete({
          where: { id: query.id as string },
        });

        res.status(200).json(deletedTask);
        return;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        return;
    }
  } catch (error) {
    console.error("Task API error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
