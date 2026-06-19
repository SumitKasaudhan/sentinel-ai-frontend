import { api } from "@/lib/api";

export const getSubscriptionStatus =
  async (token: string) => {
    const response = await api.get(
      "/subscription/status",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };
