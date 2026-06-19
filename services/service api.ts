import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

if (process.env.NODE_ENV !== "production") {
  console.log("BASE_URL =", BASE_URL);
}

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

// Named export added for consistency with @/lib/api
export { api };

export default api;