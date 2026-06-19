import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // @ts-ignore - Clerk attaches itself to window client-side
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});