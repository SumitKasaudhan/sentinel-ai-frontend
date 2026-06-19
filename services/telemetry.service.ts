import api from "./api";

export const getTelemetry = async (token?: string) => {
  const res = await api.get("/telemetry", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data.data;
};