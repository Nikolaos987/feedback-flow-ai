"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeedbackAnalyses } from "@/services/getFeedbackAnalyses";
import { Filtering } from "@/types/Data/filters";

export default function Inbox() {
  const [filters, setFilters] = useState<Filtering>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedbackAnalyses", filters],
    queryFn: () => fetchFeedbackAnalyses({ filters }),
  });

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

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Sorting
              </CardTitle>
              <CardDescription className="mt-1">
                {[].length} of {[].length} items
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sentiment</label>
              <Select
                value={filters.sentiment || "all"}
                onValueChange={(val: string) =>
                  setFilters((prev) => ({ ...prev, sentiment: val === "all" ? undefined : val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || "all"}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, status: val === "all" ? undefined : val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="Actioned">Actioned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select
                value={String(filters.severity || "all")}
                onValueChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    severity: val === "all" ? undefined : Number(val),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                {/* @TODO make this filter with a range selector */}
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="10">Severity 10 (Critical)</SelectItem>
                  <SelectItem value="9">Severity 9 (Critical)</SelectItem>
                  <SelectItem value="8">Severity 8 (High)</SelectItem>
                  <SelectItem value="7">Severity 7 (High)</SelectItem>
                  <SelectItem value="6">Severity 6 (Medium)</SelectItem>
                  <SelectItem value="5">Severity 5 (Medium)</SelectItem>
                  <SelectItem value="4">Severity 4 (Low)</SelectItem>
                  <SelectItem value="3">Severity 3 (Low)</SelectItem>
                  <SelectItem value="2">Severity 2 (Minor)</SelectItem>
                  <SelectItem value="1">Severity 1 (Minor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
                        {original_timestamp.toDateString()}
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
