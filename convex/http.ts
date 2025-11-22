import { httpRouter } from "convex/server";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret!);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (e) {
    console.log("error verifying", e);
    return;
  }

  return evt as unknown as WebhookEvent;
}

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", {
      status: 400,
    });
  }
  switch (event.type) {
    case "user.created": {
      await ctx.runMutation(internal.users.createUser, {
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
        name: event.data.first_name!,
        avatar: event.data.image_url,
      });
      break;
    }

    case "user.updated": {
      await ctx.runMutation(internal.users.updateUser, {
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
        name: event.data.first_name!,
        avatar: event.data.image_url,
      });
      break;
    }

    case "user.deleted": {
      await ctx.runMutation(internal.users.deleteUser, {
        clerkId: event.data.id!,
      });
      break;
    }

    default: {
      console.log("ignored Clerk webhook event", event.type);
    }
  }

  return new Response(null, {
    status: 200,
  });
});

const handleScrapingWebhook = httpAction(async (ctx, request) => {
    //ectract the tracking id of the report from the url
  const url = new URL(request.url);
  const reportId = url.searchParams.get("reportId") as Id<"reports">;

  if (!reportId) throw new Error("Missing reportId");
  
  const data = await request.json();

  let id;

  try {
    //step 1 save the raw data (scraped data)
    const report = await ctx.runQuery(api.scraping.GetReportById, {
      reportId,
    });

    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.runMutation(internal.scraping.saveRawScrapingData, {
      reportId,
      rawData: data,
    });

    //step 2 run the analysis of the scraped data
    id = await ctx.scheduler.runAfter(0, api.analysis.runAnalysis, {
      reportId,
    });

    return new Response("Success", {status: 200});
  } catch (error) {
    console.log(error);
    if (id) {
      await ctx.runMutation(api.scraping.failJob, {
        reportId,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error occurred during analysis",
      });
    }
    return new Response("Failed", { status: 500 });
  }
});




const http = httpRouter();


http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

http.route({
  path: "/api/scraper",
  method: "POST",
  handler: handleScrapingWebhook,
});

export default http;
