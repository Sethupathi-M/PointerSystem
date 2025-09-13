import { prisma } from "@/lib/prisma";
import { Task, TaskType, PointsType } from "@/generated/prisma";

export const taskService = {
  // Get all tasks (optionally filtered by identityId or status)
  getAllTasks: async (
    identityId?: string,
    includeBacklog: boolean = false
  ): Promise<Task[]> => {
    return prisma.task.findMany({
      where: {
        identityId: identityId ?? undefined,
        ...(includeBacklog ? {} : { isBacklog: false }),
      },
      include: {
        SubTask: true,
        counterTask: {
          include: {
            CounterDayPoints: true,
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { sortValue: "asc" },
        { createdAt: "asc" },
      ],
    });
  },

  // Get a single task by ID
  getTaskById: async (id: string): Promise<Task | null> => {
    return prisma.task.findUnique({
      where: { id },
      include: {
        SubTask: true,
        counterTask: {
          include: {
            CounterDayPoints: true,
          },
        },
      },
    });
  },

  // Create a new task
  createTask: async (data: {
    name: string;
    identityId: string;
    points: number;
    pointsType: PointsType;
    taskType?: TaskType;
    isFavorited?: boolean;
    isBacklog?: boolean;
  }): Promise<Task> => {
    return prisma.task.create({
      data: {
        name: data.name,
        identityId: data.identityId,
        points: data.points,
        pointsType: data.pointsType,
        taskType: data.taskType ?? TaskType.DEFAULT,
        isFavorited: data.isFavorited ?? false,
        isBacklog: data.isBacklog ?? false,
      },
    });
  },

  // Update a task
  updateTask: async (
    id: string,
    data: Partial<{
      name: string;
      isFavorited: boolean;
      isActive: boolean;
      isAddedToToday: boolean;
      isBacklog: boolean;
      points: number;
      pointsType: PointsType;
    }>
  ): Promise<Task> => {
    // If completing a counter task, calculate accumulated points
    if (data.isActive === false) {
      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          counterTask: {
            include: {
              CounterDayPoints: true,
            },
          },
        },
      });

      if (task?.taskType === TaskType.COUNTER && task.counterTask) {
        // Calculate accumulated points from daily tracking
        const accumulatedPoints = task.counterTask.CounterDayPoints.reduce(
          (sum, dayPoint) => sum + dayPoint.points,
          0
        );

        // Update the task with accumulated points instead of base points
        return prisma.task.update({
          where: { id },
          data: {
            ...data,
            points: accumulatedPoints,
          },
        });
      }
    }

    return prisma.task.update({
      where: { id },
      data,
    });
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    // First, check if it's a counter task and delete related data
    const taskToDelete = await prisma.task.findUnique({
      where: { id },
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
      where: { parentTaskId: id },
    });

    // Finally, delete the task
    await prisma.task.delete({
      where: { id },
    });
  },

  // Increment counter for a counter task
  incrementCounter: async (taskId: string, incrementBy = 1): Promise<void> => {
    await prisma.counterTask.update({
      where: { taskId },
      data: { count: { increment: incrementBy } },
    });
  },

  // Increment counter with daily points tracking
  incrementCounterWithPoints: async (
    taskId: string,
    points: number,
    pointsType: string
  ): Promise<{ count: number; accumulatedPoints: number }> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the counter task with its daily points
    const counterTask = await prisma.counterTask.findUnique({
      where: { taskId },
      include: {
        CounterDayPoints: {
          where: {
            day: today,
          },
        },
      },
    });

    if (!counterTask) {
      throw new Error("Counter task not found");
    }

    // Calculate the effective points based on type
    const effectivePoints = pointsType === "POSITIVE" ? points : -points;

    // Update or create today's points entry
    await prisma.counterDayPoints.upsert({
      where: {
        counterTaskId_day: {
          counterTaskId: counterTask.id,
          day: today,
        },
      },
      update: {
        points: { increment: effectivePoints },
      },
      create: {
        counterTaskId: counterTask.id,
        day: today,
        points: effectivePoints,
      },
    });

    // Increment the counter
    const updatedCounter = await prisma.counterTask.update({
      where: { taskId },
      data: { count: { increment: 1 } },
      include: {
        CounterDayPoints: true,
      },
    });

    // Calculate accumulated points
    const accumulatedPoints = updatedCounter.CounterDayPoints.reduce(
      (sum, dayPoint) => sum + dayPoint.points,
      0
    );

    return {
      count: updatedCounter.count,
      accumulatedPoints,
    };
  },

  // Add a subtask to a task
  addSubTask: async (parentTaskId: string, name: string): Promise<Task> => {
    return prisma.task.update({
      where: { id: parentTaskId },
      data: {
        SubTask: {
          create: { name },
        },
      },
      include: { SubTask: true },
    });
  },

  // Lock tasks based on reward redemption
  lockTasksForReward: async (
    rewardCost: number
  ): Promise<{ lockedCount: number; lockedTasks: Task[] }> => {
    // Get all completed tasks (isActive = false) that are not already locked, sorted by updatedAt (oldest first)
    const completedTasks = await prisma.task.findMany({
      where: {
        isActive: false,
        isLocked: false,
        pointsType: PointsType.POSITIVE,
      },
      include: {
        counterTask: {
          include: {
            CounterDayPoints: true,
          },
        },
      },
      orderBy: {
        updatedAt: "asc", // Oldest first
      },
    });

    // Calculate how many tasks we need to lock based on reward cost
    let pointsToLock = 0;
    const tasksToLock: Task[] = [];

    for (const task of completedTasks) {
      if (pointsToLock >= rewardCost) break;

      // For counter tasks, the points are already accumulated in the task.points field
      // when the task was completed, so we can use task.points directly
      tasksToLock.push(task);
      pointsToLock += task.points;
    }

    // Lock the selected tasks
    if (tasksToLock.length > 0) {
      await prisma.task.updateMany({
        where: {
          id: {
            in: tasksToLock.map((task) => task.id),
          },
        },
        data: {
          isLocked: true,
        },
      });
    }

    return {
      lockedCount: tasksToLock.length,
      lockedTasks: tasksToLock,
    };
  },

  // Unlock a specific task (for admin purposes)
  unlockTask: async (taskId: string): Promise<Task> => {
    return prisma.task.update({
      where: { id: taskId },
      data: { isLocked: false },
    });
  },

  // Get locked tasks for an identity
  getLockedTasks: async (identityId: string): Promise<Task[]> => {
    return prisma.task.findMany({
      where: {
        identityId,
        isLocked: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  },
};
