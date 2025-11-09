import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { buildAnalysisPrompt } from "@/lib/utils";

//start the analysis
export const runAnalysis = internalAction({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    console.log("Starting AI analysis for job:", args.reportId);

    try {
      // Get the scraped Data 
      const report = await ctx.runQuery(api.scraping.GetReportById, {
        reportId: args.reportId,
      });

      if (!report) {
        console.error(`No report found for report ID: ${args.reportId}`);
        return null;
      }

      if (!report.results || report.results.length === 0) {
        await ctx.runMutation(api.scraping.failJob, {
          reportId: args.reportId,
          error: "No scraping results available for analysis",
        });
        return null;
      }

      // Set scrape status to analyzing
      await ctx.runMutation(api.scraping.setJobToAnalyzing, {
        reportId: args.reportId,
      });

      // Step 1: Generate comprehensive SEO report using structured output
      const scrapingData = Array.isArray(report.results)? report.results: [report.results];
        const analysisPrompt = buildAnalysisPrompt(scrapingData);
        
      console.log("Generating SEO report for job:", args.reportId);

      // Save prompt into the database for debugging
      await ctx.runMutation(internal.scraping.SaveAnalysisPrompt, {
        reportId: args.reportId,
        prompt: analysisPrompt,
      });

      console.log("Prompt saved for job:", args.reportId);

    //   const { object: seoReport } = await generateObject({
    //     model: openai("gpt-4o"),
    //     system: systemPrompt(),
    //     prompt: analysisPrompt,
    //     schema: seoReportSchema,
    //   });

    //   console.log("SEO report generated successfully:", {
    //     entity_name: seoReport.meta.entity_name,
    //     entity_type: seoReport.meta.entity_type,
    //     confidence_score: seoReport.meta.confidence_score,
    //     total_sources: seoReport.inventory.total_sources,
    //     recommendations_count: seoReport.recommendations?.length || 0,
    //     summary_score: seoReport.summary?.overall_score || 0,
    //   });

      // Step 2: Save the SEO report to the database
    //   await ctx.runMutation(internal.scrapingJobs.saveSeoReport, {
    //     jobId: args.jobId,
    //     seoReport: seoReport,
    //   });

    //   console.log("SEO report saved for job:", args.jobId);

      // Step 3: Complete the job (mark as completed)
    //   await ctx.runMutation(internal.scrapingJobs.completeJob, {
    //     jobId: args.jobId,
    //   });

    //   console.log(`Job ${args.jobId} analysis completed successfully`);

      return null;
    } catch (error) {
    //   console.error("Analysis error for job:", args.jobId, error);

      // Set job status to failed when analysis fails
    //   try {
    //     await ctx.runMutation(api.scrapingJobs.failJob, {
    //       jobId: args.jobId,
    //       error:
    //         error instanceof Error
    //           ? error.message
    //           : "Unknown error occurred during analysis",
    //     });
    //     console.log(`Job ${args.jobId} marked as failed due to analysis error`);
    //   } catch (failError) {
    //     console.error("Failed to update job status to failed:", failError);
    //   }

      // If it's a schema validation error, provide more specific feedback
      if (error instanceof Error && error.message.includes("schema")) {
        console.error("Schema validation failed - AI response incomplete");
        console.error("Error details:", error.message);
      }

      return null;
    }
  },
});


//redo the analysis
export const retryAnalysis = action({
  args: {
    reportId: v.id("reports"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("Retrying analysis only for job:", args.reportId);

    // Reset analysis status 
    await ctx.runMutation(internal.scraping.RetryAnalysisState, {
      reportId: args.reportId,
    });

    // Run the analysis
    await ctx.runAction(internal.analysis.runAnalysis, {
      reportId: args.reportId,
    });

    return null;
  },
});