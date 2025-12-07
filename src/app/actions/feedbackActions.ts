"use server";

import prisma from "@/lib/prisma";

/** store github issues to the prisma FEEDBACK_ITEM   database */
export async function createFeedbackItems(issues) {
  await Promise.all(
    issues.map((issue) =>
      prisma.feedbackItem.upsert({
        /** check for constraint if external_id and source are the same then skip them */
        where: {
          external_id_source: { external_id: String(issue.id), source: issue.repository_url },
        },
        /** skip if the same issue appears defined in "where" */
        update: {},
        /** else, create the new issue to the db */
        create: {
          source: issue.repository_url,
          raw_content: issue.body,
          original_timestamp: new Date(issue.created_at), // from GitHub
          external_id: String(issue.id), // GitHub issue ID },
        },
      }),
    ),
  );

  return { success: true };
}
