import { SentimentPoint } from "@/components/features/dashboard/types/dashboardTypes";
import axios from "axios";

export async function fetchSentimentTrendData(): Promise<SentimentPoint[]> {
  const response = await axios.get("/api/dashboard/charts/sentimentTrend");

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
