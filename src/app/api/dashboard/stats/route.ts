import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const feedbackStats = await prisma.feedbackAnalysis.findMany({
      select: {
        sentiment: true,
        severity_score: true,
      },
    });

    const totalFeedback = feedbackStats.length;
    const positive = feedbackStats.filter(
      (item) => item.sentiment.toLowerCase() === "positive",
    ).length;
    const negative = feedbackStats.filter(
      (item) => item.sentiment.toLowerCase() === "negative",
    ).length;
    const highSeverity = feedbackStats.filter((item) => item.severity_score >= 7).length;

    return NextResponse.json({
      totalFeedback,
      positive,
      negative,
      highSeverity,
    });
  } catch (error) {
    console.error("Failed to fetch stats data", error);
    return NextResponse.json({ error: "Failed to fetch stats data" }, { status: 500 });
  }
}
