import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Auth token — har request pe
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    const token = await window.Clerk?.session?.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 429 pe 3 sec baad auto-retry
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 429 && !error.config._retry) {
      error.config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;