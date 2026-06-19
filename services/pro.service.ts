import { api } from "@/lib/api";

export const accessProFeature =
  async (token: string) => {
    const response = await api.get(
      "/subscription/pro-feature",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };
