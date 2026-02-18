import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const feedbackAnalyses = await prisma.feedbackAnalysis.findMany({
      include: {
        feedback_item: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(feedbackAnalyses);
  } catch (error) {
    console.error("Failed to fetch feedback analyses data", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback analyses data" },
      { status: 500 },
    );
  }
}
