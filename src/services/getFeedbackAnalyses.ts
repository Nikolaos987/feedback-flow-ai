import { Filtering } from "@/types/Data/filters";
import axios from "axios";

export async function fetchFeedbackAnalyses({ filters }: { filters: Filtering }) {
  const severityRange =
    filters.severityRange && filters.severityRange.length === 2 ? filters.severityRange : null;

  const params = {
    ...(filters.sentiment && filters.sentiment !== "all" ? { sentiment: filters.sentiment } : {}),
    ...(filters.status && filters.status !== "all" ? { status: filters.status } : {}),
    ...(severityRange
      ? { severityMin: severityRange[0], severityMax: severityRange[1] }
      : filters.severity != null
        ? { severity: filters.severity }
        : {}),
    ...(filters.topics && filters.topics.length > 0 ? { topics: filters.topics } : {}),
    ...(filters.topic && filters.topic !== "all" ? { topic: filters.topic } : {}),
  };

  const response = await axios.get("/api/inbox/feedbackAnalyses", { params });

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
