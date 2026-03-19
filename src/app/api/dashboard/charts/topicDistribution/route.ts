import { TopicPoint } from "@/components/features/dashboard/types/dashboardTypes";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const analyses = await prisma.feedbackAnalysis.findMany({
      select: {
        topics: true,
      },
    });

    const topicCounts = new Map<string, number>();

    for (const analysis of analyses) {
      for (const topic of parseTopics(analysis.topics)) {
        const normalizedTopic = topic.trim();
        if (!normalizedTopic) continue;

        topicCounts.set(normalizedTopic, (topicCounts.get(normalizedTopic) ?? 0) + 1);
      }
    }

    const topicDistributionData: TopicPoint[] = Array.from(topicCounts.entries())
      .sort((first, second) => second[1] - first[1])
      .slice(0, 5)
      .map(([topic, count], index) => ({
        topic,
        count,
        fillKey: index + 1,
      }));

    return NextResponse.json(topicDistributionData);
  } catch (error) {
    console.error("Failed to fetch topic distribution data", error);
    return NextResponse.json({ error: "Failed to fetch topic distribution data" }, { status: 500 });
  }
}
