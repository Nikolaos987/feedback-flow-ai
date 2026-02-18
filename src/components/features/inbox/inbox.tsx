"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockFeedback, type Sentiment, type Status } from "@/lib/mock-data";
import { ArrowUpDown, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeedbackAnalyses } from "@/services/getFeedbackAnalyses";

type SortField = "timestamp" | "severity" | "sentiment";
type SortOrder = "asc" | "desc";

export default function Inbox() {
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedbackAnalyses"],
    queryFn: fetchFeedbackAnalyses,
  });

  // Get all unique topics
  const allTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    mockFeedback.forEach((f) => f.topics.forEach((t) => topicsSet.add(t)));
    return Array.from(topicsSet).sort();
  }, []);

  // Filter and sort feedback
  const filteredAndSortedFeedback = useMemo(() => {
    const filtered = mockFeedback.filter((feedback) => {
      if (sentimentFilter !== "all" && feedback.sentiment !== sentimentFilter) return false;
      if (statusFilter !== "all" && feedback.status !== statusFilter) return false;
      if (severityFilter !== "all" && feedback.severity.toString() !== severityFilter) return false;
      if (topicFilter !== "all" && !feedback.topics.includes(topicFilter)) return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "timestamp":
          comparison = 1; // a.timestamp.getTime() - b.timestamp.getTime();
          break;
        case "severity":
          comparison = a.severity - b.severity;
          break;
        case "sentiment":
          const sentimentOrder = { negative: 0, neutral: 1, positive: 2 };
          comparison = sentimentOrder[a.sentiment] - sentimentOrder[b.sentiment];
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [sentimentFilter, statusFilter, severityFilter, topicFilter, sortField, sortOrder]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return "text-destructive font-semibold";
    if (severity >= 5) return "text-warning font-medium";
    return "text-muted-foreground";
  };

  return (
    <div className="container max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Feedback Inbox</h1>
        <p className="text-muted-foreground">Review and triage customer feedback</p>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {data?.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-12 text-center">
              No feedback matches your filters. Try adjusting your criteria.
            </CardContent>
          </Card>
        ) : (
          data?.map((feedback) => {
            const original_timestamp = new Date(feedback.feedback_item?.original_timestamp);
            return (
              <Link key={feedback.id} href={`/app/inbox/${feedback.id}`} className="block">
                <Card
                  className={`group cursor-pointer transition-colors ${
                    feedback.severity_score >= 7
                      ? "border-destructive/30 bg-destructive/2 hover:bg-destructive/5"
                      : "hover:bg-muted/50"
                    }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {feedback.severity_score >= 7 && (
                        <div
                          className="bg-destructive/10 text-destructive flex h-9 w-9 shrink-0
                            items-center justify-center rounded-full text-sm font-bold"
                        >
                          {feedback.severity_score}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getSentimentColor(feedback.sentiment)}
                          >
                            {feedback.sentiment}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(feedback.status)}>
                            {feedback.status}
                          </Badge>
                          <span className={`text-sm ${getSeverityColor(feedback.severity_score)}`}>
                            Severity {feedback.severity_score}
                          </span>
                          <span className="text-muted-foreground text-sm">•</span>
                          <span className="text-muted-foreground text-sm">
                            {feedback.feedback_item?.source}
                          </span>
                          {feedback.feedback_item?.source && (
                            <>
                              <span className="text-muted-foreground text-sm">•</span>
                              <span className="text-muted-foreground text-sm">
                                {feedback.feedback_item?.source}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="group-hover:text-primary mb-2 font-medium transition-colors">
                          {feedback.summary}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {feedback.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm whitespace-nowrap">
                        {original_timestamp.toISOString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
