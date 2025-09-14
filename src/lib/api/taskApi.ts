import type { Task } from "@/generated/prisma";
import { api } from "@/lib/axios";
import { QuotesResponse } from "@/types";

export const taskApi = {
  // List all tasks
  getAll: async (): Promise<Task[]> => {
    const { data } = await api.get("/task");

    return data;
  },

  getQuoteForAllIdentities: async (): Promise<QuotesResponse> => {
    const { data } = await api.get("/task", {
      params: { action: "get-quote-for-all-identities" },
    });
    return data;
  },

  // List tasks by identity
  getTasksByIdentity: async (identityId: string): Promise<Task[]> => {
    const { data } = await api.get("/task", {
      params: { identityId },
    });

    return data;
  },

  getFavourites: async (): Promise<Task> => {
    const { data } = await api.get("/task", { params: { isFavorited: true } });
    return data;
  },
  getAddedToToday: async (): Promise<Task> => {
    const { data } = await api.get("/task", {
      params: { isAddedToToday: true },
    });
    return data;
  },

  // Get one task by id
  getById: async (identityId: string): Promise<Task> => {
    const { data } = await api.get("/task", {
      params: { identityId, isActive: true },
    });
    return data;
  },

  // Get single task by task ID
  getTaskById: async (taskId: string): Promise<Task> => {
    const { data } = await api.get("/task", { params: { id: taskId } });
    return data;
  },

  // Create new task
  create: async (identity: Partial<Task>): Promise<Task> => {
    const { data } = await api.post("/task", identity);
    return data;
  },

  // Update existing task by id
  update: async (id: string, identity: Partial<Task>): Promise<Task> => {
    const { data } = await api.put("/task", identity, { params: { id } });
    return data;
  },

  // Delete task by id
  delete: async (id: string): Promise<Task> => {
    const { data } = await api.delete("/task", { params: { id } });
    return data;
  },

  // Increment counter task
  incrementCounter: async (id: string): Promise<{ count: number }> => {
    const { data } = await api.put(
      "/task",
      {},
      { params: { id, action: "increment-counter" } }
    );
    return data;
  },

  // Increment counter task with points
  incrementCounterWithPoints: async (
    id: string,
    points: number,
    pointsType: string
  ): Promise<{ count: number; accumulatedPoints: number }> => {
    const { data } = await api.put(
      "/task",
      { points, pointsType },
      { params: { id, action: "increment-counter-with-points" } }
    );
    return data;
  },

  // Toggle pin status
  togglePin: async (id: string): Promise<Task> => {
    const { data } = await api.put(
      "/task",
      {},
      { params: { id, action: "toggle-pin" } }
    );
    return data;
  },

  // Update sort order
  updateSort: async (taskIds: string[]): Promise<{ success: boolean }> => {
    const { data } = await api.put(
      "/task",
      { taskIds },
      { params: { action: "update-sort" } }
    );
    return data;
  },
};
