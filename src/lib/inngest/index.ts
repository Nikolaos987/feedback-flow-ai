// import { analyzeIssues } from "./functions/analyze";
import { analyzeSingleIssue } from "./functions/analyze";
import { ingestIssues } from "./functions/fetchIssues";

export const functions = [ingestIssues, analyzeSingleIssue];
