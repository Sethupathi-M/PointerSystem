// lib/api/identityApi.ts
import { api } from "@/lib/axios";
import type { Identity } from "@/generated/prisma"; 

export const identityApi = {
  // List all identities
  getAll: async (): Promise<Identity[]> => {
    const { data } = await api.get("/identity"); 
  
    return data;
  },

  // Get one identity by id
  getById: async (id: string): Promise<Identity> => {
    const { data } = await api.get("/identity", { params: { id } });
    return data;
  },

  // Create new identity
  create: async (identity: Partial<Identity>): Promise<Identity> => {
    const { data } = await api.post("/identity", identity);
    return data;
  },

  // Update existing identity by id
  update: async (id: string, identity: Partial<Identity>): Promise<Identity> => {
    const { data } = await api.put("/identity", identity, { params: { id } });
    return data;
  },

  // Delete identity by id
  delete: async (id: string): Promise<Identity> => {
    const { data } = await api.delete("/identity", { params: { id } });
    return data;
  },
};
