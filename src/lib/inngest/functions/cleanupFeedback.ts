import { inngest } from "../client";
import prisma from "@/lib/prisma";

const MAX_FEEDBACK_ITEMS = 50;

export const cleanupOldFeedback = inngest.createFunction(
  { id: "cleanup-old-feedback" },
  [{ cron: "0 8 * * 1" }], // Run weekly on Monday at 8AM.
  async ({ step }) => {
    const totalItems = await step.run("count-feedback-items", async () => {
      return prisma.feedbackItem.count();
    });

    if (totalItems <= MAX_FEEDBACK_ITEMS) {
      return {
        totalItems,
        deletedItems: 0,
        deletedAnalyses: 0,
        remainingItems: totalItems,
      };
    }

    const excessCount = totalItems - MAX_FEEDBACK_ITEMS;

    const itemIdsToDelete = await step.run("find-oldest-feedback-item-ids", async () => {
      const oldestItems = await prisma.feedbackItem.findMany({
        select: { id: true },
        orderBy: [{ created_at: "asc" }, { id: "asc" }],
        take: excessCount,
      });

      return oldestItems.map((item) => item.id);
    });

    if (itemIdsToDelete.length === 0) {
      return {
        totalItems,
        deletedItems: 0,
        deletedAnalyses: 0,
        remainingItems: totalItems,
      };
    }

    const { deletedItems, deletedAnalyses } = await step.run(
      "delete-old-feedback-and-analyses",
      async () => {
        const [analysesResult, itemsResult] = await prisma.$transaction([
          prisma.feedbackAnalysis.deleteMany({
            where: { feedback_item_id: { in: itemIdsToDelete } },
          }),
          prisma.feedbackItem.deleteMany({
            where: { id: { in: itemIdsToDelete } },
          }),
        ]);

        return {
          deletedAnalyses: analysesResult.count,
          deletedItems: itemsResult.count,
        };
      },
    );

    return {
      totalItems,
      deletedItems,
      deletedAnalyses,
      remainingItems: totalItems - deletedItems,
    };
  },
);
