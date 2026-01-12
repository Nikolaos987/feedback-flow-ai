import { Sparkles } from "lucide-react";
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="text-primary h-5 w-5" />
            FeedbackFlow AI
          </div>
          <p className="text-muted-foreground text-sm">
            © {currentYear} FeedbackFlow AI. Built for product and customer success teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
