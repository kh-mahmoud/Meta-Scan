import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    name: v.string(),
    clerkId: v.string(),
    email: v.string(),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      clerkId: args.clerkId,
      avatar: args.avatar,
      updatedAt: Date.now(),
    });
    return user;
  },
});


export const updateUser = internalMutation({
  args: {
    name: v.optional(v.string()),
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
      const user = await ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!)).first();

      if(!user) throw new Error("User not found")

      await ctx.db.patch(user._id, {
        name: args.name,
        email: args.email,
        avatar: args.avatar,
        updatedAt: Date.now(),
      });
      return user
  },
});

export const deleteUser = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
      const user = await ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!)).unique();
      const reports = await ctx.db.query("reports").withIndex("by_creator", (q) => q.eq("creator", user!._id)).collect();
      if(!user) throw new Error("User not found")

      await ctx.db.delete(user._id);
      await Promise.all(reports.map(async(report)=>(
         await ctx.db.delete(report._id)
      )))
      return user
  },
});

