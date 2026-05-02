// import { analyzeIssues } from "./functions/analyze";
import { analyzeSingleIssue } from "./functions/analyze";
import { cleanupOldFeedback } from "./functions/cleanupFeedback";
import { ingestIssues } from "./functions/fetchIssues";

export const functions = [ingestIssues, analyzeSingleIssue, cleanupOldFeedback];
