import api from "./api";

export const getThreatById = async (id: string) => {
  const response = await api.get(`/threats/${id}`);
  return response.data.data;
};