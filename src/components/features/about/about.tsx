import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Users, Database, GitBranch, Sparkles, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">About FeedbackFlow AI</h1>
        <p className="text-muted-foreground">
          AI-powered customer feedback analysis for modern product teams
        </p>
      </div>

      <div className="space-y-6">
        {/* Purpose */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center
                justify-center rounded-lg"
            >
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold">Project Purpose</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                FeedbackFlow AI was built to demonstrate how modern AI pipelines can transform raw,
                unstructured customer feedback into clear, actionable product insights. The core
                idea is simple: instead of manually reading through hundreds of support tickets,
                reviews, or GitHub issues, let an AI do the heavy lifting — extract sentiment,
                identify recurring topics, score severity, and surface what needs attention first.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This project also serves as a full-stack showcase of building real-time AI workflows
                using Next.js, Inngest for background job orchestration, Gemini AI for analysis, and
                Prisma with PostgreSQL for persistence — all wired together in a production-grade
                architecture.
              </p>
            </div>
          </div>
        </Card>

        {/* Demo Data Source */}
        <Card className="border-primary/20 bg-primary/5 p-6">
          <div className="flex items-start gap-4">
            <div
              className="bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center
                justify-center rounded-lg"
            >
              <Database className="h-6 w-6" />
            </div>
            <div className="w-full">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">Demo Data Source</h2>
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                  Live Data
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                For this demo, FeedbackFlow AI ingests real issues from the{" "}
                <strong className="text-foreground">Microsoft TypeScript GitHub repository</strong>.
                TypeScript is one of the most active open-source projects on GitHub, making it an
                ideal source of diverse, real-world feedback — from bug reports to feature requests
                to performance concerns.
              </p>

              <div className="bg-background rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <GitBranch className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Data Pipeline</span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      step: "1",
                      label: "Fetch",
                      desc: "GitHub Issues API pulls the latest 10 issues from microsoft/typescript daily at 8AM via an Inngest cron job",
                    },
                    {
                      step: "2",
                      label: "Store",
                      desc: "Issues are upserted into PostgreSQL as FeedbackItems, deduplicated by external ID and source",
                    },
                    {
                      step: "3",
                      label: "Analyze",
                      desc: "Each unanalyzed issue is sent to Gemini AI, which extracts sentiment, topics, a severity score (1–10), and a plain-English summary",
                    },
                    {
                      step: "4",
                      label: "Display",
                      desc: "Results are surfaced in the Dashboard and Inbox with full filtering, sorting, and pagination",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div
                        className="bg-primary/10 text-primary flex h-6 w-6 flex-shrink-0
                          items-center justify-center rounded-full text-xs font-bold"
                      >
                        {item.step}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        <strong className="text-foreground">{item.label}:</strong> {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["GitHub Issues API", "Inngest Cron", "Gemini AI", "PostgreSQL", "Prisma"].map(
                  (tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Who it's for */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center
                justify-center rounded-lg"
            >
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold">Who It's For</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 font-medium">Product Teams</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Discover patterns in feature requests, identify critical bugs faster, and make
                    data-driven decisions based on real customer sentiment trends.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Customer Success Teams</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Triage feedback more efficiently, spot emerging issues before they escalate, and
                    track which customer concerns have been addressed.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Engineering Teams</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get clear signal on technical issues, prioritize bug fixes based on severity and
                    impact, and validate that deployed fixes actually improve customer satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Features */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center
                justify-center rounded-lg"
            >
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold">Key Features</h2>
              <ul className="text-muted-foreground space-y-2">
                {[
                  {
                    title: "Automatic Sentiment Analysis",
                    desc: "Instantly understand if feedback is positive, negative, or neutral",
                  },
                  {
                    title: "Intelligent Topic Extraction",
                    desc: "AI identifies themes and categories without manual tagging",
                  },
                  {
                    title: "Severity Scoring",
                    desc: "1–10 scale prioritization helps you focus on critical issues first",
                  },
                  {
                    title: "Smart Filtering & Search",
                    desc: "Find specific feedback types instantly with multi-criteria filtering",
                  },
                  {
                    title: "Trend Analytics",
                    desc: "Track sentiment changes and topic distribution over time",
                  },
                  {
                    title: "Status Tracking",
                    desc: "Mark feedback as New, Acknowledged, or Actioned to maintain accountability",
                  },
                ].map((feature) => (
                  <li key={feature.title} className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">{feature.title}:</strong> {feature.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Tech stack note */}
        <Card className="bg-muted/50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">Built With</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js 16",
              "TypeScript",
              "Prisma",
              "PostgreSQL",
              "Better Auth",
              "Inngest",
              "Gemini AI",
              "TanStack Query",
              "Tailwind CSS",
              "Recharts",
            ].map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
