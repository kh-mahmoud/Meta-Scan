"use server";

import { api } from "@/convex/_generated/api";
import { scrapeProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";
import { retryAnalysis } from "./analysis.actions";
import { buildScrapingPrompt } from "../utils";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

//start the search and data scraping
export const Scrape = async ({ prompt, country, reportId }: scrapeProps) => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  //id to track the scraping
  let scrapeId = reportId;

  //if the scraping result already exists we retry the analysis
  if (reportId) {
    //check if we can do analysis
    const check = await convex.query(api.scraping.canRetryAnalysis, {
      reportId,
      userId,
    });
    //if true
    if (check.canRetryAnalysisOnly) {
      const result = await retryAnalysis(reportId);

      if (result?.ok) {
        return {
          ok: true,
          data: { snapshot_id: null },
          reportId: reportId,
          smartRetry: true,
        };
      } else {
        //error in retry
        return {
          ok: false,
          error: "retry failed",
        };
      }
    } else {
      //prepare to scrape report again
      await convex.mutation(api.scraping.retryScrapingState, {
        reportId: reportId,
      });
    }
  } else {
    //save new scrapîng operation
    scrapeId = await convex.mutation(api.scraping.createScrapingJob, {
      userId,
      ScrapePrompt: prompt,
    });
  }

  //launch data scraping

  const EndPoint = `${process.env.CONVEX_URL_WEBHOOK}?reportId=${scrapeId}`;
  const encodedEndpoint = encodeURI(EndPoint);

  const url = `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${process.env.DATASET_ID}&endpoint=${encodedEndpoint}&format=json&uncompressed_webhook=true&include_errors=true`;
  const ScrapingPrompt = buildScrapingPrompt(prompt);

  try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BRIGHTDATA_API_kEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [
          {
            url: "https://www.perplexity.ai",
            prompt: ScrapingPrompt,
            country,
            index: 1,
          },
        ],
        custom_output_fields: [
          "url",
          "prompt",
          "answer_text",
          "sources",
          "citations",
          "timestamp",
          "input",
        ],
      }),
    });

    if (!result.ok && scrapeId) {
      await convex.mutation(api.scraping.failJob, {
        reportId: scrapeId,
        error: "scraping failed",
      });

      return {
        ok: false,
        error: `failed to scrape data`,
      };
    }

    //after the data done scraping it return a snapshot_id and send the result to the webhook
    const data = await result.json().catch(() => null);


    if (data && data.snapshot_id) {
      await convex.mutation(api.scraping.updateJobWithSnapshotId, {
        reportId: scrapeId as Id<"reports">,
        snapshotId: data.snapshot_id,
      });
    }

    return { ok: true, data, scrapeId };
  } catch (error) {
    console.log(error);
    await convex.mutation(api.scraping.failJob, {
      reportId: scrapeId as Id<"reports">,
      error: "scraping failed",
    });
  }
};
