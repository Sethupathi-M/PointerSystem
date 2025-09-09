// lib/axios.ts
import axios from "axios";

// Create Axios instance
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor: attach auth token
api.interceptors.request.use(
  (config) => {
    // Example: attach token from localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("API Error:", error.response.status, error.response.data);
      // Optional: show toast or notification
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Axios error:", error.message);
    }
    return Promise.reject(error);
  }
);
