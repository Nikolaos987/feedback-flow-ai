"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeedbackAnalyses } from "@/services/getFeedbackAnalyses";
import { Filtering } from "@/types/Data/filters";
import SelectWrapper from "@/components/commons/SelectWrapper";
import { FeedbackAnalysis, FiltersMap } from "@/types/FeedbackAi/feedbackAi";
import TopicsMultiSelect from "@/components/commons/TopicsMultiSelect";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Inbox() {
  const [filters, setFilters] = useState<Filtering>({});
  const sortField = filters.sortField;
  const sortOrder = filters.sortOrder;

  type SortField = NonNullable<Filtering["sortField"]>;
  type SortOrder = NonNullable<Filtering["sortOrder"]>;
  const defaultSortOrder: Record<SortField, SortOrder> = {
    timestamp: "desc",
    severity: "desc",
    sentiment: "desc",
  };

  const toggleSort = (field: SortField) => {
    setFilters((prev) => {
      const isSameField = prev.sortField === field;
      const nextOrder: SortOrder = isSameField
        ? prev.sortOrder === "asc"
          ? "desc"
          : "asc"
        : defaultSortOrder[field];

      return { ...prev, sortField: field, sortOrder: nextOrder };
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedbackAnalyses", filters],
    queryFn: () => fetchFeedbackAnalyses({ filters }),
    placeholderData: (prev) => prev,
  });

  const inboxItems: FeedbackAnalysis[] = data?.data;
  const search: FiltersMap = data?.search;

  const severityValues = useMemo(() => {
    const raw = search?.severity ?? [];
    return raw
      .map((item) => (typeof item.value === "number" ? item.value : Number(item.value)))
      .filter((value) => Number.isFinite(value)) as number[];
  }, [search?.severity]);

  const [minSeverity, maxSeverity] = useMemo<[number, number]>(() => {
    if (severityValues.length === 0) return [0, 10];
    return [Math.min(...severityValues), Math.max(...severityValues)];
  }, [severityValues]);

  const defaultSeverityRange = useMemo<[number, number]>(
    () => [minSeverity, maxSeverity],
    [minSeverity, maxSeverity],
  );

  const effectiveSeverityRange = filters.severityRange ?? defaultSeverityRange;
  const [sliderValue, setSliderValue] = useState<[number, number]>(effectiveSeverityRange);

  useEffect(() => {
    setSliderValue(effectiveSeverityRange);
  }, [effectiveSeverityRange[0], effectiveSeverityRange[1]]);

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
                value={filters["sentiment"] ?? "all"}
                onValueChange={(val: string) =>
                  setFilters((prev) => ({ ...prev, sentiment: val === "all" ? undefined : val }))
                }
                items={search?.sentiment}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <SelectWrapper
                value={filters.status || "all"}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, status: val === "all" ? undefined : val }))
                }
                items={search?.status}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <div className="space-y-2">
                <Slider
                  min={minSeverity}
                  max={maxSeverity}
                  step={1}
                  value={sliderValue}
                  onValueChange={(val) => setSliderValue(val as [number, number])}
                  onValueCommit={(val) => {
                    const [min, max] = val as [number, number];
                    const isDefault =
                      min === defaultSeverityRange[0] && max === defaultSeverityRange[1];
                    setFilters((prev) => ({
                      ...prev,
                      severityRange: isDefault ? undefined : [min, max],
                    }));
                  }}
                />
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>{minSeverity}</span>
                  <span>
                    {sliderValue[0]} - {sliderValue[1]}
                  </span>
                  <span>{maxSeverity}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topics</label>
              <TopicsMultiSelect
                items={search?.topics}
                value={filters?.topics ?? []}
                onChange={(topics) =>
                  setFilters((prev) => ({
                    ...prev,
                    topics,
                    // topic: undefined,
                  }))
                }
                placeholder="All Topics"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("timestamp")}
              className={sortField === "timestamp" ? "bg-muted" : ""}
              aria-pressed={sortField === "timestamp"}
            >
              <ArrowUpDown className="mr-1 h-3 w-3" />
              Date{sortField === "timestamp" ? ` ${sortOrder === "asc" ? "↑" : "↓"}` : ""}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("severity")}
              className={sortField === "severity" ? "bg-muted" : ""}
              aria-pressed={sortField === "severity"}
            >
              <ArrowUpDown className="mr-1 h-3 w-3" />
              Severity{sortField === "severity" ? ` ${sortOrder === "asc" ? "↑" : "↓"}` : ""}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("sentiment")}
              className={sortField === "sentiment" ? "bg-muted" : ""}
              aria-pressed={sortField === "sentiment"}
            >
              <ArrowUpDown className="mr-1 h-3 w-3" />
              Sentiment{sortField === "sentiment" ? ` ${sortOrder === "asc" ? "↑" : "↓"}` : ""}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-3">
        {inboxItems?.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-12 text-center">
              No feedback matches your filters. Try adjusting your criteria.
            </CardContent>
          </Card>
        ) : (
          inboxItems?.map((feedback) => {
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
