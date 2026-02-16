import { HighSeverityFeedback } from "@/components/features/dashboard/types/dashboardTypes";
import axios from "axios";

export async function fetchHighSeverityFeedback(): Promise<HighSeverityFeedback[]> {
  const response = await axios.get("/api/dashboard/highSeverityFeedback");

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
