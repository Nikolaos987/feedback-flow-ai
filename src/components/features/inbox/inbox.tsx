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
import SelectWrapper from "@/components/commons/SelectWrapper";

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
              <SelectWrapper
                value={filters.sentiment || "all"}
                onValueChange={(val: string) =>
                  setFilters((prev) => ({ ...prev, sentiment: val === "all" ? undefined : val }))
                }
                items={[
                  { value: "all", label: "All Sentiments" },
                  { value: "positive", label: "Positive" },
                  { value: "negative", label: "Negative" },
                  { value: "neutral", label: "Neutral" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <SelectWrapper
                value={filters.status || "all"}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, status: val === "all" ? undefined : val }))
                }
                items={[
                  { value: "all", label: "All Statuses" },
                  { value: "New", label: "New" },
                  { value: "Acknowledged", label: "Acknowledged" },
                  { value: "Actioned", label: "Actioned" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              {/* @TODO make this filter with a range selector */}
              <SelectWrapper
                value={String(filters.severity || "all")}
                onValueChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    severity: val === "all" ? undefined : Number(val),
                  }))
                }
                items={[
                  { value: "all", label: "All Severities" },
                  { value: "10", label: "Severity 10 (Critical)" },
                  { value: "9", label: "Severity 9 (Critical" },
                  { value: "8", label: "Severity 8 (High)" },
                  { value: "7", label: "Severity 7 (High)" },
                  { value: "6", label: "Severity 6 (Medium)" },
                  { value: "5", label: "Severity 5 (Medium)" },
                  { value: "4", label: "Severity 4 (Low)" },
                  { value: "3", label: "Severity 3 (Low)" },
                  { value: "2", label: "Severity 2 (Minor)" },
                  { value: "1", label: "Severity 1 (Minor)" },
                ]}
              />
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
