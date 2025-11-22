"use client";

import ReportForm from "@/components/ReportForm";
import { ReportColumns } from "@/components/Table/Columns";
import { ReportsTable } from "@/components/Table/ReportsTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Report } from "@/types";
import { Authenticated, AuthLoading, useQuery } from "convex/react";
import { BarChart3, FileText, Loader2, Plus, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const reports = useQuery(api.scraping.getUserReports);
  console.log(reports);

  if (!reports) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="p-3 bg-muted/50 rounded-full mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Loading Reports</h3>
        <p className="text-muted-foreground">
          Fetching your latest analysis reports...
        </p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-muted/50 rounded-full mb-6">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by creating your first SEO analysis report. Enter a
          business name, product, or website above to begin.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Plus className="w-4 h-4" />
          <span>Create your first report to see it here</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section>
        <ReportForm />
      </section>

      <section>
        <Card className="border-0  mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle className="text-2xl">Recent Reports</CardTitle>
            </div>
            <CardDescription>
              Track the progress of your SEO analysis reports
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Authenticated>
              <ReportsTable<Report, unknown> columns={ReportColumns} data={reports} />
              {/* Summary  */}
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      {reports.length} total report
                      {reports.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {reports.filter((job) => job.status === "completed").length >
                    0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>
                        {
                          reports.filter((job) => job.status === "completed")
                            .length
                        }{" "}
                        completed
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs">Click any report to view details</div>
              </div>
            </Authenticated>
            <AuthLoading>
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
              </div>
            </AuthLoading>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
