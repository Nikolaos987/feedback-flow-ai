import { TopicPoint } from "@/components/features/dashboard/types/dashboardTypes";
import axios from "axios";

export async function fetchTopicDistributionData(): Promise<TopicPoint[]> {
  const response = await axios.get("/api/dashboard/charts/topicDistribution");

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
