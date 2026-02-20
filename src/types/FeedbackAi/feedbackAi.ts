import { Sentiment } from "@/components/features/dashboard/types/dashboardTypes";

type FilterOption = {
  value: string | number;
  label: string;
};

export type FiltersMap = Record<string, FilterOption[]>;

export type FeedbackItem = {
  created_at: Date;
  external_id: string;
  id: string;
  original_timestamp: Date;
  raw_content: string;
  source: string;
};

export type FeedbackAnalysis = {
  feedback_item_id: string;
  feedback_item: FeedbackItem;
  id: string;
  sentiment: Sentiment;
  severity_score: number;
  status: string;
  summary: string;
  topics: string[];
};
