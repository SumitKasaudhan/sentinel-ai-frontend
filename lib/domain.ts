import api from "./axios";

export const validateDomain = async (
  domain: string
) => {
  const response = await api.post(
    "/scanner/validate-domain",
    { domain }
  );

  return response.data;
};