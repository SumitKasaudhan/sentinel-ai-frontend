import { api } from "@/lib/api";

export const getDashboardStats =
  async (token: string) => {
    const response = await api.get(
      "/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
};