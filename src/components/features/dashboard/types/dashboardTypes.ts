import { SENTIMENTS } from "../constants/dashboard";

export type Sentiment = (typeof SENTIMENTS)[number];

export type StatsCards = {
  totalFeedback: number;
  positive: number;
  negative: number;
  highSeverity: number;
};

export type SentimentPoint = {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
};

export type TopicPoint = {
  topic: string;
  count: number;
  fillKey: number;
};
export type FeedbackItemAnalysis = {
  summary: string;
  sentiment: string;
  status: string;
  severity_score: number;
  topics: string[];
  feedback_item: {
    source: string;
    original_timestamp: Date;
    raw_content: string;
  };
};

export type HighSeverityFeedback = {
  id: string;
  source: string;
  sentiment: Sentiment;
  severity: number;
  summary: string;
  topics: string[];
  timestamp: string;
};

export type HighSeverityFeedbackItem = {
  id: string;
  source: string;
  sentiment: Sentiment;
  severity: number;
  summary: string;
  topics: string[];
  timestamp: Date;
};
