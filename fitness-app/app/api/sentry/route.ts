import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Always forward directly to your ingest endpoint
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

  return new Response(null, { status: sentryResp.status });
}
