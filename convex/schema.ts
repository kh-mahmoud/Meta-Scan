import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reports: defineTable({
    creator: v.string(),
    //prompt used to scrape from preplexity
    scrapePrompt: v.string(),
    //prompt used to analyze the scraped data
    analysisPrompt: v.optional(v.string()),
    //trackingId
    snapshotId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    //analyzed result
    results: v.optional(v.array(v.any())),
    //structed analyzed result (seo)
    seoReport: v.optional(v.any()),
    error: v.optional(v.string()),

    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }),
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    email: v.string(),
    avatar: v.string(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_name", ["email"]),
});
