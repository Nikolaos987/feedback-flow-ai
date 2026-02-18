import { StatsCards } from "@/components/features/dashboard/types/dashboardTypes";
import axios from "axios";

export async function fetchStatsCards(): Promise<StatsCards> {
  const response = await axios.get("/api/dashboard/stats");

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
