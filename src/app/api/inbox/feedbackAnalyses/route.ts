import { Prisma, Status } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const statusMap: Record<string, Status> = {
  new: Status.NEW,
  acknowledged: Status.ACKNOWLEDGED,
  actioned: Status.ACTIONED,
};

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const sentiment = searchParams.get("sentiment");
  const status = searchParams.get("status");
  const severity = searchParams.get("severity");
  const severityMin = searchParams.get("severityMin");
  const severityMax = searchParams.get("severityMax");
  const topic = searchParams.get("topic");
  const sortField = searchParams.get("sortField");
  const sortOrderParam = searchParams.get("sortOrder");
  const topics = [...searchParams.getAll("topics"), ...searchParams.getAll("topics[]")]
    .map((item) => item.trim())
    .filter(Boolean);
  const selectedTopics = topics.length > 0 ? topics : topic && topic !== "all" ? [topic] : [];

  const where: Prisma.FeedbackAnalysisWhereInput = {};

  if (sentiment && sentiment !== "all") where.sentiment = sentiment;

  if (status && status !== "all") {
    const normalized = statusMap[status.toLowerCase()];
    if (normalized) where.status = normalized;
  }

  const severityBounds: { gte?: number; lte?: number } = {};
  if (severityMin) {
    const n = Number(severityMin);
    if (!Number.isNaN(n)) severityBounds.gte = n;
  }
  if (severityMax) {
    const n = Number(severityMax);
    if (!Number.isNaN(n)) severityBounds.lte = n;
  }
  if (Object.keys(severityBounds).length > 0) {
    where.severity_score = severityBounds;
  } else if (severity) {
    const n = Number(severity);
    if (!Number.isNaN(n)) where.severity_score = n;
  }

  if (selectedTopics.length > 0) {
    where.OR = selectedTopics.map((selectedTopic) => ({
      topics: { array_contains: [selectedTopic] },
    }));
  }

  const sortOrder = sortOrderParam === "asc" || sortOrderParam === "desc" ? sortOrderParam : null;
  let orderBy: Prisma.FeedbackAnalysisOrderByWithRelationInput[] = [{ created_at: "desc" }];

  if (sortField && sortOrder) {
    switch (sortField) {
      case "timestamp":
        orderBy = [
          { feedback_item: { original_timestamp: sortOrder } },
          { created_at: "desc" },
        ];
        break;
      case "severity":
        orderBy = [{ severity_score: sortOrder }, { created_at: "desc" }];
        break;
      case "sentiment":
        orderBy = [{ sentiment: sortOrder }, { created_at: "desc" }];
        break;
      default:
        break;
    }
  }

  try {
    const feedbackAnalyses = await prisma.feedbackAnalysis.findMany({
      include: {
        feedback_item: true,
      },
      orderBy,
      where,
    });

    const [sentimentsRaw, statusesRaw, severityScoresRaw, topicsRaw] = await Promise.all([
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
      prisma.feedbackAnalysis.findMany({
        select: { topics: true },
      }),
    ]);

    const sentiments = [
      { value: "all", label: "All Sentiments" },
      ...sentimentsRaw.map((s) => {
        return { value: s.sentiment, label: s.sentiment };
      }),
    ];
    const statuses = [
      { value: "all", label: "All Statuses" },
      ...statusesRaw.map((s) => {
        return { value: s.status, label: s.status };
      }),
    ];
    const severities = [
      { value: "all", label: "All Severities" },
      ...severityScoresRaw.map((s) => {
        return { value: s.severity_score, label: s.severity_score };
      }),
    ];

    const distinctTopics = Array.from(
      new Set(topicsRaw.flatMap((analysis) => parseTopics(analysis.topics))),
    ).sort((first, second) => first.localeCompare(second));

    const topicsSearch = distinctTopics.map((topicValue) => ({
      value: topicValue,
      label: topicValue,
    }));

    const search = {
      sentiment: sentiments,
      status: statuses,
      severity: severities,
      topics: topicsSearch,
    };

    return NextResponse.json({ data: feedbackAnalyses, search });
  } catch (error) {
    console.error("Failed to fetch feedback analyses data", error);
    return NextResponse.json({ error: "Failed to fetch feedback analyses data" }, { status: 500 });
  }
}
