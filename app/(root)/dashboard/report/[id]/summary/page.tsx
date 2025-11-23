"use client";

import React, { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Protect } from "@clerk/nextjs";
import { SeoReport } from "@/lib/schema";
import {
  AdditionalAnalysisGrid,
  CompetitorStrengthCard,
  KeyInsightsGrid,
  KeyMetricsGrid,
  KeywordsAnalysisGrid,
  OverallScoreCard,
  RecommendationsCard,
  SourceDistributionChart,
  SummaryHeader,
} from "@/components/Summary/ui";
import AIChat from "@/components/Aichat";
// import AIChat from "@/components/AIChat";

interface ReportSummaryProps {
  params: Promise<{ id: string }>;
}

export default function ReportSummary({ params }: ReportSummaryProps) {
  const { id } = use(params);

  const report = useQuery(api.scraping.GetReportBySnapshotId, {
    snapshotId: id
    });

  const seoReport = report?.seoReport as SeoReport | undefined;

  if (report === undefined) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="loading-text">Loading SEO report...</p>
        </div>
      </div>
    );
  }

  if (report === null) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground">
            The requested SEO report could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (!seoReport) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground">
            The requested SEO report could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-dashboard">
      <SummaryHeader seoReport={seoReport} id={id} />

      <div className="container-main space-y-8 lg:space-y-12">
        <OverallScoreCard seoReport={seoReport} />
        <KeyMetricsGrid seoReport={seoReport} />

        <Protect plan="pro" >
          <AIChat seoReportId={id} />
        </Protect>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <SourceDistributionChart seoReport={seoReport} />
          <CompetitorStrengthCard seoReport={seoReport} />
        </div>

        <RecommendationsCard seoReport={seoReport} />
        <KeywordsAnalysisGrid seoReport={seoReport} />
        <KeyInsightsGrid seoReport={seoReport} />
        <AdditionalAnalysisGrid seoReport={seoReport} />
      </div>
    </div>
  );
}
