"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { SeoReport } from "@/lib/schema";

interface KeyInsightsGridProps {
  seoReport: SeoReport;
}

export function KeyInsightsGrid({ seoReport }: KeyInsightsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Strengths */}
      <Card className="border bg-gradient-card">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="icon-wrapper-base icon-wrapper-gradient-green">
              <CheckCircle className="h-6 w-6 text-green-metric" />
            </div>
            <div>
              <CardTitle className="text-2xl text-green-metric">
                Key Strengths
              </CardTitle>
              <CardDescription className="text-base">
                Areas where you&apos;re re performing well
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(seoReport?.summary?.key_strengths || []).map(
              (strength, index) => (
                <div
                  key={index}
                  className="insight-card-green group"
                >
                  <div className="flex items-start gap-3">
                    <div className="icon-wrapper-backdrop text-green-metric">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-insight-green">
                        {strength}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
            {(!seoReport?.summary?.key_strengths ||
              seoReport.summary.key_strengths.length === 0) && (
              <div className="text-center py-8 bg-muted/20 rounded-xl">
                <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No strengths identified yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues */}
      <Card className="border bg-gradient-card">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="icon-wrapper-base icon-wrapper-gradient-red">
              <AlertTriangle className="h-6 w-6 text-red-metric" />
            </div>
            <div>
              <CardTitle className="text-2xl text-red-metric">
                Critical Issues
              </CardTitle>
              <CardDescription className="text-base">
                Urgent problems requiring attention
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(seoReport?.summary?.critical_issues || []).map((issue, index) => (
              <div
                key={index}
                className="insight-card-red group"
              >
                <div className="flex items-start gap-3">
                  <div className="icon-wrapper-backdrop text-red-metric">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-insight-red">
                      {issue}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(!seoReport?.summary?.critical_issues ||
              seoReport.summary.critical_issues.length === 0) && (
              <div className="text-center py-8 bg-muted/20 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No critical issues found.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card className="border bg-gradient-card">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="icon-wrapper-base icon-wrapper-gradient-blue">
              <TrendingUp className="h-6 w-6 text-blue-metric" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-metric">
                Quick Wins
              </CardTitle>
              <CardDescription className="text-base">
                Easy improvements for immediate impact
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(seoReport?.summary?.quick_wins || []).map((win, index) => (
              <div
                key={index}
                className="insight-card-blue group"
              >
                <div className="flex items-start gap-3">
                  <div className="icon-wrapper-backdrop text-blue-metric">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-insight-blue">
                      {win}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(!seoReport?.summary?.quick_wins ||
              seoReport.summary.quick_wins.length === 0) && (
              <div className="text-center py-8 bg-muted/20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No quick wins identified yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}