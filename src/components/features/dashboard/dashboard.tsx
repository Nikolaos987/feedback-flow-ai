"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MessageSquare, SmilePlus, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";
import { fetchStatsCards } from "@/services/getStatsCards";
import { fetchSentimentTrendData } from "@/services/getSentimentTrendData";
import { fetchTopicDistributionData } from "@/services/getTopicDistributionData";
import { fetchHighSeverityFeedback } from "@/services/getHighSeverityFeedback";

export default function Dashboard() {
  const [statisticsQuery, sentimentChartQuery, topicDistributionQuery, highSeverityFeedbackQuery] =
    useQueries({
      queries: [
        queryOptions({
          queryFn: fetchStatsCards,
          queryKey: ["statsCards"],
        }),
        queryOptions({
          queryFn: fetchSentimentTrendData,
          queryKey: ["sentimentTrend"],
        }),
        queryOptions({
          queryFn: fetchTopicDistributionData,
          queryKey: ["topicDistribution"],
        }),
        queryOptions({
          queryFn: fetchHighSeverityFeedback,
          queryKey: ["highSeverityFeedback"],
        }),
      ],
    });

  const isLoading =
    statisticsQuery.isLoading ||
    sentimentChartQuery.isLoading ||
    topicDistributionQuery.isLoading ||
    highSeverityFeedbackQuery.isLoading;

  const isError =
    statisticsQuery.isError ||
    sentimentChartQuery.isError ||
    topicDistributionQuery.isError ||
    highSeverityFeedbackQuery.isError;

  const statisticsData = statisticsQuery?.data ?? {
    highSeverity: 0,
    negative: 0,
    positive: 0,
    totalFeedback: 0,
  };
  const sentimentData = sentimentChartQuery?.data ?? [];
  const topicDistributionData = topicDistributionQuery?.data ?? [];
  const highSeverityFeedbackData = highSeverityFeedbackQuery?.data ?? [];

  const percentageOfTotal = (value: number) =>
    statisticsData.totalFeedback > 0 ? Math.round((value / statisticsData.totalFeedback) * 100) : 0;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return timestamp;

    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-success bg-success/10 border-success/20";
      case "negative":
        return "text-destructive bg-destructive/10 border-destructive/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return "text-destructive";
    if (severity >= 5) return "text-warning";
    return "text-muted-foreground";
  };

  if (isError) {
    return (
      <div className="container max-w-7xl px-6 py-8">
        <p className="text-destructive">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of customer feedback insights and trends</p>
        {isLoading ? (
          <p className="text-muted-foreground mt-1 text-sm">Loading latest data...</p>
        ) : null}
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statisticsData.totalFeedback}</div>
            <p className="text-muted-foreground mt-1 text-xs">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <SmilePlus className="text-success h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statisticsData.positive}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {percentageOfTotal(statisticsData.positive)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
            <TrendingUp className="text-destructive h-4 w-4 rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statisticsData.negative}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {percentageOfTotal(statisticsData.negative)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertCircle className="text-destructive h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statisticsData.highSeverity}</div>
            <p className="text-muted-foreground mt-1 text-xs">Severity 7-10</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
            <CardDescription>Feedback sentiment over the past 2 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="var(--success)"
                  strokeWidth={2}
                  name="Positive"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="var(--destructive)"
                  strokeWidth={2}
                  name="Negative"
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="var(--muted-foreground)"
                  strokeWidth={1}
                  name="Neutral"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Distribution</CardTitle>
            <CardDescription>Most common feedback topics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicDistributionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="topic"
                  className="text-xs"
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {topicDistributionQuery.data?.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.topic}-${index}`}
                      fill={`var(--color-chart-${entry?.fillKey})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* High Severity Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>High Severity Feedback</CardTitle>
          <CardDescription>
            Critical and urgent issues requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {highSeverityFeedbackData.length === 0 ? (
            <p className="text-muted-foreground text-sm">No high severity feedback found.</p>
          ) : (
            <div className="space-y-4">
              {highSeverityFeedbackData.map((feedback) => (
                <Link key={feedback.id} href={`/app/inbox/${feedback.id}`}>
                  <div
                    className={`hover:bg-muted/50 flex cursor-pointer items-start gap-4 rounded-lg
                      border p-4 transition-colors`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className={getSentimentColor(feedback.sentiment)}>
                          {feedback.sentiment}
                        </Badge>
                        <span
                          className={`text-sm font-semibold ${getSeverityColor(feedback.severity)}`}
                        >
                          Severity {feedback.severity}
                        </span>
                        <span className="text-muted-foreground text-sm">&bull;</span>
                        <span className="text-muted-foreground text-sm">{feedback.source}</span>
                      </div>
                      <p className="mb-1 text-sm font-medium">{feedback.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {feedback.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatTimestamp(feedback.timestamp)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
