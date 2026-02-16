import { SENTIMENTS } from "@/components/features/dashboard/constants/dashboard";
import {
  HighSeverityFeedback,
  HighSeverityFeedbackItem,
  Sentiment,
} from "@/components/features/dashboard/types/dashboardTypes";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const analyzedFeedback: HighSeverityFeedbackItem[] = feedbackItems.flatMap((item) => {
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

    const highSeverityFeedback = analyzedFeedback
      .filter((feedback) => feedback.severity >= 7)
      .sort(
        (first, second) =>
          second.severity - first.severity ||
          second.timestamp.getTime() - first.timestamp.getTime(),
      )
      .map((feedback) => ({
        id: feedback.id,
        source: feedback.source,
        sentiment: feedback.sentiment,
        severity: feedback.severity,
        summary: feedback.summary,
        topics: feedback.topics,
        timestamp: feedback.timestamp.toISOString(),
      }));

    return NextResponse.json(highSeverityFeedback);
  } catch (error) {
    console.error("Failed to fetch high severity feedback data", error);
    return NextResponse.json(
      { error: "Failed to fetch high severity feedback data" },
      { status: 500 },
    );
  }
}
