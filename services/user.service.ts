import { api } from "@/lib/api";

export const getUserProfile = async (
  token: string
) => {
  const response = await api.get(
    "/users/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};