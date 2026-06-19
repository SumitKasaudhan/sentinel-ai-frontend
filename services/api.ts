import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

if (process.env.NODE_ENV !== "production") {
  api.interceptors.request.use((config) => {
    console.log("REQUEST:", `${config.baseURL}${config.url}`);
    return config;
  });
}

// Named export — required by services that do `import { api } from "@/lib/api"`
export { api };

// Default export — required by services that do `import api from "@/lib/api"`
export default api;