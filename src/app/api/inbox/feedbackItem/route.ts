import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json({ error: "Missing feedback analysis id" }, { status: 400 });
  }

  try {
    const feedbackAnalysis = await prisma.feedbackAnalysis.findUnique({
      where: { id },
      select: {
        summary: true,
        sentiment: true,
        status: true,
        severity_score: true,
        topics: true,
        feedback_item: {
          select: {
            source: true,
            original_timestamp: true,
            raw_content: true,
          },
        },
      },
    });

    if (!feedbackAnalysis) {
      return NextResponse.json({ error: "Feedback analysis not found" }, { status: 404 });
    }

    return NextResponse.json({ data: feedbackAnalysis });
  } catch (error) {
    console.error("Failed to fetch feedback item data", error);
    return NextResponse.json({ error: "Failed to fetch feedback item data" }, { status: 500 });
  }
}
