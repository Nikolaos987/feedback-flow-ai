"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  Calendar,
  ExternalLink,
  MessageSquare,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeedbackItem } from "@/services/getFeedbackItem";
import { useRouter } from "next/navigation";

function SeverityBar({ severity }: { severity: number }) {
  // Each bar represents 2 points (0-10 score → 5 bars)
  const filledBars = Math.ceil(severity / 2);

  const getBarColor = (severity: number) => {
    if (severity > 8) return "bg-destructive"; // Critical
    if (severity > 6) return "bg-orange-600"; // High
    if (severity > 4) return "bg-amber-500"; // Medium
    if (severity > 2) return "bg-yellow-300"; // Low
    return "bg-muted-foreground"; // Minor
  };

  const barColor = getBarColor(severity);
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={`h-2.5 w-6 rounded-sm ${i < filledBars ? barColor : "bg-muted"}`} />
      ))}
    </div>
  );
}

function InboxItemDetail({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["feedbackItemAnalysis"],
    queryFn: () => fetchFeedbackItem(id),
    placeholderData: (prev) => prev,
  });

  if (isLoading) {
    return <div>Loading page...</div>;
  }

  if (isFetching) {
    return <div>Fetching data...</div>;
  }

  if (isError) {
    return <div>Error loading feedback</div>;
  }

  const feedbackItemAnalysis = data!;

  const original_timestamp = new Date(feedbackItemAnalysis?.feedback_item?.original_timestamp);

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
    if (severity > 8) return "text-destructive"; // Critical
    if (severity > 6) return "text-orange-600"; // High
    if (severity > 4) return "text-amber-500"; // Medium
    if (severity > 2) return "text-yellow-300"; // Low
    return "text-muted-foreground"; // Minor
  };

  const getSeverityLabel = (severity: number) => {
    if (severity > 8) return "Critical";
    if (severity > 6) return "High";
    if (severity > 4) return "Medium";
    if (severity > 2) return "Low";
    return "Minor";
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "New":
        return "text-primary bg-primary/10 border-primary/20";
      case "Acknowledged":
        return "text-warning bg-warning/10 border-warning/20";
      case "Actioned":
        return "text-success bg-success/10 border-success/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="container max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-balance">{feedbackItemAnalysis?.summary}</h1>
          </div>
          <div className="ml-11 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className={getSentimentColor(feedbackItemAnalysis?.sentiment)}>
              {feedbackItemAnalysis?.sentiment}
            </Badge>
            <Badge variant="outline" className={getStatusColor(feedbackItemAnalysis?.status)}>
              {feedbackItemAnalysis?.status}
            </Badge>
            {feedbackItemAnalysis?.severity_score > 8 && (
              <Badge
                variant="outline"
                className="text-destructive bg-destructive/10 border-destructive/20"
              >
                <AlertCircle className="mr-1 h-3 w-3" />
                {getSeverityLabel(feedbackItemAnalysis?.severity_score)} Priority
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Left 2 Columns */}
      <div className="space-y-6 lg:col-span-2">
        {/* Raw Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Feedback
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-4">
              <Link
                href={feedbackItemAnalysis?.feedback_item?.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-1 text-blue-500/60 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {feedbackItemAnalysis?.feedback_item?.source}
              </Link>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                at {original_timestamp.toDateString()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote
              className="border-primary/30 text-foreground border-l-4 py-2 pl-4 leading-relaxed
                italic"
            >
              {feedbackItemAnalysis?.feedback_item?.raw_content}
            </blockquote>
          </CardContent>
        </Card>

        {/* AI Analysis - Detailed */}
        <Card className={feedbackItemAnalysis?.severity_score > 8 ? "border-destructive/50" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-primary h-5 w-5" />
              AI Analysis
            </CardTitle>
            <CardDescription>Comprehensive feedback breakdown powered by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Sentiment */}
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Sentiment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${getSentimentColor(feedbackItemAnalysis?.sentiment)} px-3 py-1
                      text-base`}
                  >
                    {feedbackItemAnalysis?.sentiment.charAt(0).toUpperCase() +
                      feedbackItemAnalysis?.sentiment.slice(1)}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {feedbackItemAnalysis?.sentiment === "negative"
                      ? "Customer expressed frustration or dissatisfaction"
                      : feedbackItemAnalysis?.sentiment === "positive"
                        ? "Customer expressed satisfaction or appreciation"
                        : "Customer provided neutral or balanced feedback"}
                  </span>
                </div>
              </div>

              {/* Severity */}
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className={`h-4 w-4 ${getSeverityColor(feedbackItemAnalysis?.severity_score)}`}
                  />
                  <span className="text-sm font-medium">Severity Assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-2xl font-bold
                      ${getSeverityColor(feedbackItemAnalysis?.severity_score)}`}
                  >
                    {feedbackItemAnalysis?.severity_score}/10
                  </span>
                  <div className="space-y-1">
                    <SeverityBar severity={feedbackItemAnalysis?.severity_score} />
                    <span
                      className={`text-xs font-medium
                        ${getSeverityColor(feedbackItemAnalysis?.severity_score)}`}
                    >
                      {getSeverityLabel(feedbackItemAnalysis?.severity_score)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Tag className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Extracted Topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {feedbackItemAnalysis?.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Brain className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">AI Summary</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feedbackItemAnalysis?.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InboxItemDetail;
