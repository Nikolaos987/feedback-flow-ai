import { Prisma, Status } from "@/generated/prisma/client";
import { FeedbackAnalysisWhereInput } from "@/generated/prisma/models";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const statusMap: Record<string, Status> = {
  new: Status.NEW,
  acknowledged: Status.ACKNOWLEDGED,
  actioned: Status.ACTIONED,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const sentiment = searchParams.get("sentiment");
  const status = searchParams.get("status");
  const severity = searchParams.get("severity");
  const topic = searchParams.get("topic");

  const where: Prisma.FeedbackAnalysisWhereInput = {};

  if (sentiment && sentiment !== "all") where.sentiment = sentiment;

  if (status && status !== "all") {
    const normalized = statusMap[status.toLowerCase()];
    if (normalized) where.status = normalized;
  }

  if (severity) {
    const n = Number(severity);
    if (!Number.isNaN(n)) where.severity_score = n; // or: n
  }

  if (topic && topic !== "all") {
    where.topics = { array_contains: [topic] }; // Postgres JSON array
  }

  try {
    const feedbackAnalyses = await prisma.feedbackAnalysis.findMany({
      include: {
        feedback_item: true,
      },
      orderBy: {
        created_at: "desc",
      },
      where,
    });

    const [sentimentsRaw, statusesRaw, severityScoresRaw] = await Promise.all([
      prisma.feedbackAnalysis.findMany({
        select: { sentiment: true },
        distinct: ["sentiment"],
      }),
      prisma.feedbackAnalysis.findMany({
        select: { status: true },
        distinct: ["status"],
      }),
      prisma.feedbackAnalysis.findMany({
        select: { severity_score: true },
        distinct: ["severity_score"],
        orderBy: { severity_score: "desc" },
      }),
    ]);

    const sentiments = [
      { value: "all", label: "All Sentiments" },
      ...sentimentsRaw.map((s, i) => {
        return { value: s.sentiment, label: s.sentiment };
      }),
    ];
    const statuses = [
      { value: "all", label: "All Statuses" },
      ...statusesRaw.map((s, i) => {
        return { value: s.status, label: s.status };
      }),
    ];
    const severities = [
      { value: "all", label: "All Severities" },
      ...severityScoresRaw.map((s, i) => {
        return { value: s.severity_score, label: s.severity_score };
      }),
    ];

    const search = { sentiment: sentiments, status: statuses, severity: severities };

    return NextResponse.json({ data: feedbackAnalyses, search });
  } catch (error) {
    console.error("Failed to fetch feedback analyses data", error);
    return NextResponse.json({ error: "Failed to fetch feedback analyses data" }, { status: 500 });
  }
}
