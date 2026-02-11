import { DashboardData } from "@/components/features/dashboard/types/dashboardTypes";
import axios from "axios";

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await axios.get("/api/dashboard");

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
