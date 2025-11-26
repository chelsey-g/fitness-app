import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Log all headers for debugging
    console.log("Sentry tunnel - Headers:", Object.fromEntries(req.headers.entries()));
    
    // Validate the request has the correct content type
    const contentType = req.headers.get("content-type");
    console.log("Sentry tunnel - Content-Type:", contentType);
    
    if (!contentType || !contentType.includes("application/x-sentry-envelope")) {
      console.log("Sentry tunnel - Invalid content type:", contentType);
      return new Response("Invalid content type", { status: 400 });
    }

    const body = await req.text();
    console.log("Sentry tunnel - Body length:", body.length);
    console.log("Sentry tunnel - Body preview:", body.substring(0, 200));
    
    // Validate that we have a body
    if (!body) {
      console.log("Sentry tunnel - Empty request body");
      return new Response("Empty request body", { status: 400 });
    }

    // Forward to Sentry's ingest endpoint
    console.log("Sentry tunnel - Forwarding to Sentry...");
    const sentryResp = await fetch(
      "https://o4504181161656320.ingest.us.sentry.io/api/4507351787634688/envelope/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-sentry-envelope",
        },
        body,
      }
    );

    console.log("Sentry tunnel - Sentry response status:", sentryResp.status);
    
    // Return the same status code that Sentry returned
    return new Response(null, { status: sentryResp.status });
  } catch (error) {
    console.error("Sentry tunnel error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
