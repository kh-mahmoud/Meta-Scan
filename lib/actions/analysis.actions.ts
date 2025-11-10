"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { RetryAnalysisResult } from "@/types";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


export const runAnalysis = async()=>{
      try {
        
      } catch (error) {
        
      }
}

export const retryAnalysis = async (
  reportId: Id<"reports">
): Promise<RetryAnalysisResult> => {
  try {
    await convex.action(api.analysis.retryAnalysis, { reportId });

    return {
      ok: true,
      message: "Analysis retry started successfully",
    };
  } catch (error) {
    console.log(error);
    await convex.mutation(api.scraping.failJob, {
      reportId,
      error: "Failed to retry analysis",
    });
    return {
      ok: false,
      message: "Failed to retry analysis",
    };
  }
};
