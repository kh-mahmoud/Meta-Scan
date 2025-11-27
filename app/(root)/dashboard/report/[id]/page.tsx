"use client";

import { useEffect, useState, useTransition } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  getSpinnerColor,
  getProgressPercentage,
  getProgressBarStyle,
  getReportTitle,
  getStatusMessage,
  formatDateTime,
} from "@/lib/utils";
import { Scrape } from "@/lib/actions/scrape.action";
import StatusBadge from "@/components/Status-Badge";


export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [retryError, setRetryError] = useState<string | null>(null);
  const router = useRouter();

  //get the report
  const report = useQuery(api.scraping.GetReportBySnapshotId, {
    snapshotId: id || "skip"
  });

 //get thereport snapshot
  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  const handleRetry = () => {
    if (!report) return;

    setRetryError(null);

    startTransition(async () => {
      try {
        const result = await Scrape({prompt:report.scrapePrompt,reportId:report._id});
        if (result?.ok) {
          if (result.smartRetry) {
            // Smart retry - the report scraping was a success but the analysis failed 
            console.log("Smart retry initiated - staying on current page");
            // Don't navigate anywhere, just let the page update via real-time data
            return; 
          } else if (result.data?.snapshot_id) {
            // Full retry - the report scraping and analysis were both failed so we launch new scraping 
            router.replace(`/dashboard/report/${result.data.snapshot_id}`);
            return; // Explicitly return to complete the transition
          }
        } else {
          setRetryError(result?.error || "Failed to retry report");
        }
      } catch (error) {
        setRetryError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      }
    });
  };

  if (!id) {
    return (
      <div className="loading-container">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="loading-text">Loading...</span>
      </div>
    );
  }

  if (report === undefined) {
    return (
      <div className="loading-container">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="loading-text">Loading report status...</span>
      </div>
    );
  }

  if (report === null) {
    return (
      <div className="loading-container">
        <AlertCircle className="w-6 h-6 text-destructive mr-2" />
        <span className="text-destructive">Report not found</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-dashboard">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="section-title">
              Report Status
            </h1>
            <p className="section-description">
              Track the progress of your SEO report generation
            </p>
          </div>

          {/* Status Card */}
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center justify-center mb-4">
                {(report.status === "pending" ||
                  report.status === "running" ||
                  report.status === "analyzing") && (
                  <Loader2
                    className={`w-5 h-5 animate-spin mb-2 ${getSpinnerColor(report.status)}`}
                  />
                )}
                <StatusBadge status={report.status} showIcon={true} />
              </div>
              <CardTitle className="text-xl">
                {getReportTitle(report.status)}
              </CardTitle>
              <CardDescription className="text-base">
                {getStatusMessage(report.status)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {getProgressPercentage(report.status)}
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className={`progress-bar-fill ${getProgressBarStyle(report.status)}`}
                  />
                </div>
              </div>

              {/* report Details */}
              <div className="space-y-4 pt-4 border-t">
                <div className="report-details-grid">
                  <div className="report-detail-item">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Original Query</p>
                       <p className="text-sm text-muted-foreground truncate w-40">
                        {report.scrapePrompt}
                      </p>
                    </div>
                  </div>

                  <div className="report-detail-item">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(report.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {report.completedAt && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(report.completedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {report.snapshotId && (
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Snapshot ID</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {report.snapshotId}
                      </p>
                    </div>
                  </div>
                )}

                {report.error && (
                  <div className="alert-error">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-error-title">
                          Error Details
                        </p>
                        <p className="text-error-content mt-1">
                          {report.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Preview */}
              {report.status === "completed" &&
                report.results &&
                report.results.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Results Available
                      </p>
                    </div>
                    <div className="alert-success">
                      <p className="text-success-content">
                        Your SEO report is ready for analysis.
                      </p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="action-buttons-container">
            {report.status === "completed" && (
              <Link href={`/dashboard/report/${id}/summary`}>
                <Button
                  variant="default"
                  size="lg"
                  className="cursor-pointer button-gradient-green"
                >
                  View Full Report
                </Button>
              </Link>
            )}

            {report.status === "failed" && (
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="default"
                  size="lg"
                  className="cursor-pointer"
                  onClick={handleRetry}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Retrying...
                    </>
                  ) : (
                    "Retry Report"
                  )}
                </Button>
                {retryError && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {retryError}
                  </p>
                )}
              </div>
            )}

            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="cursor-pointer">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
