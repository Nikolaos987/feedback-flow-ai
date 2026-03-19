import { FeedbackItemAnalysis } from "@/components/features/dashboard/types/dashboardTypes";
import axios from "axios";

export async function fetchFeedbackItem(id: string): Promise<FeedbackItemAnalysis> {
  const response = await axios.get("/api/inbox/feedbackItem", { params: { id } });

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data.data;
}
