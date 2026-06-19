import api from "./api";

export const getThreatTrends = async (
  token: string
) => {
  const response = await api.get(
    "/analytics/trends",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getSeverityDistribution = async (
  token: string
) => {
  const response = await api.get(
    "/analytics/severity",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCountryAnalytics = async (
  token: string
) => {
  const response = await api.get(
    "/analytics/countries",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};