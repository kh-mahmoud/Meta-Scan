import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
users: defineTable({
  name: v.string(),
  clerkId: v.string(),
  email: v.string(),
  avatar: v.string(),
  updatedAt: v.number(),
})
.index("by_clerkId",["clerkId"])
.index("by_name",["email"])
});