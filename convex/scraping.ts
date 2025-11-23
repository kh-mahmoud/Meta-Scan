import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

//report status updates
export const createScrapingJob = mutation({
  args: {
    ScrapePrompt: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      throw new Error("User ID is required");
    }

    return await ctx.db.insert("reports", {
      creator: args.userId,
      scrapePrompt: args.ScrapePrompt,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const saveRawScrapingData = internalMutation({
  args: {
    reportId: v.id("reports"),
    rawData: v.array(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      results: args.rawData,
      status: "analyzing",
      error: undefined,
    });
    return null;
  },
});

export const setJobToAnalyzing = mutation({
  args: {
    reportId: v.id("reports"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: "analyzing",
      error: undefined,
    });
    return null;
  },
});

export const retryScrapingState = mutation({
  args: {
    reportId: v.id("reports"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    //check user auth
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) throw new Error("user not found");

    await ctx.db.patch(args.reportId, {
      status: "pending",
      error: undefined,
      completedAt: undefined,
      results: undefined,
      seoReport: undefined,
      snapshotId: undefined,
    });
    return null;
  },
});

export const completeJob = internalMutation({
  args: {
    reportId: v.id("reports"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: "completed",
      completedAt: Date.now(),
      error: undefined,
    });
    return null;
  },
});

export const failJob = mutation({
  args: {
    reportId: v.id("reports"),
    error: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: "failed",
      error: args.error,
      completedAt: Date.now(),
    });
    return null;
  },
});

export const RetryAnalysisState = internalMutation({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: "analyzing",
      error: undefined,
      completedAt: undefined,
      seoReport: undefined,
    });
    return null;
  },
});

//check if we can retry analysis
export const canRetryAnalysis = query({
  args: {
    reportId: v.id("reports"),
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report || report.creator !== args.userId) {
      return {
        canRetryAnalysisOnly: false,
        hasScrapingData: false,
        hasAnalysisPrompt: false,
      };
    }

    const hasScrapingData = report.results && report.results.length > 0;
    const hasAnalysisPrompt = report.analysisPrompt;

    const canRetryAnalysisOnly = hasScrapingData && hasAnalysisPrompt;

    return {
      canRetryAnalysisOnly,
      hasScrapingData,
      hasAnalysisPrompt,
    };
  },
});

export const updateJobWithSnapshotId = mutation({
  args: {
    reportId: v.id("reports"),
    snapshotId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      snapshotId: args.snapshotId,
      status: "running",
      error: undefined,
    });
    return null;
  },
});

export const SaveAnalysisPrompt = internalMutation({
  args: {
    reportId: v.id("reports"),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("No report found");
    }

    return await ctx.db.patch(args.reportId, {
      analysisPrompt: args.prompt,
    });
  },
});

export const GetReportById = query({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("No report found");
    }

    return report;
  },
});

export const GetReportBySnapshotId = query({
  args: {
    snapshotId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const report = await ctx.db
        .query("reports")
        .withIndex("by_snapshot", (q) => q.eq("snapshotId", args.snapshotId))
        .first();

      if (!report) throw new Error("No report found");

      return report;
    } catch (error) {
      console.log(error);
    }
  },
});

export const deleteReport = mutation({
  args: {
    reportId: v.id("reports"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reportId);
    return null;
  },
});

export const saveReport = internalMutation({
  args: {
    reportId: v.id("reports"),
    seoReport: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.reportId, {
      seoReport: args.seoReport,
    });
  },
});

export const getUserReports = query({
  args:{},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("user not found");

    const reports = await ctx.db
      .query("reports")
      .withIndex("by_creator", (q) => q.eq("creator", identity.subject))
      .order("desc")
      .collect();

      return reports
  },
});
