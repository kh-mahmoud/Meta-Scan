import { api } from "@/convex/_generated/api";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  InferUITools,
  streamText,
  tool,
  UIDataTypes,
  UIMessage,
} from "ai";
import { ConvexHttpClient } from "convex/browser";
import { GoogleGenAI } from "@google/genai";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

//web search tool
export const myTool = {
  web_search: tool({
    description: "Get the answer from the web",
    inputSchema: z.object({
      prompt: z.string().describe("The query to use for search web"),
    }),
    execute: async ({ prompt }) => {
      const groundingTool = {
        googleSearch: {},
      };

      const config = {
        tools: [groundingTool],
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config,
      });

      return response.text;
    },
  }),
};

//chat messages types
export type chatTools = InferUITools<typeof myTool>;
export type chatMessages = UIMessage<never, UIDataTypes, chatTools>;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is not set");
  }

  const {messages,seoReportId}: { messages: UIMessage[]; seoReportId: string } = await req.json();

  let seoReportData = null;
  let systemPrompt ="You are an AI assistant helping users understand their SEO report";
//produce a systeme prompt depend on the report
  try {
    if (seoReportId) {
      const report = await convex.query(api.scraping.GetReportBySnapshotId, {
        snapshotId: seoReportId,
      });
      if (report?.seoReport) {
        seoReportData = report.seoReport;
        systemPrompt = `You are an AI assistant that ONLY helps  users understand their SEO report.
CURRENT SEO REPORT DATA:
${JSON.stringify(seoReportData, null, 2)}

You have access to comprehensive SEO analysis data for "${seoReportData.meta?.entity_name || "the entity"}" (${seoReportData.meta?.entity_type || "unknown type"}).

STRICT BEHAVIOR RULES (DO NOT BREAK THESE):

1.  You must ONLY answer questions related to the SEO report data provided below.
2.  If the user asks ANY unrelated question (example: weather, time, coding, history, general knowledge), you MUST politely refuse and say:
   "I can only help with questions related to this SEO report. Please ask something about your SEO data."
3.  You are NOT allowed to use the "web_search" tool unless:
   - The user explicitly asks to "search", "lookup", or "check online", AND
   -nThe query is directly related to SEO, search engines, domains, competitors, or keywords in the report.
4. NEVER use web_search for unrelated real-time or general questions (ex: “time in Paris”, “latest news”, “distance between cities”, etc.)
5.  If the question can be answered using the SEO report data, YOU MUST answer ONLY from the report—do NOT use external sources.

Key areas you can help with:
- Overall SEO performance and confidence score
- Source inventory and domain analysis  
- Competitor analysis and market positioning
- Keyword analysis and search visibility
- Backlink profile and authority metrics
- Content gaps and optimization opportunities
- Actionable recommendations for improvement

You MUST NOT call the "web_search" tool unless:
- The user explicitly asks for a search or "look it up".
- The question requires real-time, external, or verifiable data that you cannot reasonably infer.
- You are uncertain and cannot reliably answer using the given information.

If the question can be answered using the SEO report, internal knowledge, or general reasoning, DO NOT use web_search.
Use the web_search tool to answer questions about the SEO report if it will help you answer the question.

Provide specific, data-driven insights based on the actual report data. When referencing metrics, use the exact numbers from the report. Be conversational but informative.`;
      } else {
        systemPrompt += `\n\nNote: SEO report with ID "${report?._id}" was found but analysis may still be in progress or failed. Please check the report status.`;
      }
    }

//stream the ai reponse 
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      tools:myTool,
      toolChoice: "auto",
    });

    return result.toUIMessageStreamResponse({ sendSources: true });
  } catch (error) {
    console.log(error);
  }
}
