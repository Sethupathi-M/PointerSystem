import { API_URL } from "@/constants";
import { TaskItemPayload } from "@/types";
import axios from "axios";

// with IdentityItem as base create all the apis

export const createTask = async (data: TaskItemPayload) => {
  const response = await axios.post(`${API_URL}IdentityBoard`, data);
  return response.data;
};
