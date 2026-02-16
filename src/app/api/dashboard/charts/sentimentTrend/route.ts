import { SentimentPoint } from "@/components/features/dashboard/types/dashboardTypes";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 14);

    const analyses = await prisma.feedbackAnalysis.findMany({
      where: {
        created_at: {
          gte: startDate,
        },
      },
      select: {
        sentiment: true,
        created_at: true,
      },
    });

    const trendMap = new Map<string, SentimentPoint>();

    for (let offset = 14; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      const key = toDateKey(date);

      trendMap.set(key, {
        date: toDisplayDate(date),
        positive: 0,
        negative: 0,
        neutral: 0,
      });
    }

    for (const analysis of analyses) {
      const key = toDateKey(analysis.created_at);
      const point = trendMap.get(key);
      if (!point) continue;

      const sentiment = analysis.sentiment.toLowerCase();
      if (sentiment === "positive") {
        point.positive += 1;
      } else if (sentiment === "negative") {
        point.negative += 1;
      } else if (sentiment === "neutral") {
        point.neutral += 1;
      }
    }

    return NextResponse.json(Array.from(trendMap.values()));
  } catch (error) {
    console.error("Failed to fetch stats data", error);
    return NextResponse.json({ error: "Failed to fetch stats data" }, { status: 500 });
  }
}
