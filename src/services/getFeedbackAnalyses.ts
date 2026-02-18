import { Sentiment, statsCards } from "@/components/features/dashboard/types/dashboardTypes";
import { FeedbackAnalysis } from "@/types/FeedbackAi/feedbackAi";
import axios from "axios";

export async function fetchFeedbackAnalyses(): Promise<FeedbackAnalysis[]> {
  const response = await axios.get("/api/inbox/feedbackAnalyses");

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
