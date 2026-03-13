"use client";

import { use, useState } from "react";
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
import { mockFeedback, type Status } from "@/lib/mock-data";
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  Calendar,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Share2,
  Tag,
  TrendingUp,
  User,
  FileDown,
  Eye,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeedbackItem } from "@/services/getFeedbackItem";
function InboxItemDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedbackItem"],
    queryFn: () => fetchFeedbackItem(id),
    placeholderData: (prev) => prev,
  });

  return <div>hello {id}</div>;
}

export default InboxItemDetail;
