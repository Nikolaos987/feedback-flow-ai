import { inngest } from "../client";
import prisma from "@/lib/prisma";

export const analyzeSingleIssue = inngest.createFunction(
  { id: "analyze-single-issue" },
  { event: "analysis/requested" },
  async ({ event, step }) => {
    const { issueId } = event.data;

    // Get the issue
    const issue = await prisma.feedbackItem.findUnique({
      where: { id: issueId },
    });

    if (!issue) return;

    const prompt = `
      You must respond with ONLY valid JSON.
      Do NOT include backticks, code fences, explanations, or extra text.

      Analyze this GitHub issue:

      "${issue?.raw_content}"

      Return EXACTLY this structure:

      {
        "sentiment": "positive|neutral|negative",
        "topics": ["topic1", "topic2"],
        "severity_score": 1-5,
        "summary": "short text summary"
      }
    `;

    // AI inference
    const response = await step.ai.infer("analyze-github-issue", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
    });

    // Parse
    const part = response.candidates?.[0]?.content?.parts?.[0];
    const analysisText = part && "text" in part ? part.text : "";
    const clean = (analysisText ?? "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const analysisData = JSON.parse(clean);

    // Save analysis
    await prisma.feedbackAnalysis.create({
      data: {
        feedback_item_id: issue.id,
        sentiment: analysisData.sentiment,
        topics: analysisData.topics,
        severity_score: analysisData.severity_score,
        summary: analysisData.summary,
      },
    });

    return { analyzed: issueId };
  },
);
