import axios from "axios";

export const getThreatById = async (
  id: string
) => {
  const url = `http://localhost:5000/api/threats/${id}`;

  console.log("THREAT URL:", url);

  const response = await axios.get(url);

  return response.data.data;
};