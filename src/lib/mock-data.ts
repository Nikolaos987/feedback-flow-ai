export type Sentiment = "positive" | "negative" | "neutral"
export type Status = "New" | "Acknowledged" | "Actioned"

export interface Feedback {
  id: string
  source: string
  content: string
  sentiment: Sentiment
  topics: string[]
  severity: number // 1-5
  summary: string
  status: Status
  timestamp: string
  author?: string
}

export const mockFeedback: Feedback[] = [
  {
    id: "1",
    source: "App Store Review",
    content:
      "The app keeps crashing when I try to export my data. This is completely unacceptable for a paid product. I've lost work multiple times and customer support hasn't responded in 3 days.",
    sentiment: "negative",
    topics: ["Export", "Stability", "Customer Support"],
    severity: 5,
    summary: "Critical: App crashes during data export, blocking user workflow with no support response",
    status: "New",
    timestamp: "2026-01-08T14:30:00",
    author: "Sarah M.",
  },
  {
    id: "2",
    source: "Support Ticket",
    content:
      "Love the new dark mode! The interface is so much easier on the eyes during late night work sessions. Great job on the update.",
    sentiment: "positive",
    topics: ["Dark Mode", "UI/UX"],
    severity: 1,
    summary: "Positive feedback on new dark mode feature improving user experience",
    status: "Acknowledged",
    timestamp: "2026-01-08T11:15:00",
    author: "Mike T.",
  },
  {
    id: "3",
    source: "Twitter",
    content:
      "Been using FeedbackFlow for 2 weeks. The AI analysis is helpful but I wish there was a way to customize the topic categories for our specific industry.",
    sentiment: "neutral",
    topics: ["AI Analysis", "Customization"],
    severity: 3,
    summary: "Feature request: Custom topic categories for industry-specific analysis",
    status: "New",
    timestamp: "2026-01-08T09:45:00",
    author: "@techleader",
  },
  {
    id: "4",
    source: "In-App Feedback",
    content:
      "The mobile app is painfully slow when loading large datasets. It takes 10+ seconds to open my inbox with 500+ items. Desktop works fine.",
    sentiment: "negative",
    topics: ["Performance", "Mobile App"],
    severity: 4,
    summary: "Performance issue: Mobile app slow with large datasets (500+ items)",
    status: "Acknowledged",
    timestamp: "2026-01-07T16:20:00",
    author: "Alex K.",
  },
  {
    id: "5",
    source: "G2 Review",
    content:
      "FeedbackFlow has transformed how our product team works. We went from spending hours categorizing feedback to having instant insights. The sentiment trends are particularly valuable for quarterly reviews.",
    sentiment: "positive",
    topics: ["Productivity", "Analytics", "Team Collaboration"],
    severity: 1,
    summary: "Strong endorsement: Significant time savings and valuable analytics insights",
    status: "Actioned",
    timestamp: "2026-01-07T10:30:00",
    author: "Jennifer L.",
  },
  {
    id: "6",
    source: "Support Ticket",
    content:
      "Can you add integrations with Slack and Teams? It would be helpful to get notifications for high-severity feedback directly in our communication tools.",
    sentiment: "neutral",
    topics: ["Integrations", "Notifications"],
    severity: 3,
    summary: "Feature request: Slack and Teams integrations for high-severity alerts",
    status: "Acknowledged",
    timestamp: "2026-01-06T14:00:00",
    author: "David R.",
  },
  {
    id: "7",
    source: "Email",
    content:
      "The AI sometimes miscategorizes technical feedback as negative when it's actually constructive. For example, detailed bug reports get marked as complaints.",
    sentiment: "negative",
    topics: ["AI Analysis", "Sentiment Detection"],
    severity: 3,
    summary: "AI accuracy issue: Technical feedback misclassified as negative sentiment",
    status: "New",
    timestamp: "2026-01-06T11:45:00",
    author: "Rachel P.",
  },
  {
    id: "8",
    source: "Survey",
    content:
      "The dashboard is clean and easy to navigate. I particularly appreciate the filtering options - makes finding specific feedback types really quick.",
    sentiment: "positive",
    topics: ["Dashboard", "UI/UX", "Filtering"],
    severity: 1,
    summary: "Positive feedback on dashboard usability and filtering functionality",
    status: "Actioned",
    timestamp: "2026-01-05T15:30:00",
    author: "Tom W.",
  },
  {
    id: "9",
    source: "App Store Review",
    content:
      "Good product overall but pricing is steep for small teams. Would love to see a tier for teams under 10 people.",
    sentiment: "neutral",
    topics: ["Pricing", "Small Teams"],
    severity: 2,
    summary: "Pricing concern: Request for small team pricing tier (under 10 users)",
    status: "New",
    timestamp: "2026-01-05T09:00:00",
    author: "Emma S.",
  },
  {
    id: "10",
    source: "In-App Feedback",
    content:
      "Critical bug: When I filter by multiple topics simultaneously, the app shows no results even though I can see matching items in the unfiltered view.",
    sentiment: "negative",
    topics: ["Filtering", "Bugs"],
    severity: 5,
    summary: "Critical bug: Multi-topic filtering returns no results incorrectly",
    status: "New",
    timestamp: "2026-01-04T13:20:00",
    author: "Chris B.",
  },
  {
    id: "11",
    source: "Support Ticket",
    content: "The export to CSV feature is exactly what we needed for our monthly reports. Thank you for adding this!",
    sentiment: "positive",
    topics: ["Export", "Reporting"],
    severity: 1,
    summary: "Appreciation for CSV export feature enabling monthly reporting",
    status: "Actioned",
    timestamp: "2026-01-03T10:15:00",
    author: "Lisa M.",
  },
  {
    id: "12",
    source: "Twitter",
    content:
      "Is there a way to assign feedback items to specific team members? We need better task delegation features.",
    sentiment: "neutral",
    topics: ["Team Collaboration", "Task Management"],
    severity: 3,
    summary: "Feature request: Assign feedback to team members for delegation",
    status: "Acknowledged",
    timestamp: "2026-01-02T16:45:00",
    author: "@productpro",
  },
]

// Generate sentiment trend data
export const sentimentTrendData = [
  { date: "Dec 28", positive: 12, negative: 5, neutral: 8 },
  { date: "Dec 29", positive: 15, negative: 7, neutral: 6 },
  { date: "Dec 30", positive: 10, negative: 4, neutral: 9 },
  { date: "Dec 31", positive: 18, negative: 3, neutral: 7 },
  { date: "Jan 1", positive: 8, negative: 2, neutral: 5 },
  { date: "Jan 2", positive: 14, negative: 6, neutral: 8 },
  { date: "Jan 3", positive: 16, negative: 4, neutral: 7 },
  { date: "Jan 4", positive: 13, negative: 8, neutral: 9 },
  { date: "Jan 5", positive: 17, negative: 5, neutral: 6 },
  { date: "Jan 6", positive: 11, negative: 7, neutral: 10 },
  { date: "Jan 7", positive: 15, negative: 6, neutral: 8 },
  { date: "Jan 8", positive: 14, negative: 9, neutral: 7 },
]

// Topic distribution
export const topicDistributionData = [
  { topic: "UI/UX", count: 45, fill: "var(--color-chart-1)" },
  { topic: "Performance", count: 38, fill: "var(--color-chart-2)" },
  { topic: "Features", count: 32, fill: "var(--color-chart-3)" },
  { topic: "Integrations", count: 28, fill: "var(--color-chart-4)" },
  { topic: "Pricing", count: 22, fill: "var(--color-chart-5)" },
]
