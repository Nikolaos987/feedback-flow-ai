type Sentiment = "positive" | "negative" | "neutral";

type TrendPoint = {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
};

type TopicPoint = {
  topic: string;
  count: number;
  fill: string;
};

type HighSeverityFeedback = {
  id: string;
  source: string;
  sentiment: Sentiment;
  severity: number;
  summary: string;
  topics: string[];
  timestamp: string;
};

export type DashboardData = {
  totalFeedback: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  highSeverityCount: number;
  sentimentTrendData: TrendPoint[];
  topicDistributionData: TopicPoint[];
  highSeverityFeedback: HighSeverityFeedback[];
};
