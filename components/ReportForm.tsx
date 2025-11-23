"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { CountrySelector } from "@/components/country-selector";
import { toast } from "sonner";
import { Scrape } from "@/lib/actions/scrape.action";
import { Country } from "@/types";
import { useRouter } from "next/navigation";

const ReportForm = () => {
  const [prompt, setPrompt] = useState("");
  const [country, setCountry] = useState<Country>("US");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await Scrape({ prompt, country });
      if (result?.ok) {
        const snapshotId = result.data.snapshot_id;
        router.push(`/dashboard/report/${snapshotId}`)
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong please try later !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-dashboard">
      <div className="container-main">
        <div className="space-y-8">
          <Card className="report-form ">
            {/* decorations */}
            <div className="report-form-decoration1 " />
            <div className="report-form-decoration2" />

            <CardHeader className="text-center pb-6 relative">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-linear-to-br from-primary  to-secondary text-white shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <CardTitle className="report-form-title">
                  Create New Report
                </CardTitle>
              </div>
              <CardDescription className="report-form-description">
                Enter a business name, product, or website to generate a
                <span className="font-semibold text-foreground">
                  {" "}
                  comprehensive SEO analysis
                </span>{" "}
                powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="report-form-file-icon">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter a Name / Business / Product / Website etc."
                      className="report-form-input"
                      disabled={isLoading}
                    />
                  </div>

                  <CountrySelector
                    value={country}
                    onValueChange={setCountry}
                    disabled={isLoading}
                  />

                  <div>
                    <Button
                      type="submit"
                      size="lg"
                      className="report-form-button group"
                      disabled={isLoading || !prompt.trim()}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                          <span className="hidden lg:inline">
                            Generating Report...
                          </span>
                          <span className="lg:hidden">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="hidden lg:inline">
                            Generate Report
                          </span>
                          <span className="lg:hidden">Generate</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                  <div className="feature-highlight-item">
                    <div className="feature-highlight-dot bg-green-500"></div>
                    <span>AI-Powered Analysis</span>
                  </div>
                  <div className="feature-highlight-item">
                    <div className="feature-highlight-dot bg-blue-500"></div>
                    <span>Real-time Data</span>
                  </div>
                  <div className="feature-highlight-item">
                    <div className="feature-highlight-dot bg-purple-500"></div>
                    <span>Comprehensive Insights</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
