import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const SENTIMENTS = ["positive", "negative", "neutral"] as const;
type Sentiment = (typeof SENTIMENTS)[number];

type DashboardFeedbackItem = {
  id: string;
  source: string;
  sentiment: Sentiment;
  severity: number;
  summary: string;
  topics: string[];
  timestamp: Date;
};

const TOPIC_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

function isSentiment(value: string): value is Sentiment {
  return SENTIMENTS.includes(value as Sentiment);
}

function parseTopics(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((topic) => (typeof topic === "string" ? topic.trim() : ""))
      .filter((topic) => topic.length > 0);
  }

  if (typeof value === "string") {
    const topic = value.trim();
    return topic ? [topic] : [];
  }

  return [];
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTrendDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export async function GET() {
  try {
    const feedbackItems = await prisma.feedbackItem.findMany({
      include: {
        analyses: {
          orderBy: { created_at: "desc" },
          take: 1,
          select: {
            sentiment: true,
            topics: true,
            severity_score: true,
            summary: true,
          },
        },
      },
      orderBy: { original_timestamp: "desc" },
    });

    const analyzedFeedback: DashboardFeedbackItem[] = feedbackItems.flatMap((item) => {
      const analysis = item.analyses[0];
      if (!analysis) return [];

      const sentimentValue = analysis.sentiment.toLowerCase();
      if (!isSentiment(sentimentValue)) return [];

      return [
        {
          id: item.id,
          source: item.source,
          sentiment: sentimentValue,
          severity: analysis.severity_score,
          summary: analysis.summary,
          topics: parseTopics(analysis.topics),
          timestamp: item.original_timestamp,
        },
      ];
    });

    const sentimentBreakdown = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    for (const feedback of analyzedFeedback) {
      sentimentBreakdown[feedback.sentiment] += 1;
    }

    const highSeverityFeedback = analyzedFeedback
      .filter((feedback) => feedback.severity >= 7)
      .sort(
        (first, second) =>
          second.severity - first.severity || second.timestamp.getTime() - first.timestamp.getTime(),
      );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trendMap = new Map<
      string,
      { date: string; positive: number; negative: number; neutral: number }
    >();

    for (let offset = 13; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      trendMap.set(toDateKey(date), {
        date: formatTrendDate(date),
        positive: 0,
        negative: 0,
        neutral: 0,
      });
    }

    for (const feedback of analyzedFeedback) {
      const trendItem = trendMap.get(toDateKey(feedback.timestamp));
      if (!trendItem) continue;
      trendItem[feedback.sentiment] += 1;
    }

    const topicCounts = new Map<string, number>();

    for (const feedback of analyzedFeedback) {
      for (const topic of feedback.topics) {
        const normalizedTopic = topic.trim();
        if (!normalizedTopic) continue;

        topicCounts.set(normalizedTopic, (topicCounts.get(normalizedTopic) ?? 0) + 1);
      }
    }

    const topicDistributionData = Array.from(topicCounts.entries())
      .sort((first, second) => second[1] - first[1])
      .slice(0, 5)
      .map(([topic, count], index) => ({
        topic,
        count,
        fill: TOPIC_COLORS[index % TOPIC_COLORS.length],
      }));

    return NextResponse.json({
      totalFeedback: analyzedFeedback.length,
      sentimentBreakdown,
      highSeverityCount: highSeverityFeedback.length,
      sentimentTrendData: Array.from(trendMap.values()),
      topicDistributionData,
      highSeverityFeedback: highSeverityFeedback.map((feedback) => ({
        id: feedback.id,
        source: feedback.source,
        sentiment: feedback.sentiment,
        severity: feedback.severity,
        summary: feedback.summary,
        topics: feedback.topics,
        timestamp: feedback.timestamp.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
