import {api} from "@/lib/api";

export const scanTarget = async (
  target: string,
  token: string
) => {
  return api.post(
    "/scan",
    { target },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};