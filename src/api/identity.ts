import { API_URL } from "@/constants";
import { IdentityItem } from "@/types";
import axios from "axios";

export const getIdentityBoard = async (): Promise<IdentityItem[]> => {
  const response = await axios.get(`${API_URL}IdentityBoard`);
  return response.data;
};

export const postIdentityBoard = async (data: IdentityItem): Promise<void> => {
  const response = await axios.post(`${API_URL}IdentityBoard`, data);
  return response.data;
};

export const getIdentityBoardById = async (
  id: string
): Promise<IdentityItem> => {
  const response = await axios.get(`${API_URL}IdentityBoard/${id}`);
  return response.data;
};

export const putIdentityBoardById = async (
  id: string,
  data: IdentityItem
): Promise<IdentityItem> => {
  const response = await axios.put(`${API_URL}IdentityBoard/${id}`, data);
  return response.data;
};

export const deleteIdentityBoardById = async (
  id: string
): Promise<IdentityItem> => {
  const response = await axios.delete(`${API_URL}IdentityBoard/${id}`);
  return response.data;
};
