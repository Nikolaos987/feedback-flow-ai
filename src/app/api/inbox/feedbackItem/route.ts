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
      include: {
        feedback_item: {
          include: {
            analyses: {
              orderBy: { created_at: "desc" },
            },
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
