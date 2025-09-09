import { prisma } from "@/lib/prisma";
import { Task, TaskType, PointsType } from "@/generated/prisma";


export const taskService = {
  // Get all tasks (optionally filtered by identityId or status)
  getAllTasks: async (identityId?: string, isActive?: boolean): Promise<Task[]> => {
    return prisma.task.findMany({
      where: {
        identityId: identityId ?? undefined, 
      },
      include: {
        SubTask: true,
        counterTask: true,
      },
      orderBy: { createdAt: "asc" },
    });
  },

  // Get a single task by ID
  getTaskById: async (id: string): Promise<Task | null> => {
    return prisma.task.findUnique({
      where: { id },
      include: {
        SubTask: true,
        counterTask: true,
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
  }): Promise<Task> => {
    return prisma.task.create({
      data: {
        name: data.name,
        identityId: data.identityId,
        points: data.points,
        pointsType: data.pointsType,
        taskType: data.taskType ?? TaskType.DEFAULT,
        isFavorited: data.isFavorited ?? false,
      },
    });
  },

  // Update a task
  updateTask: async (id: string, data: Partial<{
    name: string;
    isFavorited: boolean;
    isActive: boolean;
    isAddedToToday: boolean;
    points: number;
    pointsType: PointsType;
  }>): Promise<Task> => {
    return prisma.task.update({
      where: { id },
      data,
    });
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    // return prisma.task.delete({
    //   where: { id },
    // });

   await prisma.$queryRaw`DELETE FROM "Task" WHERE "id" = ${id}`;
  },

  // Increment counter for a counter task
  incrementCounter: async (taskId: string, incrementBy = 1): Promise<void> => {
    await prisma.counterTask.update({
      where: { taskId },
      data: { count: { increment: incrementBy } },
    });
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
  lockTasksForReward: async (rewardCost: number): Promise<{ lockedCount: number; lockedTasks: Task[] }> => {
    // Get all completed tasks (isActive = false) that are not already locked, sorted by updatedAt (oldest first)
    const completedTasks = await prisma.task.findMany({
      where: {
        isActive: false,
        isLocked: false,
        pointsType: PointsType.POSITIVE,
      },
      orderBy: {
        updatedAt: 'asc', // Oldest first
      },
    });

    // Calculate how many tasks we need to lock based on reward cost
    let pointsToLock = 0;
    const tasksToLock: Task[] = [];
    
    for (const task of completedTasks) {
      if (pointsToLock >= rewardCost) break;
      
      tasksToLock.push(task);
      pointsToLock += task.points;
    }

    // Lock the selected tasks
    if (tasksToLock.length > 0) {
      await prisma.task.updateMany({
        where: {
          id: {
            in: tasksToLock.map(task => task.id),
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
        updatedAt: 'desc',
      },
    });
  },
};
