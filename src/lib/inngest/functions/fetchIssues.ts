import { inngest } from "../client";
import { createFeedbackItems } from "@/app/actions/feedbackActions";
import { getGithubIssues } from "@/services/feedbackAi";
import prisma from "@/lib/prisma";

export const ingestIssues = inngest.createFunction(
  { id: "ingest-github-issues" },
  [{ cron: "/3 * * * *" }], // Run cron daily at 8AM.
  async ({ step }) => {
    // Step 1: Fetch issues
    const issues = await step.run("fetch-github-issues", getGithubIssues);

    // Step 2: Insert into DB (upsert)
    await step.run("save-issues", async () => {
      await createFeedbackItems(issues);
    });

    // Step 3: Get all issues without analysis
    const unanalyzed = await prisma.feedbackItem.findMany({
      where: { analyses: { none: {} } },
    });

    // Step 4: Emit event for each issue
    await Promise.all(
      unanalyzed.map((issue) =>
        step.sendEvent("analysis/requested", {
          name: "analysis/requested",
          data: { issueId: issue.id },
        }),
      ),
    );

    return { triggered: unanalyzed.length };
  },
);
