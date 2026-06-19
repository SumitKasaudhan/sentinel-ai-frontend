"use client";

import { useAuth } from "@clerk/nextjs";
import { getDashboardStats } from "@/services/dashboard.service";

export default function DashboardPage() {
  const { getToken } = useAuth();

  const testBackend = async () => {
    try {
      const token = await getToken();

      console.log("========== CLERK TOKEN ==========");
      console.log(token);
      console.log("================================");

      if (!token) {
        alert("No token found");
        return;
      }

      alert(`Token Length: ${token.length}`);

      const response = await getDashboardStats(token);

      console.log("API RESPONSE:", response);

      alert(JSON.stringify(response));
    } catch (error) {
      console.error("ERROR:", error);
    }
  };

  return (
    <div>
      <button onClick={testBackend}>
        Test Backend
      </button>
    </div>
  );
}