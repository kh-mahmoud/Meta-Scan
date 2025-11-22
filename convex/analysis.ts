import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { generateObject } from 'ai';
import { seoReportSchema } from "@/lib/schema";
import { google } from '@ai-sdk/google';
import { buildAnalysisPrompt, systemPrompt } from "@/lib/prompts";


//start the analysis
export const runAnalysis = action({
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
      const scrapingData = Array.isArray(report.results)
        ? report.results
        : [report.results];

      const analysisPrompt = buildAnalysisPrompt(scrapingData);

      console.log("Generating SEO report for job:", args.reportId);

      // Save prompt into the database for debugging
      await ctx.runMutation(internal.scraping.SaveAnalysisPrompt, {
        reportId: args.reportId,
        prompt: analysisPrompt,
      });

      console.log("Prompt saved for job:", args.reportId);

        const { object: seoReport } = await generateObject({
          model: google("gemini-2.5-flash"),
          system: systemPrompt(),
          prompt: analysisPrompt,
          schema: seoReportSchema,
        });


      // Step 2: Save the SEO report to the database
        await ctx.runMutation(internal.scraping.saveReport, {
          reportId: args.reportId,
          seoReport: seoReport,
        });

        console.log("SEO report saved for job:", args.reportId);

      // Step 3: Complete the job (mark as completed)
        await ctx.runMutation(internal.scraping.completeJob, {
          reportId: args.reportId,
        });

        console.log(`Job ${args.reportId} analysis completed successfully`);

      return null;
    } catch (error) {
      console.log(error);
      // Set job status to failed when analysis fails
      try {
        await ctx.runMutation(api.scraping.failJob, {
          reportId: args.reportId,
          error: "Unknown error occurred during analysis",
        });
      } catch (failError) {
        console.error("Failed to update job status to failed:", failError);
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
    console.log("Retrying analysis only :", args.reportId);

    // Reset analysis status
    await ctx.runMutation(internal.scraping.RetryAnalysisState, {
      reportId: args.reportId,
    });

    // Run the analysis
    await ctx.runAction(api.analysis.runAnalysis, {
      reportId: args.reportId,
    });

    return null;
  },
});
