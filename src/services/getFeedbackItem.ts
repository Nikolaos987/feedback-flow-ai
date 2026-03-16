import { Filtering } from "@/types/Data/filters";
import axios from "axios";

export async function fetchFeedbackItem(id: string) {
  const response = await axios.get("/api/inbox/feedbackItem", { params: { id } });

  if (response.status !== 200) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
}
