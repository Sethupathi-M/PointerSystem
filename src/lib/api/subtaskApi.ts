import type { SubTask } from "@/generated/prisma";
import { api } from "@/lib/axios";

export const subtaskApi = {
  // Get all subtasks for a parent task
  getByParentTask: async (parentTaskId: string): Promise<SubTask[]> => {
    const { data } = await api.get("/subtask", { params: { parentTaskId } });
    return data;
  },

  // Create a new subtask
  create: async (subtask: Partial<SubTask>): Promise<SubTask> => {
    const { data } = await api.post("/subtask", subtask);
    return data;
  },

  // Update existing subtask
  update: async (id: string, subtask: Partial<SubTask>): Promise<SubTask> => {
    const { data } = await api.put("/subtask", subtask, { params: { id } });
    return data;
  },

  // Delete subtask
  delete: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete("/subtask", { params: { id } });
    return data;
  },
};
