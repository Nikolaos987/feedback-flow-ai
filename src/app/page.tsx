// "use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Brain, Inbox, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/commons/navbar";
import Footer from "@/components/commons/footer";

export default function Home() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-linear-to-b">
      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 py-24">
        <div className="flex flex-col items-center gap-8 text-center">
          <div
            className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4
              py-2 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Feedback Analysis
          </div>
          <h1
            className="max-w-4xl text-5xl font-bold tracking-tight text-balance md:text-6xl
              lg:text-7xl"
          >
            Turn Customer Feedback Into Product Clarity
          </h1>
          <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed text-balance">
            Stop drowning in scattered feedback. FeedbackFlow AI automatically analyzes,
            categorizes, and prioritizes customer insights so your team can focus on what matters
            most.
          </p>
          <div className="flex gap-4">
            <Link href="/app/dashboard">
              <Button size="lg" className="gap-2">
                View Demo Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <Card className="bg-muted/50 p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">The Feedback Problem</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Customer feedback is scattered across support tickets, reviews, social media, and
              surveys. Product teams waste hours manually reading, categorizing, and prioritizing
              insights. Critical issues get lost in the noise, and opportunities slip through the
              cracks.
            </p>
          </div>
        </Card>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto max-w-7xl px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground text-xl">Three simple steps to actionable insights</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-8 text-center">
            <div
              className="bg-primary/10 text-primary mb-6 inline-flex h-16 w-16 items-center
                justify-center rounded-full"
            >
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">1. Ingest</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect your feedback sources. We automatically collect and centralize customer
              feedback from all your channels.
            </p>
          </Card>
          <Card className="p-8 text-center">
            <div
              className="bg-primary/10 text-primary mb-6 inline-flex h-16 w-16 items-center
                justify-center rounded-full"
            >
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">2. AI Analyze</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our AI instantly analyzes sentiment, extracts topics, assigns severity scores, and
              generates concise summaries.
            </p>
          </Card>
          <Card className="p-8 text-center">
            <div
              className="bg-primary/10 text-primary mb-6 inline-flex h-16 w-16 items-center
                justify-center rounded-full"
            >
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">3. Dashboard</h3>
            <p className="text-muted-foreground leading-relaxed">
              Review insights in a clean dashboard. Filter, sort, and triage feedback with full
              context to make data-driven decisions.
            </p>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 container mx-auto max-w-7xl px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground text-xl">
            Everything you need to understand your customers
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Sentiment Analysis",
              desc: "Automatically detect positive, negative, and neutral feedback",
            },
            {
              title: "Topic Extraction",
              desc: "AI identifies key themes and categories in your feedback",
            },
            { title: "Severity Scoring", desc: "Prioritize issues with 1-5 severity ratings" },
            { title: "Smart Filtering", desc: "Filter by sentiment, topic, severity, and status" },
            {
              title: "Trend Analytics",
              desc: "Track sentiment trends and topic distribution over time",
            },
            { title: "Action Tracking", desc: "Mark feedback as New, Acknowledged, or Actioned" },
          ].map((feature, i) => (
            <Card key={i} className="bg-background p-6">
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-7xl px-4 py-24">
        <Card className="bg-primary text-primary-foreground p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Transform Your Feedback?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            See how FeedbackFlow AI can help your team turn scattered feedback into clear,
            actionable insights.
          </p>
          <Link href="/app/dashboard">
            <Button size="lg" variant="secondary" className="gap-2">
              View Demo Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>
      <Footer />
    </div>
  );
}
